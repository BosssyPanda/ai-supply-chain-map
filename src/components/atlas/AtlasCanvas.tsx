import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Cloud, Cpu, Factory, Mountain, Network } from 'lucide-react';
import { Component, useCallback, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import { Vector3 } from 'three';
import { atlasWebGLContextAttributes, probeAtlasWebGL, webGLUnavailableReason, type AtlasWebGLProbe, type AtlasWebGLStatus } from '../../lib/atlasWebGL';
import { AtlasConnectionLines } from './AtlasConnectionLines';
import { AtlasDebugOverlay, type AtlasRenderMode } from './AtlasDebugOverlay';
import { AtlasStagePlatform } from './AtlasStagePlatform';
import type { AtlasStage } from './atlasStages';

const overviewCamera = new Vector3(0.25, 5.35, 8.5);
const overviewTarget = new Vector3(0.65, 0.04, 0.72);
const handoffCamera = new Vector3(0, 5.05, 7.25);
const handoffTarget = new Vector3(0, -0.05, 1.1);
const canvasRenderErrorReason = 'Atlas WebGL canvas failed to render.';
const webGLContextLostReason = 'WebGL context was lost by the browser.';
type WebGLStatus = 'checking' | AtlasWebGLStatus;

export function AtlasCanvas({
  stages,
  activeIndex,
  isHandoff = false,
}: {
  stages: AtlasStage[];
  activeIndex: number | null;
  isHandoff?: boolean;
}): JSX.Element {
  const webGL = useWebGLStatus();
  const [canvasFailureReason, setCanvasFailureReason] = useState<string | null>(null);
  const fallbackReason = canvasFailureReason ?? (webGL.status === 'unavailable' ? webGL.probe?.reason ?? webGLUnavailableReason : undefined);
  const renderMode: AtlasRenderMode = webGL.status === 'unavailable' || canvasFailureReason ? 'canvas-fallback' : 'webgl';
  const handleCanvasError = useCallback((reason: string) => {
    setCanvasFailureReason(reason);
  }, []);

  return (
    <div className="absolute inset-0" data-atlas-render-mode={renderMode} data-atlas-fallback-reason={fallbackReason}>
      {webGL.status === 'checking' ? (
        <CanvasProbePlaceholder />
      ) : renderMode === 'webgl' ? (
        <AtlasCanvasBoundary fallback={<CanvasFallback stages={stages} reason={canvasRenderErrorReason} includeRenderModeMarker={false} />} onError={handleCanvasError}>
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, ...atlasWebGLContextAttributes }}
            camera={{ position: [0.25, 5.35, 8.5], fov: 43, near: 0.1, far: 60 }}
          >
            <fog attach="fog" args={['#040b16', 8, 18]} />
            <ambientLight intensity={0.58} />
            <directionalLight position={[-3, 6, 4]} intensity={1.15} />
            <pointLight position={[-4, 3.5, -2]} color="#60a5fa" intensity={1.1} distance={8} />
            <pointLight position={[3.6, 3, 2.2]} color="#f59e0b" intensity={0.85} distance={7} />
            <CanvasContextEvents onContextLost={() => handleCanvasError(webGLContextLostReason)} />
            <CameraRig stages={stages} activeIndex={activeIndex} isHandoff={isHandoff} />
            <group rotation={[0, 0.12, 0]} scale={0.88}>
              <gridHelper args={[9, 18, '#1d4ed8', '#17243a']} position={[0, -0.02, 0.65]} />
              <AtlasConnectionLines stages={stages} activeIndex={activeIndex} isHandoff={isHandoff} />
              {stages.map((stage, index) => {
                const finalPairFocused = (activeIndex === 3 || activeIndex === 4) && (index === 3 || index === 4);
                const isActive = activeIndex === index;
                const isDimmed = isHandoff || (activeIndex !== null && !isActive && !finalPairFocused);

                return <AtlasStagePlatform key={stage.id} stage={stage} isActive={isActive} isDimmed={isDimmed} />;
              })}
            </group>
          </Canvas>
        </AtlasCanvasBoundary>
      ) : (
        <CanvasFallback stages={stages} reason={fallbackReason ?? webGLUnavailableReason} includeRenderModeMarker={false} />
      )}
      <AtlasDebugOverlay mode={renderMode} fallbackReason={fallbackReason} detail={webGL.status === 'checking' ? 'Checking WebGL support.' : undefined} webGLProbe={webGL.probe} />
    </div>
  );
}

function useWebGLStatus(): { status: WebGLStatus; probe: AtlasWebGLProbe | null } {
  const [webGL, setWebGL] = useState<{ status: WebGLStatus; probe: AtlasWebGLProbe | null }>({ status: 'checking', probe: null });

  useEffect(() => {
    const probe = probeAtlasWebGL();

    if (!probe.supported) {
      console.warn(`[Atlas] ${probe.reason ?? webGLUnavailableReason}`);
    }

    setWebGL({ status: probe.status, probe });
  }, []);

  return webGL;
}

function CanvasProbePlaceholder(): JSX.Element {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.12),transparent_36%),linear-gradient(180deg,rgba(15,23,42,0.04),rgba(2,6,23,0.82))]" />
    </div>
  );
}

class AtlasCanvasBoundary extends Component<
  {
    children: ReactNode;
    fallback: ReactNode;
    onError: (reason: string) => void;
  },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.warn(`[Atlas] ${canvasRenderErrorReason}`, { error, componentStack: errorInfo.componentStack });
    this.props.onError(canvasRenderErrorReason);
  }

  render(): ReactNode {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function CanvasContextEvents({ onContextLost }: { onContextLost: () => void }): null {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn(`[Atlas] ${webGLContextLostReason}`);
      onContextLost();
    };
    const handleContextRestored = () => {
      console.info('[Atlas] WebGL context was restored by the browser.');
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl, onContextLost]);

  return null;
}

function CameraRig({ stages, activeIndex, isHandoff }: { stages: AtlasStage[]; activeIndex: number | null; isHandoff: boolean }): null {
  const { camera } = useThree();
  const targetRef = useRef(overviewTarget.clone());
  const desiredCamera = useMemo(() => {
    if (isHandoff) return handoffCamera.clone();
    if (activeIndex === null) return overviewCamera.clone();
    return new Vector3(...(stages[activeIndex]?.scene.camera ?? overviewCamera.toArray()));
  }, [activeIndex, isHandoff, stages]);
  const desiredTarget = useMemo(() => {
    if (isHandoff) return handoffTarget.clone();
    if (activeIndex === null) return overviewTarget.clone();
    return new Vector3(...(stages[activeIndex]?.scene.target ?? overviewTarget.toArray()));
  }, [activeIndex, isHandoff, stages]);

  useFrame((_, delta) => {
    const ease = 1 - Math.exp(-delta * 1.85);
    camera.position.lerp(desiredCamera, ease);
    targetRef.current.lerp(desiredTarget, ease);
    camera.lookAt(targetRef.current);
  });

  return null;
}

const fallbackPositions = [
  { left: '60%', top: '36%', orbit: '8.5rem' },
  { left: '75%', top: '48%', orbit: '7.5rem' },
  { left: '55%', top: '66%', orbit: '7.8rem' },
  { left: '80%', top: '72%', orbit: '8rem' },
  { left: '67%', top: '86%', orbit: '7.2rem' },
] as const;

const fallbackIconMap = {
  cloud: Cloud,
  chip: Cpu,
  network: Network,
  power: Factory,
  materials: Mountain,
} satisfies Record<AtlasStage['icon'], typeof Cloud>;

export function CanvasFallback({
  stages,
  reason,
  includeRenderModeMarker = true,
}: {
  stages: AtlasStage[];
  reason: string;
  includeRenderModeMarker?: boolean;
}): JSX.Element {
  return (
    <div
      className="relative h-full overflow-hidden"
      aria-label="Static atlas preview with five supply-chain stages"
      data-atlas-render-mode={includeRenderModeMarker ? 'canvas-fallback' : undefined}
      data-atlas-fallback-reason={reason}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.18),transparent_34%),linear-gradient(155deg,transparent_40%,rgba(245,158,11,0.1)_72%,transparent_100%),linear-gradient(180deg,rgba(15,23,42,0.06),rgba(2,6,23,0.9))]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] [background-size:64px_64px]" aria-hidden="true" />
      <svg className="absolute inset-0 h-full w-full opacity-90" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M60 36 C70 36 76 41 75 48 C73 57 61 58 55 66 C63 65 75 66 80 72 C83 78 73 81 67 86" fill="none" stroke="rgba(96,165,250,0.34)" strokeWidth="0.55" strokeLinecap="round" />
        <path d="M60 36 C70 36 76 41 75 48 C73 57 61 58 55 66 C63 65 75 66 80 72 C83 78 73 81 67 86" fill="none" stroke="rgba(191,219,254,0.52)" strokeWidth="0.15" strokeDasharray="1 2" strokeLinecap="round" />
        <path d="M55 66 C63 62 74 64 80 72" fill="none" stroke="rgba(245,158,11,0.36)" strokeWidth="0.34" strokeDasharray="1.2 1.4" strokeLinecap="round" />
      </svg>

      {stages.slice(0, 5).map((stage, index) => {
        const position = fallbackPositions[index] ?? fallbackPositions[0];
        const Icon = fallbackIconMap[stage.icon];

        return (
          <div
            key={stage.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: position.left, top: position.top }}
            aria-label={`${stage.step} ${stage.title}`}
          >
            <div className="relative h-20 w-24">
              <span className="absolute inset-x-2 bottom-1 h-9 -skew-x-12 rounded-md border border-white/12 bg-[#0b1b2f]/78 shadow-[0_20px_54px_rgba(2,6,23,0.38)]" style={{ boxShadow: `0 18px 46px ${stage.scene.accent}1f` }} aria-hidden="true" />
              <span className="absolute left-5 top-4 grid h-11 w-11 place-items-center rounded-md border border-white/18 bg-[#081626]/82 shadow-[0_18px_44px_rgba(2,6,23,0.32)] backdrop-blur" style={{ color: stage.scene.accent }}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="absolute right-2 top-2 rounded-md border border-white/14 bg-black/22 px-1.5 py-0.5 text-[10px] font-semibold text-white/72">{stage.step}</span>
            </div>
          </div>
        );
      })}

      <p className="sr-only">Static atlas preview shown because {reason}</p>
    </div>
  );
}
