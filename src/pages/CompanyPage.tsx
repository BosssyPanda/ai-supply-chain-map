import { ArrowLeft, Network } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CompanyDetail } from '../components/details/CompanyDetail';
import { MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import { InsightPanel, RiskBadge } from '../components/report';
import { loadExplorerData } from '../data/loaders';
import type { Source, SupplyChainNode } from '../data/schema';

const data = loadExplorerData();

export function CompanyPage(): JSX.Element {
  const { id } = useParams();
  const node = data.nodes.find((item) => item.id === id && (item.type === 'company' || item.type === 'watchlist'));
  const nodesById = new Map(data.nodes.map((item) => [item.id, item]));

  if (!node) {
    return (
      <PageShell>
        <div className="grid min-h-[60vh] place-items-center">
          <div className="rounded-lg border border-border bg-surface p-8 text-center shadow-report-soft">
            <h1 className="font-display text-3xl text-foreground">Company not found</h1>
            <Link to="/companies" className="mt-4 inline-flex text-accent">
              Back to companies
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const upstream = data.edges.filter((edge) => edge.target === node.id).map((edge) => nodesById.get(edge.source)).filter(Boolean) as SupplyChainNode[];
  const downstream = data.edges.filter((edge) => edge.source === node.id).map((edge) => nodesById.get(edge.target)).filter(Boolean) as SupplyChainNode[];
  const sources = node.sourceIds.map((sourceId) => data.sources.find((source) => source.id === sourceId)).filter(Boolean) as Source[];
  const peers = data.nodes.filter((item) => item.id !== node.id && item.type === 'company' && item.layer === node.layer).slice(0, 8);

  return (
    <PageShell>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link to="/companies" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent">
          <ArrowLeft className="h-4 w-4" />
          Back to companies
        </Link>
        <Link
          to={`/supply-chain?focus=${node.id}`}
          className="inline-flex items-center gap-2 rounded-md border border-accent/35 bg-accent-soft px-4 py-2 text-sm font-semibold text-accent"
        >
          <Network className="h-4 w-4" />
          Back to graph focused
        </Link>
      </div>

      <MainContentGrid>
        <section className="rounded-lg border border-border bg-surface p-5 shadow-report-soft">
          <CompanyDetail node={node} upstream={upstream} downstream={downstream} sources={sources} compact />
        </section>
        <RightRail>
          <Panel title="Supply-chain position" value={node.layer} />
          <Panel title="Geography" value={node.country ?? 'Data pending'} />
          <section className="rounded-lg border border-border bg-surface p-4 shadow-report-soft">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Bottleneck</p>
            <div className="mt-2 text-sm text-muted-foreground">{node.bottleneckLevel ? <RiskBadge level={node.bottleneckLevel} /> : 'Data pending'}</div>
          </section>
          <InsightPanel title="Peers / comparables">
            <div className="space-y-2">
              {peers.length > 0 ? peers.map((peer) => (
                <Link key={peer.id} to={`/companies/${peer.id}`} className="block rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground hover:border-accent/45">
                  {peer.label}
                </Link>
              )) : <p className="text-sm text-muted-foreground">Peer mapping pending.</p>}
            </div>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}

function Panel({ title, value }: { title: string; value: string }): JSX.Element {
  return (
    <section className="rounded-lg border border-border bg-surface p-4 shadow-report-soft">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
      <p className="mt-2 text-lg font-bold capitalize text-foreground">{value}</p>
    </section>
  );
}
