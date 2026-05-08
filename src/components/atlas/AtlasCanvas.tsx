import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Cloud, Cpu, Factory, Mountain, Network } from 'lucide-react';
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Vector3 } from 'three';
import { AtlasConnectionLines } from './AtlasConnectionLines';
import { AtlasStagePlatform } from './AtlasStagePlatform';
import type { AtlasStage } from './atlasStages';

const overviewCamera = new Vector3(0.25, 5.35, 8.5);
const overviewTarget = new Vector3(0.65, 0.04, 0.72);
const handoffCamera = new Vector3(0, 5.05, 7.25);
const handoffTarget = new Vector3(0, -0.05, 1.1);

export function AtlasCanvas({
  stages,
  activeIndex,
  isHandoff = false,
}: {
  stages: AtlasStage[];
  activeIndex: number | null;
  isHandoff?: boolean;
}): JSX.Element {
  const webGLAvailable = useWebGLAvailable();

  return (
    <div className="absolute inset-0">
      {webGLAvailable ? (
        <AtlasCanvasBoundary fallback={<CanvasFallback stages={stages} />}>
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            camera={{ position: [0.25, 5.35, 8.5], fov: 43, near: 0.1, far: 60 }}
            fallback={<CanvasFallback stages={stages} />}
          >
            <fog attach="fog" args={['#040b16', 8, 18]} />
            <ambientLight intensity={0.58} />
            <directionalLight position={[-3, 6, 4]} intensity={1.15} />
            <pointLight position={[-4, 3.5, -2]} color="#60a5fa" intensity={1.1} distance={8} />
            <pointLight position={[3.6, 3, 2.2]} color="#f59e0b" intensity={0.85} distance={7} />
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
        <CanvasFallback stages={stages} />
      )}
    </div>
  );
}

function useWebGLAvailable(): boolean {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      setIsAvailable(Boolean(context));
    } catch {
      setIsAvailable(false);
    }
  }, []);

  return isAvailable;
}

class AtlasCanvasBoundary extends Component<
  {
    children: ReactNode;
    fallback: ReactNode;
  },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
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

function CanvasFallback({ stages }: { stages: AtlasStage[] }): JSX.Element {
  return (
    <div className="relative h-full overflow-hidden" aria-label="Static atlas preview with five supply-chain stages">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_38%,rgba(37,99,235,0.18),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(245,158,11,0.12),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.06),rgba(2,6,23,0.9))]" />
      <div className="absolute left-[39%] top-[17%] h-[68%] w-[52%] rounded-[50%] border border-blue-300/10 bg-blue-400/[0.018] shadow-[inset_0_0_90px_rgba(37,99,235,0.06)]" aria-hidden="true" />
      <div className="absolute left-[52%] top-[24%] h-[50%] w-[32%] rotate-[-12deg] rounded-[50%] border border-cyan-200/10" aria-hidden="true" />
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
            <div className="relative grid h-16 w-16 place-items-center">
              <div
                className="absolute rounded-full border border-white/10 bg-white/[0.015]"
                style={{ height: position.orbit, width: position.orbit, boxShadow: `inset 0 0 28px ${stage.scene.accent}14` }}
                aria-hidden="true"
              />
              <span className="absolute h-8 w-8 rounded-full blur-lg" style={{ backgroundColor: `${stage.scene.accent}22` }} aria-hidden="true" />
              <span className="relative grid h-11 w-11 place-items-center rounded-full border border-white/18 bg-[#081626]/70 shadow-[0_18px_44px_rgba(2,6,23,0.32)] backdrop-blur" style={{ color: stage.scene.accent }}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </div>
        );
      })}

      <p className="sr-only">
        Static atlas preview shown because WebGL is unavailable.
      </p>
    </div>
  );
}
