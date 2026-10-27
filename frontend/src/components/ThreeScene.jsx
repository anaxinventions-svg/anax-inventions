import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

function VisibleNet() {
  const groupRef = useRef(null);
  const { mouse } = useThree();

  // Create hexagonal/net pattern
  const lines = useMemo(() => {
    const allLines = [];
    const size = 16;
    const step = 1.0;
    
    // Dense criss-cross net pattern
    for (let i = -size; i <= size; i += step) {
      // Diagonal lines
      allLines.push({
        points: [
          new THREE.Vector3(-size, i, 0),
          new THREE.Vector3(size, i + 6, 0)
        ],
        key: `d1-${i}`
      });
      allLines.push({
        points: [
          new THREE.Vector3(i, -size, 0),
          new THREE.Vector3(i + 6, size, 0)
        ],
        key: `d2-${i}`
      });
    }
    return allLines;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.06 + mouse.y * 0.05;
      groupRef.current.rotation.x = Math.cos(t * 0.15) * 0.04 + mouse.x * 0.04;
      groupRef.current.rotation.y = t * 0.03 + mouse.x * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, idx) => (
        <Line
          key={line.key}
          points={line.points}
          color="#1d2e2a"
          lineWidth={0.5}
          opacity={0.18}
          transparent
        />
      ))}
    </group>
  );
}

function NetPoints({ count = 120 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return p;
  }, [count]);

  const ref = useRef(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0008;
      ref.current.rotation.x = mouse.y * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#1d2e2a"
        size={0.08}
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </points>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }} dpr={[1, 2]}>
        <color attach="background" args={['#ffffff']} />
        <VisibleNet />
        <NetPoints />
      </Canvas>
    </div>
  );
}