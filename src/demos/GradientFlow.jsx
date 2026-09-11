import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { simplex3d } from "../lib/noise.js";

// Dégradé animé plein écran : deux champs de simplex noise superposés
// pilotent le mélange de trois couleurs, plus un grain léger pour
// éviter le banding.
const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec2 vUv;

${simplex3d}

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;

  float n1 = snoise(vec3(uv * 1.6, uTime * 0.10));
  float n2 = snoise(vec3(uv * 2.8 + 40.0, uTime * 0.07 + n1 * 0.5));

  float t1 = smoothstep(-0.6, 0.6, n1);
  float t2 = smoothstep(-0.5, 0.7, n2);

  vec3 color = mix(uColorA, uColorB, t1);
  color = mix(color, uColorC, t2 * 0.6);

  // vignette douce
  float d = distance(uv, vec2(0.5));
  color *= 1.0 - d * 0.55;

  // grain anti-banding
  color += (rand(uv * uTime) - 0.5) * 0.02;

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function GradientFlow() {
  const materialRef = useRef();
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#12071f") },
      uColorB: { value: new THREE.Color("#7b2ff7") },
      uColorC: { value: new THREE.Color("#00d4ff") },
    }),
    []
  );

  useFrame((state) => {
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
