import type { SupplyChainNode } from '../../data/schema';
import { Panel } from './CompanyDetail';

interface CategoryDetailProps {
  node: SupplyChainNode;
  childrenNodes: SupplyChainNode[];
}

export function CategoryDetail({ node, childrenNodes }: CategoryDetailProps): JSX.Element {
  const companies = childrenNodes.filter((child) => child.type === 'company' || child.type === 'watchlist');
  const roots = childrenNodes.filter((child) => child.type === 'mineral' || child.type === 'material');
  const visibleChildren = childrenNodes.slice(0, 24);
  const hiddenChildren = Math.max(0, childrenNodes.length - visibleChildren.length);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white">{node.label}</h2>
        <p className="mt-1 text-sm text-slate-500">{node.layer}</p>
      </div>
      <Panel title="Category Description">
        <p>{node.description}</p>
        <p className="mt-3 text-slate-300">{node.whyItMatters}</p>
      </Panel>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Visible children" value={String(childrenNodes.length)} />
        <Stat label="Companies" value={String(companies.length)} />
        <Stat label="Root inputs" value={String(roots.length)} />
      </div>
      <Panel title="Direct Children">
        <div className="flex flex-wrap gap-2">
          {childrenNodes.length > 0 ? (
            visibleChildren.map((child) => (
              <span key={child.id} className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300">
                {child.label}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">Click the node in the graph to expand this branch.</span>
          )}
          {hiddenChildren > 0 ? <span className="rounded-lg border border-dashed border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-semibold text-slate-400">{hiddenChildren} more hidden in panel</span> : null}
        </div>
      </Panel>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}
