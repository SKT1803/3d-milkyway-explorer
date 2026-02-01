<div align="center">
  <!-- LOGO -->
  <img src="./public/logo/galaxy-explorer-logo-1-rb-w.webp" alt="3D Milky Way Explorer Logo" width="160" />

  <h1>3D Milky Way Explorer</h1>

  <p>
    An interactive 3D journey through the Milky Way — explore star systems,
    dive into planetary systems, and navigate celestial bodies in real time.
  </p>

  <!-- BADGES -->
  <p>
    <img src="https://img.shields.io/badge/Cosmic%203D%20Exploration-0F172A?style=for-the-badge&logo=starship&logoColor=A855F7" />
  </p>

  <p>
    <img src="https://img.shields.io/badge/Three.js-7C3AED?style=for-the-badge&logo=three.js&logoColor=white" />
    <img src="https://img.shields.io/badge/React-9333EA?style=for-the-badge&logo=react&logoColor=white" />
    <img src="https://img.shields.io/badge/React%20Three%20Fiber-A855F7?style=for-the-badge&logo=react&logoColor=white" />
    <img src="https://img.shields.io/badge/WebGL-6D28D9?style=for-the-badge&logo=webgl&logoColor=white" />
    <img src="https://img.shields.io/badge/Vite-8B5CF6?style=for-the-badge&logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/TailwindCSS-7C3AED?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  </p>

  <!-- LIVE DEMO -->
  <p>
    🌐 <b>Live Demo:</b>
    <a href="https://3d-milkyway-explorer.vercel.app/" target="_blank">
      Try it on Vercel
    </a>
  </p>
</div>

---

## 🌌 About the Project

**3D Milky Way Explorer** is a real-time, fully interactive 3D visualization of the Milky Way and multiple featured destinations —
from familiar planetary neighborhoods to iconic nearby stars and deep-space highlights.

Unlike static space visualizations, this project lets you:

- Navigate freely inside the Milky Way
- Warp into star systems with smooth transitions
- Explore planetary systems down to moons, rings, and belts
- Inspect special deep-space objects (e.g., a supermassive black hole region)
- Interact with spacecraft and satellites rendered as 3D models

Built with a **state-driven navigation architecture**, the experience remains smooth while switching between
galaxy → system → focused exploration modes.

---

## 🚀 Key Features

- 🌌 **Procedural Milky Way Galaxy**
  - Instanced star field + optimized rendering
  - Label-driven destinations & clean UI navigation

- ⭐ **Multiple Star Systems & Destinations**
  - **Solar System**
  - **Sirius A / B** (binary system)
  - **Alpha Centauri** (triple system)
  - **Vega**
  - **Capella**
  - **Castor**
  - **Antares**
  - **Naos**
  - **Betelgeuse**
  - **Kepler-22**
  - **Sagittarius A\*** (supermassive black hole region)

- 🪐 **Fully Modeled Planetary Exploration**
  - Planets, dwarf planets, and moons
  - Asteroid Belt & Kuiper Belt
  - Context-aware focus views (planet → moon → belt)

- 🛰️ **Spacecraft & Orbital Assets (3D Models)**
  - Probes & missions (e.g., **Voyager**, **New Horizons**)
  - Space telescopes (e.g., **Hubble**)
  - Human-made orbital structures (e.g., **ISS**)
  - Interactive placement within the scene for cinematic exploration

- 🕳️ **Black Hole Experience**
  - Dedicated **Sagittarius A\*** destination
  - Focus-friendly visuals + deep-space ambiance
  - Designed to feel distinct from star/planet systems

- 🎥 **Advanced Camera & Navigation Controls**
  - Warp-in / warp-out transitions
  - Focus & reset per destination
  - Smooth “return to galaxy” scaling

- 🧭 **UI + 3D Scene Synchronization**
  - Click directly in the 3D scene
  - Or use the left info panel destinations

- ✨ **Dynamic Labels**
  - Distance-aware scaling
  - Context-sensitive visibility to reduce clutter

- ⚡ **High Performance Rendering**
  - Instancing + optimized geometries
  - Smart visibility management for heavy scenes

---

## 🧭 Navigation Experience

1. **Galaxy View**
   - Free navigation across the Milky Way
   - Select a destination (star systems, deep space objects, exoplanet system)

2. **Warp Transition**
   - Smooth animated entry into the selected region

3. **Focused Exploration**
   - Inner systems: planets, moons, belts
   - Stellar systems: highlight stars / components
   - Deep-space: special objects (e.g., Sagittarius A\*)

4. **Return to Galaxy**
   - Cinematic exit with spatial scaling

---

## 🛠 Tech Stack

- **React**
- **React Three Fiber**
- **Three.js**
- **@react-three/drei**
- **WebGL**
- **Vite**
- **Tailwind CSS**

---

## 💻 Running Locally

```bash
npm install
npm run dev
```

---

## 📸 Previews

<table>
  <tr>
    <td align="center">
      <img src="./images/1.webp" width="480" alt="Milky Way - overview" />
      <br />
      <sub>Milky Way — Galaxy overview</sub>
    </td>
    <td align="center">
      <img src="./images/2.webp" width="480" alt="Milky Way - navigation" />
      <br />
      <sub>Sirius System — Inner system view</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="./images/3.webp" width="480" alt="Warp transition" />
      <br />
      <sub>Sirius A — Focus view</sub>
    </td>
    <td align="center">
      <img src="./images/4.webp" width="480" alt="Inner space - entry" />
      <br />
      <sub>Sirius B — Focus view</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="./images/5.webp" width="480" alt="Sun system overview" />
      <br />
      <sub>Alpha Centauri — Inner system view</sub>
    </td>
    <td align="center">
      <img src="./images/6.webp" width="480" alt="Solar system - orbits" />
      <br />
      <sub>Rigil Kentaurus (Alpha Centauri A) — Focus view</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="./images/7.webp" width="480" alt="Planet focus view" />
      <br />
      <sub>Proxima Centauri — Focus view</sub>
    </td>
    <td align="center">
      <img src="./images/8.webp" width="480" alt="Moon system view" />
      <br />
      <sub>Solar System — Sun distant view</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="./images/9.webp" width="480" alt="Asteroid belt view" />
      <br />
      <sub>Mercury — Planet focus view</sub>
    </td>
    <td align="center">
      <img src="./images/10.webp" width="480" alt="Kuiper belt view" />
      <br />
      <sub>Venus — Planet focus view</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="./images/11.webp" width="480" alt="Sirius system overview" />
      <br />
      <sub>Earth — Planet focus view</sub>
    </td>
    <td align="center">
      <img src="./images/12.webp" width="480" alt="Sirius inner view" />
      <br />
      <sub>Mars — Planet focus view</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="./images/13.webp" width="480" alt="Sirius A focus" />
      <br />
      <sub>Jupiter — Planet focus view</sub>
    </td>
    <td align="center">
      <img src="./images/14.webp" width="480" alt="Sirius B focus" />
      <br />
      <sub>Saturn — Planet focus view</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="./images/15.webp" width="480" alt="Alpha Centauri system overview" />
      <br />
      <sub>Uranus — Planet focus view</sub>
    </td>
    <td align="center">
      <img src="./images/16.webp" width="480" alt="Alpha Centauri inner view" />
      <br />
      <sub>Neptune — Planet focus view</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="./images/17.webp" width="480" alt="Alpha Centauri A focus" />
      <br />
      <sub>Pluto — Dwarf planet focus</sub>
    </td>
    <td align="center">
      <img src="./images/18.webp" width="480" alt="Alpha Centauri B focus" />
      <br />
      <sub>Haumea — Dwarf planet focus</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="./images/19.webp" width="480" alt="Proxima Centauri focus" />
      <br />
      <sub>Makemake — Dwarf planet focus</sub>
    </td>
    <td align="center">
      <img src="./images/20.webp" width="480" alt="UI info panel navigation" />
      <br />
      <sub>Eris — Dwarf planet focus</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="./images/21.webp" width="480" alt="Labels and scaling" />
      <br />
      <sub>Asteroid Belt — Inner belt focus</sub>
    </td>
    <td align="center">
      <img src="./images/22.webp" width="480" alt="Final overview" />
      <br />
      <sub>Kuiper Belt — Outer belt focus</sub>
    </td>
  </tr>
</table>

