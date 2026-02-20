import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshTransmissionMaterial, Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

interface GlassSphereProps {
  mousePosition: { x: number; y: number };
}

function GlassSphere({ mousePosition }: GlassSphereProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePosition.y * 0.5,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePosition.x * 0.5,
        0.1
      );
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      innerRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {/* Outer glass sphere */}
        <Sphere args={[1.5, 64, 64]}>
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={512}
            transmission={1}
            roughness={0.1}
            thickness={0.5}
            ior={1.5}
            chromaticAberration={0.06}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.2}
            clearcoat={1}
            attenuationDistance={0.5}
            attenuationColor="#8b5cf6"
            color="#8b5cf6"
          />
        </Sphere>
        
        {/* Inner glowing core */}
        <Sphere ref={innerRef} args={[0.5, 32, 32]}>
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </Sphere>
        
        {/* Orbiting rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2, 0.015, 16, 100]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

interface GlowingSphereProps {
  className?: string;
}

export function GlowingSphere({ className }: GlowingSphereProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePosition({ x, y });
  };

  return (
    <div className={className} onMouseMove={handleMouseMove}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <pointLight position={[-5, 5, 5]} intensity={1} color="#8b5cf6" />
        <pointLight position={[5, -5, 5]} intensity={1} color="#3b82f6" />
        <GlassSphere mousePosition={mousePosition} />
        <ContactShadows
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
          resolution={256}
          color="#8b5cf6"
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
