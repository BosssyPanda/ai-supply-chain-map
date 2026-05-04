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
  root: 'border-purple-400/70 bg-purple-500/20 shadow-glowPurple text-purple-50',
  category: 'border-blue-400/70 bg-blue-500/15 shadow-glowBlue text-blue-50',
  subcategory: 'border-cyan-400/70 bg-cyan-500/14 shadow-glowTeal text-cyan-50',
  component: 'border-cyan-300/60 bg-cyan-500/10 text-cyan-50',
  company: 'border-green-400/60 bg-green-500/12 shadow-glowGreen text-green-50',
  material: 'border-amber-400/70 bg-amber-500/14 text-amber-50',
  mineral: 'border-amber-400/70 bg-amber-500/14 text-amber-50',
  risk: 'border-rose-400/70 bg-rose-500/15 text-rose-50',
  policy: 'border-orange-400/70 bg-orange-500/14 text-orange-50',
  geography: 'border-sky-400/60 bg-sky-500/12 text-sky-50',
  watchlist: 'border-lime-400/60 bg-lime-500/10 text-lime-50',
} satisfies Record<SupplyChainNodeModel['type'], string>;

const companyStatusStyles = {
  us_listed_public: 'border-green-400/60 bg-green-500/12 shadow-glowGreen text-green-50',
  us_listed_adr: 'border-emerald-300/60 bg-emerald-500/12 text-emerald-50',
  private: 'border-slate-500/70 bg-slate-500/14 text-slate-50',
  state_owned: 'border-amber-400/70 bg-amber-500/14 text-amber-50',
  non_us_listed: 'border-zinc-400/70 bg-zinc-500/14 text-zinc-50',
  watchlist_private_ipo_spac: 'border-lime-400/60 bg-lime-500/10 text-lime-50',
  etf_optional: 'border-indigo-400/60 bg-indigo-500/10 text-indigo-50',
} satisfies Record<NonNullable<SupplyChainNodeModel['status']>, string>;

const severityStyles = {
  low: 'bg-slate-700 text-slate-200',
  medium: 'bg-blue-500/20 text-blue-200',
  high: 'bg-amber-500/20 text-amber-200',
  critical: 'bg-rose-500/20 text-rose-200',
};

const confidenceStyles = {
  low: 'bg-rose-500/16 text-rose-200',
  medium: 'bg-amber-500/16 text-amber-200',
  high: 'bg-emerald-500/16 text-emerald-200',
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
        'group relative rounded-2xl border px-3.5 py-3 backdrop-blur transition',
        isStage ? 'min-h-[248px] w-[352px]' : isVirtualSummary ? 'min-h-[126px] w-[300px]' : 'min-h-[106px] w-[300px]',
        styleFor(node),
        selected && 'ring-2 ring-white/80 ring-offset-2 ring-offset-slate-950',
        dimmed && 'opacity-35',
      )}
    >
      <Handle className="!h-2 !w-2 !border-slate-900 !bg-slate-300" position={Position.Top} type="target" />
      <div className="flex items-start gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/8">
          {iconFor(node)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={cn('break-words text-sm font-bold leading-snug tracking-wide', isStage ? 'line-clamp-3' : 'line-clamp-2')}>
              {node.label}
            </p>
            {hiddenChildrenCount > 0 ? (
              <span className="shrink-0 rounded-full border border-white/15 bg-black/20 px-2 py-0.5 text-[10px] text-slate-200">
                {hiddenChildrenCount} hidden
              </span>
            ) : null}
          </div>
          {node.ticker ? <p className="mt-0.5 text-xs font-semibold text-white/70">{node.ticker}</p> : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {node.bottleneckLevel ? (
              <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase', severityStyles[node.bottleneckLevel])}>
                {node.bottleneckLevel}
              </span>
            ) : null}
            {node.status ? (
              <span className="max-w-[130px] truncate rounded-md bg-black/25 px-1.5 py-0.5 text-[10px] font-medium text-slate-200">
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
      {isVirtualSummary ? <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-300/85">{node.description}</p> : null}
      {isStage ? (
        <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
          {previewChildren.map((child) => (
            <div key={child.id} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/18 px-2 py-1.5 text-[11px] text-slate-200">
              <span className="line-clamp-2">{child.label}</span>
              {child.bottleneckLevel ? <span className={cn('rounded px-1.5 py-0.5 text-[9px] uppercase', severityStyles[child.bottleneckLevel])}>{child.bottleneckLevel}</span> : null}
            </div>
          ))}
          {hiddenChildrenCount > 0 ? (
            <div className="rounded-lg border border-dashed border-white/15 bg-black/10 px-2 py-1.5 text-[11px] font-semibold text-slate-300">
              {hiddenChildrenCount} hidden children in this stage
            </div>
          ) : null}
        </div>
      ) : null}
      <Handle className="!h-2 !w-2 !border-slate-900 !bg-slate-300" position={Position.Bottom} type="source" />
    </div>
  );
}
