import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

interface OrbProps {
  position?: [number, number, number];
  color?: string;
  speed?: number;
  distort?: number;
}

function Orb({ position = [0, 0, 0], color = "#8b5cf6", speed = 2, distort = 0.4 }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={3}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

interface FloatingOrbProps {
  className?: string;
}

export function FloatingOrb({ className }: FloatingOrbProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[10, -10, 5]} intensity={0.5} color="#8b5cf6" />
        <Orb color="#8b5cf6" />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
