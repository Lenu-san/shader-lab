import * as THREE from "three";

// Génère une texture de texte via canvas 2D, pour éviter de charger
// des polices externes dans les scènes.
export function makeTextTexture(lines, options = {}) {
  const {
    size = 1024,
    background = "#0b0b10",
    color = "#f2f2f5",
    font = "700 190px 'Segoe UI', Arial, sans-serif",
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const list = Array.isArray(lines) ? lines : [lines];
  const lineHeight = 210;
  const startY = size / 2 - ((list.length - 1) * lineHeight) / 2;
  list.forEach((line, i) => {
    ctx.fillText(line, size / 2, startY + i * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
