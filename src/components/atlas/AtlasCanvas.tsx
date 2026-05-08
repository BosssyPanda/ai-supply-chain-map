import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
  { left: '66%', top: '24%' },
  { left: '82%', top: '31%' },
  { left: '68%', top: '60%' },
  { left: '89%', top: '57%' },
  { left: '79%', top: '78%' },
] as const;

function CanvasFallback({ stages }: { stages: AtlasStage[] }): JSX.Element {
  return (
    <div className="relative h-full overflow-hidden" aria-label="Static atlas preview">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_42%,rgba(37,99,235,0.22),transparent_34%),radial-gradient(circle_at_78%_62%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.04),rgba(2,6,23,0.84))]" />
      <div className="absolute left-[18%] top-[18%] h-[68%] w-[66%] rounded-[50%] border border-blue-300/10 bg-blue-400/[0.02]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M66 28 C74 20 78 23 82 35 S77 57 68 63 S74 78 79 80 S84 66 89 60" fill="none" stroke="rgba(96,165,250,0.42)" strokeWidth="0.45" />
        <path d="M68 63 C76 55 82 54 89 60" fill="none" stroke="rgba(245,158,11,0.32)" strokeWidth="0.35" strokeDasharray="1.4 1.2" />
      </svg>

      {stages.slice(0, 5).map((stage, index) => {
        const position = fallbackPositions[index] ?? fallbackPositions[0];
        return (
          <div key={stage.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={position}>
            <div className="grid h-28 w-32 place-items-center rounded-lg border border-white/14 bg-white/[0.07] p-3 text-center shadow-[0_20px_60px_rgba(2,6,23,0.34)] backdrop-blur xl:h-5 xl:w-5 xl:rounded-full xl:border-white/25 xl:bg-white/10 xl:p-0">
              <span className="grid h-8 w-8 place-items-center rounded-md border border-white/20 text-xs font-semibold xl:hidden" style={{ color: stage.scene.accent }}>
                {stage.step}
              </span>
              <p className="mt-2 text-xs font-semibold leading-4 text-white xl:hidden">{stage.shortTitle}</p>
            </div>
          </div>
        );
      })}

      <p className="absolute bottom-7 left-1/2 max-w-sm -translate-x-1/2 px-6 text-center text-sm leading-6 text-white/62">
        Static atlas preview shown because WebGL is unavailable in this browser.
      </p>
    </div>
  );
}
