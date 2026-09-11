import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import GradientFlow from "./demos/GradientFlow.jsx";
import LiquidGlass from "./demos/LiquidGlass.jsx";
import LiquidLogo from "./demos/LiquidLogo.jsx";
import Particles from "./demos/Particles.jsx";

const DEMOS = [
  {
    id: "gradient",
    label: "Dégradé animé",
    hint: "Deux champs de simplex noise pilotent le mélange de trois couleurs, avec grain anti-banding.",
    Component: GradientFlow,
    camera: { position: [0, 0, 1] },
  },
  {
    id: "glass",
    label: "Liquid glass",
    hint: "Sphère en verre (transmission, distorsion, aberration chromatique) qui réfracte le texte derrière elle.",
    Component: LiquidGlass,
    camera: { position: [0, 0, 6], fov: 40 },
  },
  {
    id: "logo",
    label: "Logo liquide",
    hint: "Déformation de texture par noise + ondulation qui suit la souris. Bougez le curseur sur le logo.",
    Component: LiquidLogo,
    camera: { position: [0, 0, 3] },
  },
  {
    id: "particles",
    label: "Particules GPU",
    hint: "16 000 particules déplacées entièrement dans le vertex shader, zéro calcul CPU par frame.",
    Component: Particles,
    camera: { position: [0, 0, 6], fov: 50 },
  },
];

export default function App() {
  const [demoId, setDemoId] = useState("gradient");
  const demo = DEMOS.find((d) => d.id === demoId);

  return (
    <div className="app">
      <Canvas key={demo.id} camera={demo.camera} dpr={[1, 2]}>
        <demo.Component />
      </Canvas>

      <aside className="panel">
        <h1>shader-lab</h1>
        <p className="subtitle">Effets WebGL / React Three Fiber</p>
        <nav>
          {DEMOS.map((d) => (
            <button
              key={d.id}
              className={d.id === demoId ? "active" : ""}
              onClick={() => setDemoId(d.id)}
            >
              {d.label}
            </button>
          ))}
        </nav>
        <p className="hint">{demo.hint}</p>
        <a
          className="source"
          href="https://github.com/Lenu-san/shader-lab"
          target="_blank"
          rel="noreferrer"
        >
          Code source
        </a>
      </aside>
    </div>
  );
}
