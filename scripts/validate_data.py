#!/usr/bin/env python3
"""Validate the AI supply-chain research CSVs.

The validator intentionally checks structural integrity and project-boundary
rules. It does not try to prove every market claim is true; source-backed
research still requires human review.
"""

from __future__ import annotations

import csv
import sys
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

SCHEMAS = {
    "categories.csv": [
        "category_id",
        "parent_category_id",
        "level",
        "name",
        "description",
        "why_it_matters",
        "bottleneck_level",
        "notes",
    ],
    "nodes.csv": [
        "node_id",
        "parent_node_id",
        "level",
        "name",
        "node_type",
        "description",
        "why_it_matters",
        "depends_on",
        "dependency_type",
        "bottleneck_level",
        "substitutability",
        "time_horizon",
        "confidence",
        "notes",
    ],
    "edges.csv": [
        "source_node_id",
        "target_node_id",
        "relationship_type",
        "relationship_description",
        "criticality",
        "confidence",
        "source_id",
    ],
    "companies_public_us_listed.csv": [
        "company_id",
        "name",
        "ticker",
        "exchange",
        "country",
        "category_node_id",
        "role",
        "rank_within_node",
        "market_segment",
        "pure_play_score",
        "why_top_3",
        "bottleneck_exposure",
        "key_risks",
        "time_horizon",
        "confidence",
        "source_id",
    ],
    "companies_non_investable_bottlenecks.csv": [
        "company_id",
        "name",
        "country",
        "public_private_state",
        "listing_status",
        "category_node_id",
        "role",
        "why_it_matters",
        "why_not_investable_under_project_rules",
        "bottleneck_exposure",
        "key_risks",
        "confidence",
        "source_id",
    ],
    "watchlist_private_spac_ipo.csv": [
        "company_id",
        "name",
        "current_status",
        "rumored_or_announced_public_path",
        "related_supply_chain_node",
        "why_it_matters",
        "estimated_maturity",
        "risks",
        "source_id",
        "confidence",
    ],
    "minerals_to_ai_inputs.csv": [
        "mineral_id",
        "mineral_name",
        "ai_use_case",
        "used_in_component",
        "upstream_source_material",
        "processing_step",
        "substitutability",
        "bottleneck_level",
        "us_import_dependency_if_known",
        "confidence",
        "source_id",
        "notes",
    ],
    "mineral_supplier_mapping.csv": [
        "supplier_id",
        "company_name",
        "ticker_if_us_listed",
        "exchange_if_us_listed",
        "country",
        "mineral_or_material",
        "role",
        "mining_processing_refining",
        "investable_under_project_rules",
        "why_relevant",
        "key_risks",
        "confidence",
        "source_id",
    ],
    "sources.csv": [
        "source_id",
        "title",
        "publisher",
        "url",
        "date_accessed",
        "source_type",
        "reliability_score",
        "notes",
    ],
    "open_questions.csv": [
        "question_id",
        "related_node_id",
        "question",
        "why_it_matters",
        "priority",
        "suggested_research_path",
    ],
}

REQUIRED_NON_CSV = [
    "README.md",
    "CLAUDE.md",
    "taxonomy/ai_supply_chain_taxonomy.md",
    "taxonomy/ai_supply_chain_tree.mmd",
    "taxonomy/ai_supply_chain_dependency_graph.mmd",
    "taxonomy/ai_supply_chain_investable_map.mmd",
    "taxonomy/methodology.md",
    "docs/how_to_edit.md",
    "docs/assumptions_and_boundaries.md",
    "docs/visual_design_guide.md",
    "docs/investor_research_notes.md",
    "docs/update_log.md",
]

APPROVED_EXCHANGES = {"NYSE", "NASDAQ", "NYSE_AMERICAN", "NYSE AMERICAN"}
BANNED_PUBLIC_NAMES = {
    "openai",
    "anthropic",
    "xai",
    "databricks",
    "cerebras",
    "groq",
    "sambanova",
    "tenstorrent",
    "scale ai",
    "surge ai",
    "coolit",
    "liquidstack",
    "submer",
    "sibelco",
    "the quartz corp",
    "zeiss",
    "sk hynix",
    "samsung electronics",
    "tokyo electron",
    "disco corporation",
    "screen holdings",
    "jsr",
    "tokyo ohka",
    "shin-etsu",
}
LOCAL_TICKER_MARKERS = (".T", ".KS", ".TW", ".HK", ".SS", ".SZ", ".MI", ".PA", ".AS", ".L")
OTC_TICKERS = {"ABBNY", "SBGSY", "SIEGY", "HTHIY", "GLNCY", "AIQUY", "MTSFY", "MHVYF"}
MISSING_MARKERS = {"", "N/A", "NA", "NONE", "NULL"}


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.counts: dict[str, int] = {}

    def error(self, message: str) -> None:
        self.errors.append(message)

    def warn(self, message: str) -> None:
        self.warnings.append(message)


def read_csv(filename: str, report: Report) -> list[dict[str, str]]:
    path = DATA / filename
    if not path.exists():
        report.error(f"Missing required CSV: data/{filename}")
        return []

    try:
        with path.open(newline="", encoding="utf-8-sig") as handle:
            reader = csv.DictReader(handle)
            header = reader.fieldnames or []
            expected = SCHEMAS[filename]
            if header != expected:
                report.error(
                    f"Schema mismatch in data/{filename}: expected {expected}, found {header}"
                )
            rows = list(reader)
    except csv.Error as exc:
        report.error(f"CSV parse error in data/{filename}: {exc}")
        return []

    report.counts[filename] = len(rows)
    return rows


def split_source_ids(raw: str) -> list[str]:
    if raw is None:
        return []
    parts = []
    for chunk in raw.replace("|", ";").split(";"):
        value = chunk.strip()
        if value and value.upper() not in MISSING_MARKERS:
            parts.append(value)
    return parts


def normalized_exchange(value: str) -> str:
    return value.strip().upper().replace("-", "_")


def duplicate_values(rows: list[dict[str, str]], key: str) -> list[str]:
    counts = Counter(row.get(key, "").strip() for row in rows if row.get(key, "").strip())
    return sorted(value for value, count in counts.items() if count > 1)


def validate_required_files(report: Report) -> None:
    for relative in REQUIRED_NON_CSV:
        if not (ROOT / relative).exists():
            report.error(f"Missing required file: {relative}")


def validate_ids(
    rows: list[dict[str, str]],
    filename: str,
    id_column: str,
    report: Report,
) -> set[str]:
    ids = {row.get(id_column, "").strip() for row in rows if row.get(id_column, "").strip()}
    for value in duplicate_values(rows, id_column):
        report.error(f"Duplicate {id_column} in data/{filename}: {value}")
    for index, row in enumerate(rows, start=2):
        if not row.get(id_column, "").strip():
            report.error(f"Blank {id_column} in data/{filename} line {index}")
    return ids


def validate_parent_links(
    rows: list[dict[str, str]],
    filename: str,
    id_column: str,
    parent_column: str,
    valid_ids: set[str],
    report: Report,
) -> None:
    for index, row in enumerate(rows, start=2):
        parent = row.get(parent_column, "").strip()
        if parent and parent not in valid_ids:
            report.error(
                f"Invalid {parent_column} in data/{filename} line {index}: {parent}"
            )


def validate_source_references(
    filename: str,
    rows: list[dict[str, str]],
    source_ids: set[str],
    report: Report,
) -> None:
    if "source_id" not in SCHEMAS[filename]:
        return
    for index, row in enumerate(rows, start=2):
        for source_id in split_source_ids(row.get("source_id", "")):
            if source_id not in source_ids:
                report.error(
                    f"Unknown source_id in data/{filename} line {index}: {source_id}"
                )


def validate_graph(
    node_rows: list[dict[str, str]],
    edge_rows: list[dict[str, str]],
    node_ids: set[str],
    report: Report,
) -> None:
    validate_parent_links(node_rows, "nodes.csv", "node_id", "parent_node_id", node_ids, report)

    for index, row in enumerate(edge_rows, start=2):
        source = row.get("source_node_id", "").strip()
        target = row.get("target_node_id", "").strip()
        if source not in node_ids:
            report.error(f"Invalid edge source in data/edges.csv line {index}: {source}")
        if target not in node_ids:
            report.error(f"Invalid edge target in data/edges.csv line {index}: {target}")


def validate_categories(
    category_rows: list[dict[str, str]],
    category_ids: set[str],
    report: Report,
) -> None:
    validate_parent_links(
        category_rows,
        "categories.csv",
        "category_id",
        "parent_category_id",
        category_ids,
        report,
    )


def validate_company_links(
    filename: str,
    rows: list[dict[str, str]],
    valid_node_or_category_ids: set[str],
    report: Report,
) -> None:
    for index, row in enumerate(rows, start=2):
        node_id = row.get("category_node_id", "").strip()
        if node_id not in valid_node_or_category_ids:
            report.error(
                f"Invalid category_node_id in data/{filename} line {index}: {node_id}"
            )


def validate_watchlist_links(
    rows: list[dict[str, str]],
    valid_node_or_category_ids: set[str],
    report: Report,
) -> None:
    for index, row in enumerate(rows, start=2):
        node_id = row.get("related_supply_chain_node", "").strip()
        if node_id and node_id not in valid_node_or_category_ids:
            report.error(
                "Invalid related_supply_chain_node in "
                f"data/watchlist_private_spac_ipo.csv line {index}: {node_id}"
            )


def validate_open_question_links(
    rows: list[dict[str, str]],
    valid_node_or_category_ids: set[str],
    report: Report,
) -> None:
    for index, row in enumerate(rows, start=2):
        node_id = row.get("related_node_id", "").strip()
        if node_id and node_id not in valid_node_or_category_ids:
            report.error(
                f"Invalid related_node_id in data/open_questions.csv line {index}: {node_id}"
            )


def validate_public_company_universe(
    rows: list[dict[str, str]],
    report: Report,
) -> None:
    ranks_by_node: dict[tuple[str, str], str] = {}
    ids_by_node: defaultdict[str, set[str]] = defaultdict(set)

    for index, row in enumerate(rows, start=2):
        name = row.get("name", "").strip()
        ticker = row.get("ticker", "").strip().upper()
        exchange = row.get("exchange", "").strip()
        node_id = row.get("category_node_id", "").strip()
        rank = row.get("rank_within_node", "").strip()

        if not ticker:
            report.error(
                f"Blank ticker in public company file line {index}: {row.get('company_id')}"
            )

        exchange_norm = normalized_exchange(exchange)
        if exchange_norm not in APPROVED_EXCHANGES:
            report.error(
                "Unapproved exchange in public company file "
                f"line {index}: {ticker} exchange={exchange}"
            )

        if ticker in OTC_TICKERS:
            report.error(f"OTC/unsponsored ADR ticker in public file line {index}: {ticker}")

        if any(ticker.endswith(marker) for marker in LOCAL_TICKER_MARKERS):
            report.error(
                f"Local non-U.S. ticker marker in public file line {index}: {ticker}"
            )

        lower_name = name.lower()
        for banned in BANNED_PUBLIC_NAMES:
            if banned in lower_name:
                report.error(
                    f"Likely private/non-investable company in public file line {index}: {name}"
                )

        if rank and rank.upper() not in MISSING_MARKERS:
            if not rank.isdigit():
                report.error(
                    f"Unexpected rank_within_node in public file line {index}: {rank}"
                )
            else:
                key = (node_id, rank)
                if key in ranks_by_node:
                    report.error(
                        "Duplicate company ranking inside same node: "
                        f"{node_id} rank {rank} used by {ranks_by_node[key]} and "
                        f"{row.get('company_id')}"
                    )
                ranks_by_node[key] = row.get("company_id", "")

        company_key = row.get("company_id", "").strip()
        if company_key in ids_by_node[node_id]:
            report.error(
                f"Duplicate company_id within node {node_id} in public file: {company_key}"
            )
        ids_by_node[node_id].add(company_key)


def validate_supplier_flags(
    rows: list[dict[str, str]],
    report: Report,
) -> None:
    valid_flags = {"yes", "no", "partial"}
    for index, row in enumerate(rows, start=2):
        flag = row.get("investable_under_project_rules", "").strip().lower()
        ticker = row.get("ticker_if_us_listed", "").strip()
        exchange = row.get("exchange_if_us_listed", "").strip()
        if flag not in valid_flags:
            report.error(
                "Invalid investable_under_project_rules in "
                f"data/mineral_supplier_mapping.csv line {index}: {flag}"
            )
        if flag == "yes":
            if not ticker or normalized_exchange(exchange) not in APPROVED_EXCHANGES:
                report.error(
                    "Supplier marked investable=yes without approved U.S. listing "
                    f"line {index}: {row.get('company_name')}"
                )
        if flag == "no" and ticker and normalized_exchange(exchange) in APPROVED_EXCHANGES:
            report.warn(
                "Supplier has U.S. ticker but is marked investable=no "
                f"line {index}: {row.get('company_name')}"
            )


def validate_controlled_vocab(rows_by_file: dict[str, list[dict[str, str]]], report: Report) -> None:
    vocab = {
        "confidence": {"high", "medium", "low"},
        "bottleneck_level": {"severe", "high", "medium", "low"},
        "substitutability": {"none", "low", "medium", "high"},
        "time_horizon": {"short", "medium", "long"},
        "pure_play_score": {"high", "medium", "low"},
        "priority": {"high", "medium", "low"},
    }
    for filename, rows in rows_by_file.items():
        for index, row in enumerate(rows, start=2):
            for column, allowed in vocab.items():
                if column not in row:
                    continue
                value = row.get(column, "").strip().lower()
                if value and value.upper() not in MISSING_MARKERS and value not in allowed:
                    report.error(
                        f"Unexpected {column} in data/{filename} line {index}: {value}"
                    )


def print_report(report: Report) -> None:
    print("AI supply-chain data validation report")
    print("=" * 42)
    print(f"Repository: {ROOT}")
    print()

    print("Row counts")
    for filename in sorted(SCHEMAS):
        count = report.counts.get(filename, 0)
        print(f"  data/{filename}: {count}")
    print()

    if report.warnings:
        print("Warnings")
        for warning in report.warnings:
            print(f"  WARN: {warning}")
        print()

    if report.errors:
        print("Errors")
        for error in report.errors:
            print(f"  FAIL: {error}")
        print()
        print(f"Validation failed with {len(report.errors)} error(s).")
    else:
        print("All validation checks passed.")


def main() -> int:
    report = Report()
    validate_required_files(report)

    rows_by_file = {
        filename: read_csv(filename, report)
        for filename in SCHEMAS
    }

    category_ids = validate_ids(
        rows_by_file["categories.csv"], "categories.csv", "category_id", report
    )
    node_ids = validate_ids(rows_by_file["nodes.csv"], "nodes.csv", "node_id", report)
    source_ids = validate_ids(
        rows_by_file["sources.csv"], "sources.csv", "source_id", report
    )
    validate_ids(
        rows_by_file["companies_public_us_listed.csv"],
        "companies_public_us_listed.csv",
        "company_id",
        report,
    )
    validate_ids(
        rows_by_file["companies_non_investable_bottlenecks.csv"],
        "companies_non_investable_bottlenecks.csv",
        "company_id",
        report,
    )
    validate_ids(
        rows_by_file["watchlist_private_spac_ipo.csv"],
        "watchlist_private_spac_ipo.csv",
        "company_id",
        report,
    )
    validate_ids(
        rows_by_file["minerals_to_ai_inputs.csv"],
        "minerals_to_ai_inputs.csv",
        "mineral_id",
        report,
    )
    validate_ids(
        rows_by_file["mineral_supplier_mapping.csv"],
        "mineral_supplier_mapping.csv",
        "supplier_id",
        report,
    )
    validate_ids(
        rows_by_file["open_questions.csv"],
        "open_questions.csv",
        "question_id",
        report,
    )

    valid_node_or_category_ids = node_ids | category_ids
    validate_categories(rows_by_file["categories.csv"], category_ids, report)
    validate_graph(rows_by_file["nodes.csv"], rows_by_file["edges.csv"], node_ids, report)

    for filename in SCHEMAS:
        validate_source_references(filename, rows_by_file[filename], source_ids, report)

    validate_company_links(
        "companies_public_us_listed.csv",
        rows_by_file["companies_public_us_listed.csv"],
        valid_node_or_category_ids,
        report,
    )
    validate_company_links(
        "companies_non_investable_bottlenecks.csv",
        rows_by_file["companies_non_investable_bottlenecks.csv"],
        valid_node_or_category_ids,
        report,
    )
    validate_watchlist_links(
        rows_by_file["watchlist_private_spac_ipo.csv"],
        valid_node_or_category_ids,
        report,
    )
    validate_open_question_links(
        rows_by_file["open_questions.csv"],
        valid_node_or_category_ids,
        report,
    )
    validate_public_company_universe(
        rows_by_file["companies_public_us_listed.csv"],
        report,
    )
    validate_supplier_flags(rows_by_file["mineral_supplier_mapping.csv"], report)
    validate_controlled_vocab(rows_by_file, report)

    print_report(report)
    return 1 if report.errors else 0


if __name__ == "__main__":
    sys.exit(main())
