import { ArrowDownUp, Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadExplorerData } from '../data/loaders';
import type { BottleneckLevel, CompanyStatus, Confidence, SupplyChainNode } from '../data/schema';
import { isUsListed, uniqueGeographies, uniqueLayers } from '../lib/filters';
import { cn } from '../lib/cn';
import { searchSupplyChain } from '../lib/search';

const data = loadExplorerData();
const statuses: CompanyStatus[] = ['us_listed_public', 'us_listed_adr', 'private', 'state_owned', 'non_us_listed', 'watchlist_private_ipo_spac'];
const bottlenecks: BottleneckLevel[] = ['critical', 'high', 'medium', 'low'];
const confidences: Confidence[] = ['high', 'medium', 'low'];

type SortKey = 'company' | 'ticker' | 'layer' | 'bottleneck' | 'geography' | 'purePlayScore' | 'confidence';
type SortDirection = 'asc' | 'desc';

export function Companies(): JSX.Element {
  const navigate = useNavigate();
  const companies = useMemo(() => data.nodes.filter((node) => node.type === 'company' || node.type === 'watchlist'), []);
  const layers = useMemo(() => uniqueLayers(companies), [companies]);
  const geographies = useMemo(() => uniqueGeographies(companies), [companies]);
  const [query, setQuery] = useState('');
  const [layer, setLayer] = useState('');
  const [bottleneck, setBottleneck] = useState('');
  const [geography, setGeography] = useState('');
  const [status, setStatus] = useState('');
  const [confidence, setConfidence] = useState('');
  const [usListedOnly, setUsListedOnly] = useState(false);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('company');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filtered = useMemo(() => {
    const searched = query ? searchSupplyChain(companies, query) : companies;
    return searched
      .filter((node) => !layer || node.layer === layer)
      .filter((node) => !bottleneck || node.bottleneckLevel === bottleneck)
      .filter((node) => !geography || node.country === geography)
      .filter((node) => !status || node.status === status)
      .filter((node) => !confidence || node.confidence === confidence)
      .filter((node) => !usListedOnly || isUsListed(node.status))
      .filter((node) => !criticalOnly || node.bottleneckLevel === 'critical')
      .sort((a, b) => compareCompanies(a, b, sortKey, sortDirection));
  }, [bottleneck, companies, confidence, criticalOnly, geography, layer, query, sortDirection, sortKey, status, usListedOnly]);

  const setSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((value) => (value === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Company Universe</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Companies</h1>
          <p className="mt-2 text-sm text-slate-500">Companies may appear multiple times if they have multiple supply-chain roles.</p>
        </header>

        <div className="mb-4 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by company, ticker, role, layer, geography, risk..."
              className="h-9 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>
          <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
            <Select label="Layer" value={layer} onChange={setLayer} options={layers} allLabel="All layers" />
            <Select label="Bottleneck" value={bottleneck} onChange={setBottleneck} options={bottlenecks} allLabel="All bottlenecks" />
            <Select label="Geography" value={geography} onChange={setGeography} options={geographies} allLabel="All geographies" />
            <Select label="Status" value={status} onChange={setStatus} options={statuses} allLabel="All statuses" />
            <Select label="Confidence" value={confidence} onChange={setConfidence} options={confidences} allLabel="All confidence" />
            <div className="flex items-end gap-2">
              <Toggle active={usListedOnly} onClick={() => setUsListedOnly((value) => !value)}>U.S.-listed</Toggle>
              <Toggle active={criticalOnly} onClick={() => setCriticalOnly((value) => !value)}>Critical</Toggle>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/70 shadow-2xl">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-900/90 text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <SortableHeader label="Company" sortKey="company" activeKey={sortKey} direction={sortDirection} onSort={setSort} />
                <SortableHeader label="Ticker" sortKey="ticker" activeKey={sortKey} direction={sortDirection} onSort={setSort} />
                <th className="px-4 py-3">Role / Segment</th>
                <SortableHeader label="Layer" sortKey="layer" activeKey={sortKey} direction={sortDirection} onSort={setSort} />
                <th className="px-4 py-3">Status</th>
                <SortableHeader label="Bottleneck" sortKey="bottleneck" activeKey={sortKey} direction={sortDirection} onSort={setSort} />
                <SortableHeader label="Geography" sortKey="geography" activeKey={sortKey} direction={sortDirection} onSort={setSort} />
                <SortableHeader label="Pure-play" sortKey="purePlayScore" activeKey={sortKey} direction={sortDirection} onSort={setSort} />
                <SortableHeader label="Confidence" sortKey="confidence" activeKey={sortKey} direction={sortDirection} onSort={setSort} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((node) => (
                <tr
                  key={node.id}
                  onClick={() => navigate(`/companies/${node.id}`)}
                  className="cursor-pointer border-t border-slate-800/80 transition hover:bg-blue-500/8"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-blue-200">{node.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{node.role || node.marketSegment || node.description}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-300">{node.ticker ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-300">{node.marketSegment || node.role || 'Role mapping pending'}</td>
                  <td className="px-4 py-3 text-slate-400">{node.layer}</td>
                  <td className="px-4 py-3"><StatusBadge status={node.status} /></td>
                  <td className="px-4 py-3"><LevelBadge level={node.bottleneckLevel} /></td>
                  <td className="px-4 py-3 text-slate-400">{node.country ?? 'Data pending'}</td>
                  <td className="px-4 py-3 capitalize text-slate-300">{node.purePlayScore ?? 'Data pending'}</td>
                  <td className="px-4 py-3"><ConfidenceBadge confidence={node.confidence} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 ? (
            <div className="border-t border-slate-800 px-4 py-10 text-center text-sm text-slate-500">
              No companies match the current filters.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function compareCompanies(a: SupplyChainNode, b: SupplyChainNode, key: SortKey, direction: SortDirection): number {
  const severity = { critical: 0, high: 1, medium: 2, low: 3 };
  const confidence = { high: 0, medium: 1, low: 2 };
  const purePlay = { high: 0, medium: 1, low: 2 };
  const values: Record<SortKey, [string | number, string | number]> = {
    company: [a.label, b.label],
    ticker: [a.ticker ?? '', b.ticker ?? ''],
    layer: [a.layer, b.layer],
    bottleneck: [severity[a.bottleneckLevel ?? 'low'], severity[b.bottleneckLevel ?? 'low']],
    geography: [a.country ?? '', b.country ?? ''],
    purePlayScore: [purePlay[a.purePlayScore ?? 'low'], purePlay[b.purePlayScore ?? 'low']],
    confidence: [confidence[a.confidence ?? 'low'], confidence[b.confidence ?? 'low']],
  };
  const [left, right] = values[key];
  const result = typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right));
  return direction === 'asc' ? result : -result;
}

function Select({ label, value, onChange, options, allLabel }: { label: string; value: string; onChange: (value: string) => void; options: string[]; allLabel: string }): JSX.Element {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        <Filter className="h-3 w-3" />
        {label}
      </span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs capitalize text-slate-200 outline-none">
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('h-9 flex-1 rounded-lg border px-2 text-xs font-semibold transition', active ? 'border-teal-400/60 bg-teal-400/10 text-teal-200' : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-200')}
    >
      {children}
    </button>
  );
}

function SortableHeader({ label, sortKey, activeKey, direction, onSort }: { label: string; sortKey: SortKey; activeKey: SortKey; direction: SortDirection; onSort: (key: SortKey) => void }): JSX.Element {
  return (
    <th className="px-4 py-3">
      <button type="button" onClick={() => onSort(sortKey)} className={cn('inline-flex items-center gap-1 hover:text-blue-200', activeKey === sortKey && 'text-blue-200')}>
        {label}
        <ArrowDownUp className={cn('h-3.5 w-3.5', activeKey === sortKey && direction === 'desc' && 'rotate-180')} />
      </button>
    </th>
  );
}

function StatusBadge({ status }: { status?: CompanyStatus }): JSX.Element {
  const styles = {
    us_listed_public: 'border-green-400/30 bg-green-500/10 text-green-200',
    us_listed_adr: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
    private: 'border-slate-500/40 bg-slate-500/10 text-slate-300',
    state_owned: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
    non_us_listed: 'border-zinc-500/40 bg-zinc-500/10 text-zinc-300',
    watchlist_private_ipo_spac: 'border-lime-400/30 bg-lime-500/10 text-lime-200',
    etf_optional: 'border-indigo-400/30 bg-indigo-500/10 text-indigo-200',
  };
  if (!status) return <span className="text-slate-500">Data pending</span>;
  return <span className={cn('rounded-full border px-2.5 py-1 text-xs font-semibold capitalize', styles[status])}>{status.replaceAll('_', ' ')}</span>;
}

function LevelBadge({ level }: { level?: BottleneckLevel }): JSX.Element {
  const styles = {
    low: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    medium: 'border-blue-400/30 bg-blue-500/10 text-blue-200',
    high: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
    critical: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
  };
  if (!level) return <span className="text-slate-500">Unscored</span>;
  return <span className={cn('rounded-full border px-2.5 py-1 text-xs font-semibold capitalize', styles[level])}>{level}</span>;
}

function ConfidenceBadge({ confidence }: { confidence?: Confidence }): JSX.Element {
  const styles = {
    low: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
    medium: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
    high: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
  };
  if (!confidence) return <span className="text-slate-500">Needs verification</span>;
  return <span className={cn('rounded-full border px-2.5 py-1 text-xs font-semibold capitalize', styles[confidence])}>{confidence}</span>;
}
