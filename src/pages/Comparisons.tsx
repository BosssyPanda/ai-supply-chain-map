import { loadExplorerData } from '../data/loaders';
import { PageHeader, PageShell } from '../components/layout/PageShell';
import { DossierSection, RiskBadge, StatusBadge } from '../components/report';

const data = loadExplorerData();
const defaultComparisonIds = ['COMP_NVDA_GPU', 'COMP_ASML_LITHO', 'COMP_VRT_PWR'];

export function Comparisons(): JSX.Element {
  const defaults = defaultComparisonIds
    .map((id) => data.nodes.find((node) => node.id === id))
    .filter(Boolean) as NonNullable<(typeof data.nodes)[number]>[];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Research comparison"
        title="Comparisons"
        description="Side-by-side research fields only. No buy, sell, or price-target recommendations."
      />
        <div className="grid gap-4 xl:grid-cols-3">
          {defaults.map((node) => (
            <DossierSection key={node.id} title={node.label}>
              <p className="text-sm text-muted-foreground">
                {node.ticker ? `${node.ticker} · ` : ''}
                {node.layer}
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd><StatusBadge status={node.status} /></dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
                  <dt className="text-muted-foreground">Bottleneck</dt>
                  <dd>{node.bottleneckLevel ? <RiskBadge level={node.bottleneckLevel} /> : 'Data pending'}</dd>
                </div>
                <Row label="Pure-play" value={node.purePlayScore ?? 'Data pending'} />
                <Row label="Geography" value={node.country ?? 'Data pending'} />
              </dl>
              <p className="mt-5 text-sm text-muted-foreground">{node.whyItMatters}</p>
            </DossierSection>
          ))}
        </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold capitalize text-foreground">{value}</dd>
    </div>
  );
}
