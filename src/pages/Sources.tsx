import { Database, ExternalLink, ShieldCheck } from 'lucide-react';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import {
  ChapterCard,
  ConfidenceIndicator,
  DataPendingState,
  HeroSection,
  InsightPanel,
  ReportTable,
  SectionHeader,
  SourceStatusBadge,
  StatCard,
  type ReportTableColumn,
} from '../components/report';
import { getResearchCsvSnapshot, loadExplorerData } from '../data/loaders';
import type { Confidence, Source } from '../data/schema';
import { dataPending, getDerivedReportStats, pendingCopy } from '../lib/reportSelectors';

const data = loadExplorerData();
const snapshot = getResearchCsvSnapshot();

const classificationRules = [
  'U.S.-listed public companies are common shares on major U.S. exchanges.',
  'ADRs are tracked only when they meet the project rules for listed exposure.',
  'Private companies stay in watchlist or non-investable research rows.',
  'Non-U.S.-listed companies remain separate from U.S.-listed company tables.',
  'Non-investable bottlenecks are mapped when they are structurally important but outside the investable universe.',
  'IPO, SPAC, and watchlist names are research tracking entries, not investment advice.',
];

export function Sources(): JSX.Element {
  const stats = getDerivedReportStats(data, snapshot);
  const highReliability = data.sources.filter((source) => source.reliabilityScore === 'high').length;
  const mediumReliability = data.sources.filter((source) => source.reliabilityScore === 'medium').length;

  const columns: ReportTableColumn<Source>[] = [
    {
      id: 'source',
      header: 'Source',
      render: (source) => (
        <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 font-semibold text-foreground hover:text-accent">
          <span>{source.title}</span>
          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
        </a>
      ),
      className: 'min-w-[380px]',
    },
    { id: 'publisher', header: 'Publisher', render: (source) => source.publisher || <DataPendingState /> },
    { id: 'accessed', header: 'Date accessed', render: (source) => dataPending(source.dateAccessed) },
    { id: 'reliability', header: 'Reliability', render: (source) => <ConfidenceIndicator confidence={toConfidence(source.reliabilityScore)} /> },
    { id: 'status', header: 'Source state', render: (source) => <SourceStatusBadge sourceCount={1} confidence={toConfidence(source.reliabilityScore)} /> },
  ];

  return (
    <PageShell>
      <HeroSection
        title="Sources and Confidence"
        subtitle="A credibility chapter for the research map: source rows, confidence scoring, mapping rules, limitations, and classification boundaries."
        stats={
          <>
            <StatCard icon={<Database className="h-4 w-4" />} label="Source rows" value={stats.sources} context="Rows loaded from sources.csv" />
            <StatCard icon={<Database className="h-4 w-4" />} label="Dated sources" value={stats.datedSources} context="Rows with accessed dates" />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="High reliability" value={highReliability} context={`${mediumReliability} medium reliability rows`} />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="Last updated" value={stats.latestSourceDate ?? pendingCopy} context="Latest source access date" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <div className="space-y-6">
          <ContentSection>
            <SectionHeader title="Methodology overview" description="The project maps physical supply-chain roles separately from public-market availability." />
            <div className="grid gap-4 p-5 md:grid-cols-3">
              <ChapterCard icon={<Database className="h-4 w-4" />} title="Mapping first" description="Companies and bottlenecks are attached to supply-chain nodes before any route renders them." />
              <ChapterCard icon={<ShieldCheck className="h-4 w-4" />} title="Confidence visible" description="Confidence remains visible as high, medium, low, partial, verified, or pending instead of being hidden." />
              <ChapterCard icon={<Database className="h-4 w-4" />} title="CSV-backed claims" description="Counts, company rows, materials, bottlenecks, and sources are derived from the current research files." />
            </div>
          </ContentSection>

          <ReportTable
            title="Source table"
            description="Source values come directly from the current CSV-backed data layer."
            columns={columns}
            rows={data.sources}
            getRowKey={(source) => source.id}
          />

          <ContentSection>
            <SectionHeader title="Classification rules" description="These rules keep the product defensible and research-only." />
            <div className="grid gap-3 p-5 md:grid-cols-2">
              {classificationRules.map((rule) => (
                <div key={rule} className="rounded-md border border-border bg-surface-muted px-4 py-3 text-sm leading-6 text-muted-foreground">
                  {rule}
                </div>
              ))}
            </div>
          </ContentSection>
        </div>

        <RightRail>
          <InsightPanel title="Confidence scoring">
            <ul className="space-y-2">
              <li><span className="font-semibold text-foreground">High</span> means a source-backed row has strong support for the mapping.</li>
              <li><span className="font-semibold text-foreground">Medium</span> means useful support with some remaining uncertainty.</li>
              <li><span className="font-semibold text-foreground">Low</span> means the row should be treated as provisional.</li>
            </ul>
          </InsightPanel>

          <InsightPanel title="Research limitations">
            <p>The app is not exhaustive, not real-time, and not a valuation model. Quarterly figures, capacity commentary, and public-path signals can age quickly.</p>
          </InsightPanel>

          <InsightPanel title="How mappings are made">
            <p>Rows are attached to taxonomy nodes, then page selectors derive overview stages, material categories, bottleneck reports, company tables, watchlist groups, and source status from those relationships.</p>
          </InsightPanel>

          <InsightPanel title="Last updated" eyebrow="Source metadata">
            <p>{stats.latestSourceDate ?? pendingCopy}</p>
            <p className="mt-3">If a row lacks a source or date, the UI shows {pendingCopy} instead of filling visual gaps with illustrative data.</p>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}

function toConfidence(value?: Confidence | string): Confidence | undefined {
  return value === 'high' || value === 'medium' || value === 'low' ? value : undefined;
}
