import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type Edge, type EdgeProps } from '@xyflow/react';

const edgeColors = {
  low: 'hsl(var(--low))',
  medium: 'hsl(var(--medium))',
  high: 'hsl(var(--high))',
  critical: 'hsl(var(--critical))',
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
            className="pointer-events-none absolute rounded-full border border-critical/30 bg-surface/90 px-2 py-0.5 text-[10px] font-semibold uppercase text-critical"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            critical
          </span>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
