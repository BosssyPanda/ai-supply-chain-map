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
        <h2 className="font-display text-3xl text-foreground">{node.label}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{node.layer}</p>
      </div>
      <Panel title="Category Description">
        <p>{node.description}</p>
        <p className="mt-3 text-foreground">{node.whyItMatters}</p>
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
              <span key={child.id} className="rounded-md border border-border bg-surface-muted px-2.5 py-1 text-xs text-foreground">
                {child.label}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">Click the node in the graph to expand this branch.</span>
          )}
          {hiddenChildren > 0 ? <span className="rounded-md border border-dashed border-border bg-surface-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">{hiddenChildren} more hidden in panel</span> : null}
        </div>
      </Panel>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}
