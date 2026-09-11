import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { simplex3d } from "../lib/noise.js";
import { makeTextTexture } from "../lib/canvasTexture.js";

// Logo "liquide" : la texture est déformée par un flux de noise continu
// plus une ondulation circulaire qui suit la souris. L'aberration
// chromatique (décalage R/B) est proportionnelle à la déformation locale.
const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying vec2 vUv;

${simplex3d}

void main() {
  vec2 uv = vUv;

  // flux liquide permanent
  float flowX = snoise(vec3(uv * 3.0, uTime * 0.25));
  float flowY = snoise(vec3(uv * 3.0 + 100.0, uTime * 0.25));
  vec2 flow = vec2(flowX, flowY) * 0.012;

  // ondulation autour de la souris
  float dist = distance(uv, uMouse);
  float ripple = sin(dist * 34.0 - uTime * 5.0)
    * 0.028
    * smoothstep(0.45, 0.0, dist)
    * uMouseStrength;
  vec2 rippleOffset = normalize(uv - uMouse + 0.0001) * ripple;

  vec2 offset = flow + rippleOffset;
  float amount = length(offset);

  // décalage chromatique proportionnel à la déformation
  float r = texture2D(uTexture, uv + offset * 1.4).r;
  float g = texture2D(uTexture, uv + offset).g;
  float b = texture2D(uTexture, uv + offset * 0.6).b;

  vec3 color = vec3(r, g, b);
  color += amount * 2.5 * vec3(0.3, 0.2, 0.9);

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function LiquidLogo() {
  const materialRef = useRef();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const strength = useRef(0);

  const texture = useMemo(
    () =>
      makeTextTexture("L.", {
        size: 1024,
        font: "800 560px 'Segoe UI', Arial, sans-serif",
      }),
    []
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseStrength: { value: 0 },
    }),
    [texture]
  );

  useFrame((state, delta) => {
    const u = materialRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;

    // pointer est en [-1, 1], la texture attend du [0, 1]
    const target = new THREE.Vector2(
      state.pointer.x * 0.5 + 0.5,
      state.pointer.y * 0.5 + 0.5
    );
    const moving = mouse.current.distanceTo(target) > 0.001;
    mouse.current.lerp(target, 1 - Math.pow(0.001, delta));
    u.uMouse.value.copy(mouse.current);

    // l'ondulation monte quand la souris bouge, retombe sinon
    const targetStrength = moving ? 1 : 0;
    strength.current += (targetStrength - strength.current) * (moving ? 0.15 : 0.03);
    u.uMouseStrength.value = strength.current;
  });

  return (
    <mesh>
      <planeGeometry args={[3.4, 3.4]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
