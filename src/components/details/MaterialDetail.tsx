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
        <h2 className="text-2xl font-bold text-white">{node.label}</h2>
        <p className="mt-1 text-sm capitalize text-amber-200">{node.type} root dependency</p>
      </div>
      <Panel title="Material Role">
        <p>{node.description}</p>
        <p className="mt-3 text-slate-300">{node.whyItMatters}</p>
      </Panel>
      <div className="grid grid-cols-2 gap-3">
        <Panel title="Bottleneck">
          <p className="text-lg font-bold capitalize text-white">{node.bottleneckLevel ?? 'Unscored'}</p>
        </Panel>
        <Panel title="Substitutability">
          <p className="text-lg font-bold capitalize text-white">{node.substitutability ?? 'Data pending'}</p>
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
            <span key={value} className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300">
              {value}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-500">No mapped items yet.</span>
        )}
      </div>
    </Panel>
  );
}
