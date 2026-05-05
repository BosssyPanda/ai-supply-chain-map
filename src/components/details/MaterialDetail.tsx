import type { Source, SupplyChainNode } from '../../data/schema';
import { Panel, SourceLinks } from './CompanyDetail';

interface MaterialDetailProps {
  node: SupplyChainNode;
  suppliers: SupplyChainNode[];
  customers: SupplyChainNode[];
  sources: Source[];
}

export function MaterialDetail({ node, suppliers, customers, sources }: MaterialDetailProps): JSX.Element {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl text-foreground">{node.label}</h2>
        <p className="mt-1 text-sm capitalize text-high">{node.type} root dependency</p>
      </div>
      <Panel title="Material Role">
        <p>{node.description}</p>
        <p className="mt-3 text-foreground">{node.whyItMatters}</p>
      </Panel>
      <div className="grid grid-cols-2 gap-3">
        <Panel title="Bottleneck">
          <p className="text-lg font-bold capitalize text-foreground">{node.bottleneckLevel ?? 'Unscored'}</p>
        </Panel>
        <Panel title="Substitutability">
          <p className="text-lg font-bold capitalize text-foreground">{node.substitutability ?? 'Data pending'}</p>
        </Panel>
      </div>
      <TagPanel title="Mapped Suppliers" values={suppliers.map((supplier) => supplier.label)} />
      <TagPanel title="Downstream Uses" values={customers.map((customer) => customer.label)} />
      <SourceLinks sources={sources} />
    </div>
  );
}

function TagPanel({ title, values }: { title: string; values: string[] }): JSX.Element {
  return (
    <Panel title={title}>
      <div className="flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((value) => (
            <span key={value} className="rounded-md border border-border bg-surface-muted px-2.5 py-1 text-xs text-foreground">
              {value}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">No mapped items yet.</span>
        )}
      </div>
    </Panel>
  );
}
