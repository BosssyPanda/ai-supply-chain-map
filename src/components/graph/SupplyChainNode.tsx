import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import {
  AlertTriangle,
  Boxes,
  Building2,
  Cloud,
  Cpu,
  Database,
  Factory,
  FlaskConical,
  Globe2,
  Landmark,
  Mountain,
  Network,
  PackageOpen,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { SupplyChainNode as SupplyChainNodeModel } from '../../data/schema';
import { cn } from '../../lib/cn';

export interface SupplyChainNodeData {
  [key: string]: unknown;
  node: SupplyChainNodeModel;
  hiddenChildrenCount: number;
  hiddenChildNames?: string[];
  previewChildren?: SupplyChainNodeModel[];
  selected: boolean;
  dimmed: boolean;
}

export type SupplyChainGraphNode = Node<SupplyChainNodeData, 'supplyChain'>;

const typeStyles = {
  root: 'border-accent/70 bg-accent-soft text-accent',
  category: 'border-accent/60 bg-accent-soft text-accent',
  subcategory: 'border-partial/45 bg-partial/10 text-partial',
  component: 'border-partial/35 bg-partial/10 text-partial',
  company: 'border-verified/45 bg-verified/10 text-verified',
  material: 'border-high/45 bg-high/10 text-high',
  mineral: 'border-high/45 bg-high/10 text-high',
  risk: 'border-critical/55 bg-critical/10 text-critical',
  policy: 'border-high/45 bg-high/10 text-high',
  geography: 'border-medium/45 bg-medium/10 text-medium',
  watchlist: 'border-pending/45 bg-pending/10 text-pending',
} satisfies Record<SupplyChainNodeModel['type'], string>;

const companyStatusStyles = {
  us_listed_public: 'border-verified/45 bg-verified/10 text-verified',
  us_listed_adr: 'border-partial/45 bg-partial/10 text-partial',
  private: 'border-pending/45 bg-pending/10 text-pending',
  state_owned: 'border-pending/45 bg-pending/10 text-pending',
  non_us_listed: 'border-pending/45 bg-pending/10 text-pending',
  watchlist_private_ipo_spac: 'border-pending/45 bg-pending/10 text-pending',
  etf_optional: 'border-partial/45 bg-partial/10 text-partial',
} satisfies Record<NonNullable<SupplyChainNodeModel['status']>, string>;

const severityStyles = {
  low: 'bg-low/10 text-low',
  medium: 'bg-medium/10 text-medium',
  high: 'bg-high/10 text-high',
  critical: 'bg-critical/10 text-critical',
};

const confidenceStyles = {
  low: 'bg-pending/10 text-pending',
  medium: 'bg-partial/10 text-partial',
  high: 'bg-verified/10 text-verified',
};

function styleFor(node: SupplyChainNodeModel): string {
  if ((node.type === 'company' || node.type === 'watchlist') && node.status) return companyStatusStyles[node.status];
  return typeStyles[node.type];
}

function iconFor(node: SupplyChainNodeModel): JSX.Element {
  const className = 'h-4 w-4';
  if (node.type === 'root') return <Sparkles className={className} />;
  if (node.type === 'company') return <Building2 className={className} />;
  if (node.type === 'material' || node.type === 'mineral') return <Mountain className={className} />;
  if (node.type === 'risk') return <AlertTriangle className={className} />;
  if (node.type === 'policy') return <Shield className={className} />;
  if (node.layer.includes('Cloud')) return <Cloud className={className} />;
  if (node.layer.includes('Accelerator')) return <Cpu className={className} />;
  if (node.layer.includes('Foundr') || node.layer.includes('Semiconductor')) return <Factory className={className} />;
  if (node.layer.includes('Memory')) return <Database className={className} />;
  if (node.layer.includes('Networking')) return <Network className={className} />;
  if (node.layer.includes('Power')) return <Zap className={className} />;
  if (node.layer.includes('Chemicals')) return <FlaskConical className={className} />;
  if (node.layer.includes('Finance')) return <Landmark className={className} />;
  if (node.layer.includes('Policy')) return <Globe2 className={className} />;
  return <Boxes className={className} />;
}

export function SupplyChainNode({ data }: NodeProps<SupplyChainGraphNode>): JSX.Element {
  const { node, hiddenChildrenCount, hiddenChildNames = [], previewChildren = [], selected, dimmed } = data;
  const isStage = node.virtual && node.tags.includes('stage');
  const isVirtualSummary = node.virtual && !isStage;
  const tooltip = [
    node.label,
    node.description,
    hiddenChildrenCount > 0
      ? `${hiddenChildrenCount} hidden children${hiddenChildNames.length > 0 ? `: ${hiddenChildNames.slice(0, 8).join(', ')}${hiddenChildNames.length > 8 ? ', ...' : ''}` : ''}`
      : '',
    node.bottleneckLevel ? `Bottleneck: ${node.bottleneckLevel}` : '',
    node.confidence ? `Confidence: ${node.confidence}` : 'Confidence: not scored',
    `Sources: ${node.sourceIds.length}`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div
      title={tooltip}
      className={cn(
        'group relative rounded-lg border bg-surface px-3.5 py-3 shadow-report-soft transition',
        isStage ? 'min-h-[248px] w-[352px]' : isVirtualSummary ? 'min-h-[126px] w-[300px]' : 'min-h-[106px] w-[300px]',
        styleFor(node),
        selected && 'ring-2 ring-accent/80 ring-offset-2 ring-offset-background',
        dimmed && 'opacity-35',
      )}
    >
      <Handle className="!h-2 !w-2 !border-background !bg-border-strong" position={Position.Top} type="target" />
      <div className="flex items-start gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-current/15 bg-surface/80">
          {iconFor(node)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={cn('break-words text-sm font-bold leading-snug tracking-wide', isStage ? 'line-clamp-3' : 'line-clamp-2')}>
              {node.label}
            </p>
            {hiddenChildrenCount > 0 ? (
              <span className="shrink-0 rounded-full border border-current/15 bg-surface-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                {hiddenChildrenCount} hidden
              </span>
            ) : null}
          </div>
          {node.ticker ? <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{node.ticker}</p> : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {node.bottleneckLevel ? (
              <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase', severityStyles[node.bottleneckLevel])}>
                {node.bottleneckLevel}
              </span>
            ) : null}
            {node.status ? (
              <span className="max-w-[130px] truncate rounded-md bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {node.status.replaceAll('_', ' ')}
              </span>
            ) : null}
            {node.confidence ? (
              <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase', confidenceStyles[node.confidence])}>
                {node.confidence} confidence
              </span>
            ) : null}
          </div>
        </div>
      </div>
      {isVirtualSummary ? <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{node.description}</p> : null}
      {isStage ? (
        <div className="mt-3 space-y-1.5 border-t border-current/15 pt-3">
          {previewChildren.map((child) => (
            <div key={child.id} className="flex items-center justify-between gap-2 rounded-md border border-current/15 bg-surface/70 px-2 py-1.5 text-[11px] text-foreground">
              <span className="line-clamp-2">{child.label}</span>
              {child.bottleneckLevel ? <span className={cn('rounded px-1.5 py-0.5 text-[9px] uppercase', severityStyles[child.bottleneckLevel])}>{child.bottleneckLevel}</span> : null}
            </div>
          ))}
          {hiddenChildrenCount > 0 ? (
            <div className="rounded-md border border-dashed border-current/20 bg-surface-muted px-2 py-1.5 text-[11px] font-semibold text-muted-foreground">
              {hiddenChildrenCount} hidden children in this stage
            </div>
          ) : null}
        </div>
      ) : null}
      <Handle className="!h-2 !w-2 !border-background !bg-border-strong" position={Position.Bottom} type="source" />
    </div>
  );
}
