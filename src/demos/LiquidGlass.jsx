import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { makeTextTexture } from "../lib/canvasTexture.js";

// Sphère en verre "liquide" (transmission + distorsion + aberration
// chromatique) qui flotte devant un panneau de texte : le texte est
// réfracté et déformé à travers le verre.
export default function LiquidGlass() {
  const glassRef = useRef();

  const textTexture = useMemo(
    () => makeTextTexture(["SHADER", "LAB", "SHADER", "LAB"], { size: 1024 }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (glassRef.current) {
      glassRef.current.position.x = Math.sin(t * 0.5) * 1.1;
      glassRef.current.position.y = Math.cos(t * 0.7) * 0.5;
      glassRef.current.rotation.x = t * 0.2;
      glassRef.current.rotation.y = t * 0.25;
    }
  });

  return (
    <>
      <color attach="background" args={["#0b0b10"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-4, -2, 3]} intensity={0.4} color="#7b2ff7" />

      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[9, 9]} />
        <meshBasicMaterial map={textTexture} />
      </mesh>

      <mesh ref={glassRef}>
        <sphereGeometry args={[1.15, 64, 64]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={1.4}
          roughness={0.08}
          ior={1.4}
          chromaticAberration={0.06}
          anisotropicBlur={0.2}
          distortion={0.5}
          distortionScale={0.6}
          temporalDistortion={0.2}
          samples={6}
          resolution={512}
        />
      </mesh>
    </>
  );
}
