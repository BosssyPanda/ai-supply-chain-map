import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type Edge, type EdgeProps } from '@xyflow/react';

const edgeColors = {
  low: '#64748b',
  medium: '#3b82f6',
  high: '#f59e0b',
  critical: '#fb7185',
};

export interface SupplyChainEdgeData {
  [key: string]: unknown;
  criticality?: keyof typeof edgeColors;
  label?: string;
}

export type SupplyChainGraphEdge = Edge<SupplyChainEdgeData, 'supplyChain'>;

export function SupplyChainEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<SupplyChainGraphEdge>): JSX.Element {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 18,
  });
  const color = edgeColors[data?.criticality ?? 'medium'];

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: color, strokeWidth: data?.criticality === 'critical' ? 2.1 : 1.4, opacity: 0.72 }} />
      {data?.criticality === 'critical' ? (
        <EdgeLabelRenderer>
          <span
            className="pointer-events-none absolute rounded-full border border-rose-400/40 bg-slate-950/85 px-2 py-0.5 text-[10px] font-semibold uppercase text-rose-200"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            critical
          </span>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
