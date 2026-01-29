export const CUSTOM_MODELS = [
  // Free space
  {
    id: "voyager",
    name: "Voyager 1",
    type: "free", // "free" | "orbit"
    url: "/models/voyager.glb",

    // world position
    position: [3000, 1000, -90],
    rotation: [0, Math.PI / 3, 0],
    scale: 0.08,
    showLabel: true,
    labelOffset: [2, 1, 2],
    labelScale: 1.0,
    focusRadius: 2.5,
  },

  {
    id: "newHorizons",
    name: "New Horizons",
    type: "free", // "free" | "orbit"
    url: "/models/new_horizons.glb",

    // world position
    position: [1600, 200, -90],
    rotation: [0, Math.PI / 2.6, 0],
    scale: 0.07,
    showLabel: true,
    labelOffset: [2, 1, 2],
    labelScale: 1.0,
    focusRadius: 2.0,
  },

  {
    id: "iss",
    name: "ISS",
    type: "orbit",
    url: "/models/iss.glb",
    // hangi gezegenin local space’ine bağlanacak?
    parent: "Earth", // "Earth", "Mars", "Jupiter"...
    orbit: {
      radius: 0.5,
      speed: 0.2,
      tiltDeg: 51.6,
      plane: "equatorial",
      initialPhase: Math.PI / 2,
      showRing: true,
      ringWidth: 0.002,
      ringOpacity: 0.45,
      ringColor: "#aab3ff",
    },
    rotation: [0, Math.PI / 2, 0],
    scale: 0.0008,
    spin: {
      enabled: true,
      speed: 0.02,
      axis: "y",
    },

    showLabel: true,
    labelOffset: [0, 0.4, 0],
    labelScale: 0.2,
    focusRadius: 1.5,
  },

  // Earth orbiter telescope
  {
    id: "hubble",
    name: "Hubble",
    type: "orbit",
    url: "/models/hubble.glb",
    parent: "Earth",
    orbit: {
      radius: 0.65,
      speed: 0.18,
      tiltDeg: 28.5,
      plane: "equatorial",
      initialPhase: Math.PI / 4,
      showRing: true,
      ringWidth: 0.002,
      ringOpacity: 0.45,
      ringColor: "#aab3ff",
    },

    rotation: [0, Math.PI / 2, 0],
    scale: 0.002,
    spin: {
      enabled: true,
      speed: 0.15,
      axis: "y",
    },

    showLabel: true,
    labelOffset: [0, 0.45, 0],
    labelScale: 0.2,
    focusRadius: 1.2,
  },
];
