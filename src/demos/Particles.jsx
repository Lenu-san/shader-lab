import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { simplex3d } from "../lib/noise.js";

// Nuage de particules GPU : les positions de base sont sur une sphère,
// le déplacement est calculé entièrement dans le vertex shader
// (aucune mise à jour de buffer côté CPU, uniquement uTime).
const COUNT = 16000;

const vertexShader = /* glsl */ `
uniform float uTime;
attribute float aSeed;
varying float vIntensity;

${simplex3d}

void main() {
  vec3 pos = position;

  float n = snoise(pos * 0.9 + uTime * 0.18);
  float n2 = snoise(pos * 2.2 - uTime * 0.12 + aSeed);

  // respiration globale + turbulence locale
  pos += normalize(position) * n * 0.55;
  pos += vec3(n2, snoise(pos * 1.5 + 30.0), snoise(pos * 1.5 - 30.0)) * 0.12;

  vIntensity = smoothstep(-0.5, 0.9, n);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (1.2 + vIntensity * 1.8) * (14.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = /* glsl */ `
varying float vIntensity;

void main() {
  // point rond avec bord doux
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.1, d);

  vec3 cold = vec3(0.08, 0.35, 0.9);
  vec3 hot = vec3(0.65, 0.25, 1.0);
  vec3 color = mix(cold, hot, vIntensity);

  gl_FragColor = vec4(color, alpha * 0.55);
}
`;

export default function Particles() {
  const materialRef = useRef();
  const groupRef = useRef();

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      // distribution uniforme sur une sphère
      const theta = Math.acos(1 - (2 * (i + 0.5)) / COUNT);
      const phi = i * 2.399963; // angle d'or
      const r = 2.0;
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
      seeds[i] = (i % 100) / 100;
    }
    return { positions, seeds };
  }, []);

  useFrame((state, delta) => {
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    groupRef.current.rotation.y += delta * 0.06;
  });

  return (
    <group ref={groupRef}>
      <color attach="background" args={["#07070b"]} />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-aSeed" count={COUNT} array={seeds} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          uniforms={{ uTime: { value: 0 } }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
