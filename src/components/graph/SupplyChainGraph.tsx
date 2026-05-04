import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react';
import { ChevronDown, DatabaseZap, GitBranch, Layers3, Map as MapIcon, Maximize2, RotateCcw, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { GraphFilters, GraphViewMode, LayoutDirection, SupplyChainData, SupplyChainNode as SupplyChainNodeModel } from '../../data/schema';
import { applySupplyChainFilters } from '../../lib/filters';
import { buildFocusGraph, type ExplorationMode, type SupplierDepth } from '../../lib/focusGraph';
import { getLayoutedElements } from '../../lib/layout';
import { cn } from '../../lib/cn';
import { getStageNode, getStageRootNodes, isStageNodeId } from '../../lib/stages';
import { SupplyChainEdge, type SupplyChainGraphEdge } from './SupplyChainEdge';
import { SupplyChainNode, type SupplyChainGraphNode } from './SupplyChainNode';

interface SupplyChainGraphProps {
  data: SupplyChainData;
  filters: GraphFilters;
  searchQuery: string;
  selectedNodeId?: string;
  focusNodeId?: string;
  viewMode: GraphViewMode;
  focusMode: boolean;
  explorationMode: ExplorationMode;
  onSelectNode: (nodeId: string) => void;
  onEnterFocus: (nodeId: string) => void;
  onExitFocus: () => void;
}

const rootId = 'L0_AI_ECOSYSTEM';
const nodeTypes = { supplyChain: SupplyChainNode };
const edgeTypes = { supplyChain: SupplyChainEdge };
const supplierDepthOptions: SupplierDepth[] = [1, 2, 3, 'all'];

function fitPadding(): number {
  if (window.innerWidth < 768) return 0.1;
  if (window.innerWidth < 1100) return 0.14;
  return 0.2;
}

function previewLimitForDepth(depth: SupplierDepth): number {
  if (depth === 1) return 3;
  if (depth === 2) return 5;
  return 6;
}

export function SupplyChainGraph(props: SupplyChainGraphProps): JSX.Element {
  return (
    <ReactFlowProvider>
      <SupplyChainGraphInner {...props} />
    </ReactFlowProvider>
  );
}

function SupplyChainGraphInner({
  data,
  filters,
  searchQuery,
  selectedNodeId,
  focusNodeId,
  viewMode,
  focusMode,
  explorationMode,
  onSelectNode,
  onEnterFocus,
  onExitFocus,
}: SupplyChainGraphProps): JSX.Element {
  const [supplierDepth, setSupplierDepth] = useState<SupplierDepth>(2);
  const [direction, setDirection] = useState<LayoutDirection>('DOWN');
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [depthWarning, setDepthWarning] = useState('');
  const [layoutVersion, setLayoutVersion] = useState(0);
  const [layoutedNodes, setLayoutedNodes] = useState<SupplyChainGraphNode[]>([]);
  const [layoutedEdges, setLayoutedEdges] = useState<SupplyChainGraphEdge[]>([]);
  const fitAfterLayoutRef = useRef(true);
  const { fitView } = useReactFlow();

  const effectiveSelectedId = focusNodeId ?? selectedNodeId ?? rootId;
  const nodesById = useMemo(() => new Map(data.nodes.map((node) => [node.id, node])), [data.nodes]);
  const effectiveSelectedLabel = nodesById.get(effectiveSelectedId)?.label ?? getStageNode(effectiveSelectedId)?.label ?? effectiveSelectedId;
  const childrenByParent = useMemo(() => {
    const map = new Map<string, SupplyChainNodeModel[]>();
    data.nodes.forEach((node) => {
      if (!node.parentId) return;
      const current = map.get(node.parentId) ?? [];
      current.push(node);
      map.set(node.parentId, current);
    });
    return map;
  }, [data.nodes]);

  const stagePreviewChildren = useMemo(() => {
    const map = new Map<string, SupplyChainNodeModel[]>();
    const previewLimit = previewLimitForDepth(supplierDepth);
    ['stage-demand', 'stage-models-cloud', 'stage-compute', 'stage-semiconductor', 'stage-data-centers', 'stage-power-cooling', 'stage-materials', 'stage-policy-capital-labor'].forEach((stageId) => {
      map.set(stageId, getStageRootNodes(data, stageId).slice(0, previewLimit));
    });
    return map;
  }, [data, supplierDepth]);

  useEffect(() => {
    if (focusNodeId && focusNodeId !== selectedNodeId) onSelectNode(focusNodeId);
  }, [focusNodeId, onSelectNode, selectedNodeId]);

  const focusedGraph = useMemo(
    () =>
      buildFocusGraph(data, {
        selectedNodeId: effectiveSelectedId,
        supplierDepth,
        explorationMode,
        viewMode,
        focusMode,
        maxRelatedPerGroup: 8,
        maxVisibleNodes: focusMode ? 42 : 30,
      }),
    [data, effectiveSelectedId, explorationMode, focusMode, supplierDepth, viewMode],
  );

  const filteredGraph = useMemo(() => {
    const visible = new Set<string>();
    focusedGraph.nodes.forEach((node) => {
      const isStructural = node.virtual || node.type === 'root' || node.type === 'category' || node.type === 'subcategory' || node.id === effectiveSelectedId;
      if (isStructural || applySupplyChainFilters([node], filters).length > 0) visible.add(node.id);
    });

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      focusedGraph.nodes.forEach((node) => {
        const text = [node.label, node.ticker ?? '', node.layer, node.description, node.whyItMatters, node.tags.join(' '), node.risks?.join(' ') ?? '']
          .join(' ')
          .toLowerCase();
        if (text.includes(query)) visible.add(node.id);
      });
    }

    return {
      nodes: focusedGraph.nodes.filter((node) => visible.has(node.id)),
      edges: focusedGraph.edges.filter((edge) => visible.has(edge.source) && visible.has(edge.target)),
    };
  }, [effectiveSelectedId, filters, focusedGraph, searchQuery]);

  const reactFlowEdges = useMemo<SupplyChainGraphEdge[]>(
    () =>
      filteredGraph.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'supplyChain',
        animated: edge.criticality === 'critical',
        data: { criticality: edge.criticality, label: edge.relationshipType },
      })),
    [filteredGraph.edges],
  );

  const layoutInputNodes = useMemo<SupplyChainGraphNode[]>(
    () => {
      const visibleNodeIds = new Set(filteredGraph.nodes.map((visibleNode) => visibleNode.id));
      return filteredGraph.nodes.map((node) => {
        const stageChildren = stagePreviewChildren.get(node.id) ?? [];
        const hiddenChildren = isStageNodeId(node.id)
          ? getStageRootNodes(data, node.id).slice(stageChildren.length)
          : node.virtual
            ? []
            : (childrenByParent.get(node.id) ?? []).filter((child) => !visibleNodeIds.has(child.id));
        const hiddenChildrenCount = isStageNodeId(node.id)
          ? hiddenChildren.length
          : node.virtual
            ? 0
            : hiddenChildren.length;
        return {
          id: node.id,
          type: 'supplyChain',
          position: { x: 0, y: 0 },
          data: {
            node,
            hiddenChildrenCount,
            hiddenChildNames: hiddenChildren.map((child) => child.label),
            previewChildren: stageChildren,
            selected: false,
            dimmed: focusMode && node.id !== effectiveSelectedId && node.parentId !== effectiveSelectedId && !reactFlowEdges.some((edge) => edge.source === effectiveSelectedId && edge.target === node.id),
          },
        };
      });
    },
    [childrenByParent, data, effectiveSelectedId, filteredGraph.nodes, focusMode, reactFlowEdges, stagePreviewChildren],
  );

  useEffect(() => {
    fitAfterLayoutRef.current = true;
  }, [effectiveSelectedId, explorationMode, focusMode, viewMode]);

  useEffect(() => {
    let cancelled = false;
    void getLayoutedElements(layoutInputNodes, reactFlowEdges, direction).then((layouted) => {
      if (cancelled) return;
      setLayoutedNodes(layouted.nodes as SupplyChainGraphNode[]);
      setLayoutedEdges(layouted.edges as SupplyChainGraphEdge[]);
      if (fitAfterLayoutRef.current) {
        fitAfterLayoutRef.current = false;
        window.requestAnimationFrame(() => fitView({ padding: fitPadding(), duration: 350 }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [direction, fitView, layoutInputNodes, layoutVersion, reactFlowEdges]);

  const renderedNodes = useMemo<SupplyChainGraphNode[]>(
    () =>
      layoutedNodes.map((node) => ({
        ...node,
        draggable: false,
        data: {
          ...node.data,
          selected: node.id === effectiveSelectedId,
        },
      })),
    [effectiveSelectedId, layoutedNodes],
  );

  const onNodeClick: NodeMouseHandler = (_, graphNode) => {
    const model = nodesById.get(graphNode.id) ?? (graphNode as SupplyChainGraphNode).data.node;
    if (!model || model.id.startsWith('overflow-')) return;
    if (model.id.startsWith('view-')) return;
    onSelectNode(model.id);
    if (model.id === rootId) {
      onExitFocus();
      return;
    }
    if (isStageNodeId(model.id) || model.type === 'category' || model.type === 'subcategory' || model.type === 'component' || model.type === 'material' || model.type === 'mineral') {
      fitAfterLayoutRef.current = true;
      onEnterFocus(model.id);
    }
  };

  const fitCanvas = () => fitView({ padding: fitPadding(), duration: 350 });

  const resetLayout = () => {
    fitAfterLayoutRef.current = true;
    setSupplierDepth(2);
    setDirection('DOWN');
    setDepthWarning('');
    onExitFocus();
    onSelectNode(rootId);
    setLayoutVersion((value) => value + 1);
  };

  const collapseToStage = () => {
    fitAfterLayoutRef.current = true;
    setDepthWarning('');
    onExitFocus();
    onSelectNode(rootId);
    setLayoutVersion((value) => value + 1);
  };

  const updateSupplierDepth = (option: SupplierDepth) => {
    if (option === 'all' && !focusMode) {
      setDepthWarning('Full depth is available after focusing a branch.');
      return;
    }
    setDepthWarning('');
    fitAfterLayoutRef.current = focusMode;
    setSupplierDepth(option);
  };

  const supplierDepthLabel =
    explorationMode === 'downstream'
      ? 'Showing downstream customers; supplier depth is paused in this view.'
      : supplierDepth === 'all'
        ? 'Showing full available upstream depth in focus mode.'
        : `Showing supplier depth: ${supplierDepth} level${supplierDepth === 1 ? '' : 's'} upstream.`;

  const focusModeLabel = {
    branch: 'branch focus',
    upstream: 'upstream roots',
    downstream: 'downstream customers',
  } satisfies Record<ExplorationMode, string>;

  return (
    <div className="relative h-[720px] overflow-hidden rounded-3xl border border-slate-800 bg-[radial-gradient(circle_at_top,rgba(30,64,175,0.22),transparent_34rem),#020617] shadow-2xl">
      <div className="absolute left-4 right-4 top-4 z-20 flex flex-wrap gap-2 xl:right-auto">
        <ToolbarButton onClick={resetLayout} icon={<RotateCcw className="h-4 w-4" />} label="Reset Layout" />
        <ToolbarButton onClick={fitCanvas} icon={<Maximize2 className="h-4 w-4" />} label="Fit View" />
        <ToolbarButton onClick={() => setDirection((value) => (value === 'DOWN' ? 'RIGHT' : 'DOWN'))} icon={<GitBranch className="h-4 w-4" />} label={direction === 'DOWN' ? 'Top-down' : 'Left-right'} />
        <ToolbarButton onClick={collapseToStage} icon={<ChevronDown className="h-4 w-4" />} label="Collapse to Stage" />
        {focusMode ? <ToolbarButton onClick={collapseToStage} icon={<X className="h-4 w-4" />} label="Exit Focus Mode" /> : null}
        <ToolbarButton onClick={() => setShowMiniMap((value) => !value)} icon={<MapIcon className="h-4 w-4" />} label={showMiniMap ? 'Hide Minimap' : 'Show Minimap'} />
      </div>

      <div className="absolute left-4 right-4 top-[6.25rem] z-20 rounded-xl border border-slate-700 bg-slate-950/85 p-2 shadow-2xl backdrop-blur xl:left-auto xl:right-4 xl:top-4 xl:max-w-[520px]">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="inline-flex items-center gap-1 px-2 text-xs font-semibold text-slate-400">
            <DatabaseZap className="h-3.5 w-3.5 text-cyan-300" />
            {supplierDepthLabel}
          </span>
          {supplierDepthOptions.map((option) => (
            <button
              key={String(option)}
              type="button"
              onClick={() => updateSupplierDepth(option)}
              className={cn(
                'h-8 rounded-lg px-3 text-xs font-bold uppercase text-slate-400 transition hover:bg-slate-800 hover:text-slate-100',
                supplierDepth === option && 'bg-blue-500/20 text-blue-200 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.35)]',
                option === 'all' && !focusMode && 'cursor-not-allowed opacity-50',
              )}
            >
              {option}
            </button>
          ))}
        </div>
        {depthWarning ? <p className="mt-1 px-2 text-right text-xs text-amber-200">{depthWarning}</p> : null}
      </div>

      {focusMode ? (
        <div className="absolute left-4 right-4 top-[10.5rem] z-20 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 shadow-glowTeal xl:right-auto xl:top-16">
          Focus mode: {effectiveSelectedLabel} · {focusModeLabel[explorationMode]}
        </div>
      ) : null}

      <ReactFlow
        nodes={renderedNodes}
        edges={layoutedEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={(_, node) => onEnterFocus(node.id)}
        fitView={false}
        minZoom={0.12}
        maxZoom={2.2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        panOnDrag
        panOnScroll={false}
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick={false}
        selectionOnDrag={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" gap={28} size={1} />
        {showMiniMap ? (
          <MiniMap
            className="!bottom-4 !right-4 !h-28 !w-44 !rounded-xl !border !border-blue-400/30 !bg-slate-950/90 !shadow-2xl"
            maskColor="rgba(2, 6, 23, 0.68)"
            nodeColor={(node) => ((node as SupplyChainGraphNode).data.node.type === 'company' ? '#22c55e' : '#38bdf8')}
            nodeStrokeWidth={3}
            pannable
            zoomable
          />
        ) : null}
        <Controls className="ai-flow-controls !bottom-4 !left-4" />
      </ReactFlow>

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-xs text-slate-400 shadow-2xl md:flex">
        <Layers3 className="h-4 w-4 text-blue-300" />
        Drag canvas to pan · Scroll to zoom · Click node for top companies
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  icon,
  label,
  disabled,
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/85 px-3 text-xs font-semibold text-slate-200 shadow-2xl backdrop-blur transition hover:border-blue-400/60 hover:text-blue-200',
        disabled && 'cursor-not-allowed opacity-45',
      )}
    >
      {icon}
      {label}
    </button>
  );
}
