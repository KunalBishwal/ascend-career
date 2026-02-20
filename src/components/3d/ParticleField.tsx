import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
}

function Particles({ count = 2000 }: ParticlesProps) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

interface ParticleFieldProps {
  className?: string;
}

export function ParticleField({ className }: ParticleFieldProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Particles />
      </Canvas>
    </div>
  );
}
