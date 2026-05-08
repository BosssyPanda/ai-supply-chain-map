import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { BoxGeometry, ConeGeometry, CylinderGeometry, DodecahedronGeometry, Group, SphereGeometry, TorusGeometry } from 'three';
import type { AtlasStage } from './atlasStages';

const platformGeometry = new CylinderGeometry(1.42, 1.62, 0.2, 8);
const deckGeometry = new CylinderGeometry(1.22, 1.34, 0.09, 8);
const skirtGeometry = new ConeGeometry(1.42, 0.72, 8);
const rimGeometry = new TorusGeometry(0.82, 0.01, 8, 56);
const boxGeometry = new BoxGeometry(1, 1, 1);
const sphereGeometry = new SphereGeometry(1, 24, 16);
const beaconGeometry = new SphereGeometry(0.035, 12, 8);
const discGeometry = new CylinderGeometry(1, 1, 0.08, 48);
const rockGeometry = new DodecahedronGeometry(0.42, 0);

export function AtlasStagePlatform({
  stage,
  isActive,
  isDimmed,
}: {
  stage: AtlasStage;
  isActive: boolean;
  isDimmed: boolean;
}): JSX.Element {
  const groupRef = useRef<Group | null>(null);
  const opacity = isDimmed ? 0.34 : isActive ? 1 : 0.88;
  const lift = isActive ? 0.18 : 0;

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const ease = 1 - Math.exp(-delta * 4);
    group.position.y += (lift - group.position.y) * ease;
    const targetScale = isActive ? 1.07 : isDimmed ? 0.94 : 1;
    group.scale.x += (targetScale - group.scale.x) * ease;
    group.scale.y += (targetScale - group.scale.y) * ease;
    group.scale.z += (targetScale - group.scale.z) * ease;
  });

  return (
    <group ref={groupRef} position={[...stage.scene.position]} rotation={[0, -0.48, 0]}>
      <mesh geometry={skirtGeometry} position={[0, -0.42, 0]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color="#09111d" roughness={0.86} metalness={0.05} transparent opacity={isDimmed ? 0.36 : 0.72} />
      </mesh>
      <mesh geometry={platformGeometry} receiveShadow>
        <meshStandardMaterial color="#162a44" roughness={0.68} metalness={0.1} transparent opacity={opacity} />
      </mesh>
      <mesh geometry={deckGeometry} position={[0, 0.13, 0]} receiveShadow>
        <meshStandardMaterial
          color={isActive ? '#1d4ed8' : '#203653'}
          emissive={stage.scene.glow}
          emissiveIntensity={isActive ? 0.2 : 0.07}
          roughness={0.58}
          metalness={0.12}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh geometry={deckGeometry} position={[0, 0.18, 0]} scale={[0.82, 1, 0.82]}>
        <meshBasicMaterial color={stage.scene.accent} transparent opacity={isActive ? 0.16 : 0.08} />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 0.78, 56]} />
        <meshBasicMaterial color={stage.scene.accent} transparent opacity={isActive ? 0.72 : 0.24} />
      </mesh>
      <mesh geometry={rimGeometry} position={[0, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={stage.scene.accent} transparent opacity={isActive ? 0.82 : 0.28} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => (
        <mesh key={angle} geometry={beaconGeometry} position={[Math.cos(angle) * 0.98, 0.28, Math.sin(angle) * 0.98]}>
          <meshBasicMaterial color={stage.scene.accent} transparent opacity={isDimmed ? 0.28 : isActive ? 0.95 : 0.54} />
        </mesh>
      ))}
      <StagePrimitive stage={stage} opacity={opacity} isActive={isActive} />
    </group>
  );
}

function StagePrimitive({ stage, opacity, isActive }: { stage: AtlasStage; opacity: number; isActive: boolean }): JSX.Element {
  switch (stage.scene.primitive) {
    case 'cloud':
      return <ModelsCloudPrimitive stage={stage} opacity={opacity} isActive={isActive} />;
    case 'chip':
      return <ComputeChipPrimitive stage={stage} opacity={opacity} isActive={isActive} />;
    case 'network':
      return <NetworkPrimitive stage={stage} opacity={opacity} isActive={isActive} />;
    case 'power':
      return <PowerPrimitive stage={stage} opacity={opacity} isActive={isActive} />;
    case 'materials':
      return <MaterialsPrimitive stage={stage} opacity={opacity} isActive={isActive} />;
  }
}

function ModelsCloudPrimitive({ stage, opacity, isActive }: PrimitiveProps): JSX.Element {
  return (
    <group>
      {[-0.48, 0, 0.48].map((x, index) => (
        <mesh key={x} geometry={boxGeometry} position={[x, 0.42 + index * 0.08, 0.12]} scale={[0.28, 0.52 + index * 0.1, 0.28]} castShadow>
          <meshStandardMaterial color="#2f5f91" emissive={stage.scene.glow} emissiveIntensity={isActive ? 0.2 : 0.06} transparent opacity={opacity} />
        </mesh>
      ))}
      {[
        [-0.42, 0.94, -0.12, 0.34],
        [-0.08, 1.05, -0.18, 0.42],
        [0.32, 0.98, -0.1, 0.36],
        [0.04, 1.16, 0.1, 0.32],
      ].map(([x, y, z, scale]) => (
        <mesh key={`${x}-${y}`} geometry={sphereGeometry} position={[x, y, z]} scale={scale} castShadow>
          <meshStandardMaterial color="#c8e7ff" emissive={stage.scene.accent} emissiveIntensity={isActive ? 0.2 : 0.06} transparent opacity={opacity * 0.9} />
        </mesh>
      ))}
    </group>
  );
}

function ComputeChipPrimitive({ stage, opacity, isActive }: PrimitiveProps): JSX.Element {
  return (
    <group>
      <mesh geometry={boxGeometry} position={[0, 0.46, 0]} scale={[0.9, 0.18, 0.9]} castShadow>
        <meshStandardMaterial color="#1d2a52" emissive={stage.scene.glow} emissiveIntensity={isActive ? 0.24 : 0.08} transparent opacity={opacity} />
      </mesh>
      <mesh geometry={boxGeometry} position={[0, 0.59, 0]} scale={[0.52, 0.05, 0.52]}>
        <meshStandardMaterial color="#9dc8ff" emissive={stage.scene.accent} emissiveIntensity={isActive ? 0.35 : 0.08} transparent opacity={opacity} />
      </mesh>
      {[-0.58, -0.36, -0.14, 0.14, 0.36, 0.58].map((x) => (
        <mesh key={x} geometry={boxGeometry} position={[x, 0.48, -0.54]} scale={[0.05, 0.08, 0.14]}>
          <meshStandardMaterial color="#fbbf24" transparent opacity={opacity * 0.8} />
        </mesh>
      ))}
      <mesh geometry={discGeometry} position={[0.66, 0.43, 0.46]} scale={[0.32, 1, 0.32]}>
        <meshStandardMaterial color="#97a7bd" metalness={0.35} roughness={0.42} transparent opacity={opacity * 0.75} />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} geometry={boxGeometry} position={[-0.68, 0.42 + index * 0.18, 0.36]} scale={[0.22, 0.12, 0.34]}>
          <meshStandardMaterial color="#263e68" emissive={stage.scene.glow} emissiveIntensity={0.08} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}

function NetworkPrimitive({ stage, opacity, isActive }: PrimitiveProps): JSX.Element {
  return (
    <group>
      {[
        [-0.55, 0.5, -0.32, 0.28, 0.74],
        [-0.08, 0.56, 0.08, 0.32, 0.9],
        [0.42, 0.5, -0.1, 0.28, 0.68],
        [0.12, 0.44, 0.5, 0.22, 0.48],
      ].map(([x, y, z, sx, sy]) => (
        <mesh key={`${x}-${z}`} geometry={boxGeometry} position={[x, y, z]} scale={[sx, sy, 0.24]} castShadow>
          <meshStandardMaterial color="#174467" emissive={stage.scene.glow} emissiveIntensity={isActive ? 0.24 : 0.08} transparent opacity={opacity} />
        </mesh>
      ))}
      {[-0.68, 0.68].map((x) => (
        <group key={x} position={[x, 0.78, 0.34]}>
          <mesh geometry={discGeometry} rotation={[Math.PI / 2.7, 0, 0]} scale={[0.22, 1, 0.22]}>
            <meshStandardMaterial color="#8bd9ff" emissive={stage.scene.accent} emissiveIntensity={isActive ? 0.22 : 0.05} transparent opacity={opacity * 0.85} />
          </mesh>
          <mesh geometry={boxGeometry} position={[0, -0.24, 0]} scale={[0.03, 0.42, 0.03]}>
            <meshStandardMaterial color="#9fb7d1" transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PowerPrimitive({ stage, opacity, isActive }: PrimitiveProps): JSX.Element {
  return (
    <group>
      {[-0.42, 0.28].map((x) => (
        <group key={x} position={[x, 0.52, -0.1]}>
          <mesh geometry={discGeometry} scale={[0.22, 1, 0.22]} castShadow>
            <meshStandardMaterial color="#9a9b95" roughness={0.52} transparent opacity={opacity} />
          </mesh>
          <mesh geometry={discGeometry} position={[0, 0.42, 0]} scale={[0.34, 1, 0.34]}>
            <meshStandardMaterial color="#c8c2b3" emissive={stage.scene.glow} emissiveIntensity={isActive ? 0.16 : 0.04} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
      {[-0.72, 0.72].map((x) => (
        <group key={x} position={[x, 0.56, 0.52]}>
          <mesh geometry={boxGeometry} scale={[0.08, 0.82, 0.08]}>
            <meshStandardMaterial color="#a6b2c2" transparent opacity={opacity} />
          </mesh>
          <mesh geometry={boxGeometry} position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 4]} scale={[0.42, 0.03, 0.03]}>
            <meshStandardMaterial color={stage.scene.accent} emissive={stage.scene.glow} emissiveIntensity={isActive ? 0.18 : 0.04} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
      <mesh geometry={boxGeometry} position={[0.1, 0.42, 0.42]} scale={[0.58, 0.22, 0.34]}>
        <meshStandardMaterial color="#41392d" emissive={stage.scene.glow} emissiveIntensity={isActive ? 0.16 : 0.04} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function MaterialsPrimitive({ stage, opacity, isActive }: PrimitiveProps): JSX.Element {
  return (
    <group>
      {[
        [-0.5, 0.42, -0.12, 0.48],
        [-0.05, 0.5, 0.18, 0.58],
        [0.42, 0.38, -0.06, 0.42],
      ].map(([x, y, z, scale]) => (
        <mesh key={`${x}-${z}`} geometry={rockGeometry} position={[x, y, z]} scale={scale} rotation={[0.2, 0.5, -0.18]} castShadow>
          <meshStandardMaterial color="#748196" emissive={stage.scene.glow} emissiveIntensity={isActive ? 0.14 : 0.03} roughness={0.82} transparent opacity={opacity} />
        </mesh>
      ))}
      {[-0.68, -0.36, 0.46, 0.72].map((x, index) => (
        <mesh key={x} geometry={boxGeometry} position={[x, 0.3 + index * 0.035, 0.52]} scale={[0.24, 0.12, 0.32]}>
          <meshStandardMaterial color={index % 2 === 0 ? '#9a6b3e' : '#475569'} transparent opacity={opacity * 0.86} />
        </mesh>
      ))}
    </group>
  );
}

interface PrimitiveProps {
  stage: AtlasStage;
  opacity: number;
  isActive: boolean;
}
