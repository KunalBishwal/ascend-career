import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, useTexture, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  // Create connection points around the globe
  const points = [];
  const numPoints = 100;
  for (let i = 0; i < numPoints; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 2.1;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    points.push(x, y, z);
  }
  const pointsArray = new Float32Array(points);

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        {/* Main globe */}
        <Sphere ref={globeRef} args={[2, 64, 64]}>
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.3}
            roughness={0.7}
          />
        </Sphere>

        {/* Atmosphere glow */}
        <Sphere args={[2.05, 64, 64]}>
          <meshStandardMaterial
            color="#8b5cf6"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Grid lines */}
        <Sphere args={[2.02, 32, 32]}>
          <meshBasicMaterial
            color="#3b82f6"
            wireframe
            transparent
            opacity={0.15}
          />
        </Sphere>

        {/* Connection points */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={pointsArray}
              count={numPoints}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#8b5cf6"
            size={0.03}
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>

        {/* Orbiting ring */}
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[3, 0.015, 16, 100]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Second ring */}
        <mesh rotation={[Math.PI / 1.8, Math.PI / 4, 0]}>
          <torusGeometry args={[2.8, 0.01, 16, 100]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>
    </Float>
  );
}

interface CareerGlobeProps {
  className?: string;
}

export function CareerGlobe({ className }: CareerGlobeProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <pointLight position={[-10, 10, 10]} intensity={0.8} color="#8b5cf6" />
        <pointLight position={[10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <Globe />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
