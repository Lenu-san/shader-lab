# shader-lab

> **Projet annexe, hors cybersécurité / Side project, unrelated to cybersecurity.**
> Mon activité principale (audit, sécurité des infrastructures, services managés) est décrite sur mon [portfolio](https://lenu-san.github.io). Ce dépôt reste public par transparence sur le contenu de ce compte.
> My main activity (auditing, infrastructure security, managed services) is described on my [portfolio](https://lenu-san.github.io). This repository stays public for transparency about what this account contains.

Démo / Demo: https://lenu-san.github.io/shader-lab/

---

## Français

### Objectif

Comprendre comment fonctionnent les shaders et le rendu GPU dans un navigateur, à travers quatre effets visuels WebGL.

### Contexte cybersécurité

Aucun. Projet personnel d'exploration graphique.

### Fonctionnalités

- **Dégradé animé** : deux champs de simplex noise 3D superposés pilotent le mélange de trois couleurs ; grain procédural, vignette douce.
- **Liquid glass** : sphère en verre flottante (transmission, épaisseur, distorsion temporelle, aberration chromatique) qui réfracte le texte placé derrière elle.
- **Logo liquide** : déformation de texture par flux de noise continu, plus une ondulation circulaire qui suit la souris.
- **Particules GPU** : 16 000 particules dont le déplacement est calculé entièrement dans le vertex shader.

### Technologies et outils

- React Three Fiber + drei, Three.js
- Shaders GLSL écrits à la main (simplex noise d'après l'implémentation classique d'Ashima Arts / Stefan Gustavson)
- Vite, déployé sur GitHub Pages (`npm run deploy`)

```
index.html
vite.config.js
src/
  main.jsx               montage React
  App.jsx                sélecteur de démo
  demos/                 GradientFlow, LiquidGlass, LiquidLogo, Particles
  lib/
    noise.js             simplex noise 3D partagé (string GLSL injecté)
    canvasTexture.js     textures de texte générées en canvas 2D
  styles.css
```

### Installation

```bash
npm install
npm run dev
```

### Utilisation

Ouvrir l'adresse affichée par Vite et choisir une démo dans le sélecteur. Chaque démo monte son propre `<Canvas>` ; changer de démo détruit le contexte de la précédente.

### Résultats

Démo en ligne sur GitHub Pages (lien ci-dessus).

### Limites

- Nécessite WebGL 2 et un GPU raisonnable ; pas de repli pour les navigateurs sans WebGL.
- Aucun test automatisé ; validation visuelle uniquement.

### Améliorations possibles

- Repli statique pour les navigateurs sans WebGL.

---

## English

### Objective

Understand how shaders and GPU rendering work in a browser, through four WebGL visual effects.

### Cybersecurity context

None. A personal graphics exploration project.

### Features

- **Animated gradient**: two layered 3D simplex noise fields drive a three-colour blend; procedural grain, soft vignette.
- **Liquid glass**: a floating glass sphere (transmission, thickness, time distortion, chromatic aberration) refracting the text behind it.
- **Liquid logo**: texture distortion by a continuous noise flow, plus a circular ripple following the mouse.
- **GPU particles**: 16,000 particles whose motion is computed entirely in the vertex shader.

### Technologies and tools

- React Three Fiber + drei, Three.js
- Hand-written GLSL shaders (simplex noise after the classic Ashima Arts / Stefan Gustavson implementation)
- Vite, deployed on GitHub Pages (`npm run deploy`)

### Installation

```bash
npm install
npm run dev
```

### Usage

Open the address printed by Vite and pick a demo in the selector. Each demo mounts its own `<Canvas>`; switching demos tears down the previous context.

### Results

Live demo on GitHub Pages (link above).

### Limitations

- Requires WebGL 2 and a reasonable GPU; no fallback for browsers without WebGL.
- No automated tests; visual validation only.

### Possible improvements

- Static fallback for browsers without WebGL.

---

## Auteur / Author

**Lénusan Gunarajah** — ingénieur cybersécurité junior. Ce dépôt est un projet annexe. / Junior cybersecurity engineer. This repository is a side project.

- Portfolio : https://lenu-san.github.io
- GitHub : https://github.com/Lenu-san
