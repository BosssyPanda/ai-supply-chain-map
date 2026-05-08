import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { AtlasStage } from './atlasStages';

export function AtlasConnectionLines({
  stages,
  activeIndex,
  isHandoff = false,
}: {
  stages: AtlasStage[];
  activeIndex: number | null;
  isHandoff?: boolean;
}): JSX.Element {
  const paths = useMemo(
    () =>
      stages.slice(0, -1).map((stage, index) => ({
        id: `${stage.id}-${stages[index + 1].id}`,
        points: makeArc(stage.scene.position, stages[index + 1].scene.position),
        isActive: !isHandoff && (activeIndex === null || activeIndex === index || activeIndex === index + 1),
        tone: index >= 2 ? '#f59e0b' : '#60a5fa',
      })),
    [activeIndex, isHandoff, stages],
  );

  return (
    <group position={[0, 0.18, 0]}>
      {paths.map((path, index) => (
        <PulsingLine key={path.id} points={path.points} color={path.tone} isActive={path.isActive} delay={index * 0.52} />
      ))}
    </group>
  );
}

function PulsingLine({
  points,
  color,
  isActive,
  delay,
}: {
  points: [number, number, number][];
  color: string;
  isActive: boolean;
  delay: number;
}): JSX.Element {
  const lineRef = useRef<any>(null);

  useFrame(({ clock }) => {
    const material = lineRef.current?.material;
    if (!material) return;
    const pulse = 0.08 * Math.sin(clock.elapsedTime * 1.1 + delay);
    material.opacity = isActive ? 0.46 + pulse : 0.16;
  });

  return <Line ref={lineRef} points={points} color={color} lineWidth={1.1} transparent opacity={isActive ? 0.46 : 0.16} />;
}

function makeArc(from: readonly [number, number, number], to: readonly [number, number, number]): [number, number, number][] {
  const points: [number, number, number][] = [];
  const midLift = 0.42;

  for (let index = 0; index <= 24; index += 1) {
    const t = index / 24;
    const x = from[0] + (to[0] - from[0]) * t;
    const z = from[2] + (to[2] - from[2]) * t;
    const y = from[1] + (to[1] - from[1]) * t + Math.sin(t * Math.PI) * midLift;
    points.push([x, y, z]);
  }

  return points;
}
