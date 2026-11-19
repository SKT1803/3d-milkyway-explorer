/**
 * Compare Mode catalog — Sun, planets, dwarf planets and textured moons.
 *
 * radiusKm: physical mean/volumetric radius for True Size Ratio (km).
 * rotationPeriodHours: signed sidereal period, when a verified value exists;
 *                     negative means retrograde. Not an animation parameter.
 * previewSpinSpeed: deliberately compressed, artistic angular speed in rad/s.
 *                   Only this field is used by Compare's preview animation.
 * renderKind: sphere (default), sun, haumea, saturn.
 * visualExtent: geometry extent relative to the main body's radius,
 *               including rings/elongation, for automatic camera framing.
 *
 * Sources of physical radii/periods: NASA/JPL Solar System Dynamics.
 * Smaller irregular moon radii are approximate, marked when appropriate.
 */
import { CUSTOM_MODELS } from "../components/models/model-registry";

const planetTexture = (file) => `/textures/planets/${file}`;
const moonTexture = (system, file) => `/textures/${system}-moons/${file}`;

function moon(
  name,
  parentBody,
  radiusKm,
  texture,
  previewSpinSpeed,
  extra = {},
) {
  return {
    name,
    category: "Moon",
    parentBody,
    type: `Natural satellite of ${parentBody}`,
    radiusKm,
    texture,
    previewSpinSpeed,
    // In the main scene, natural satellites use 0.8 roughness and 0.15 metalness
    // except Earth's Moon (0.1); Mars moons use 48 sphere segments.
    roughness: 0.8,
    metalness: parentBody === "Earth" ? 0.1 : 0.15,
    surfaceSegments:
      parentBody === "Mars" ? 48 : parentBody === "Earth" ? 96 : 64,
    ...extra,
  };
}

export const COMPARE_BODIES = {
  // Central star
  Sun: {
    name: "Sun",
    category: "Star",
    type: "G-type main-sequence star",
    radiusKm: 695700,
    texture: "/textures/stars/sun.jpg",
    renderKind: "sun",
    previewSpinSpeed: 0.055,
    // Solar rotation varies by latitude, so no single physical period here.
  },

  // Eight planets
  Mercury: {
    name: "Mercury",
    category: "Planet",
    type: "Terrestrial planet",
    radiusKm: 2439.4,
    texture: planetTexture("mercury.jpg"),
    rotationPeriodHours: 58.6462 * 24,
    previewSpinSpeed: 0.04,
    roughness: 0.7,
    metalness: 0.2,
  },
  Venus: {
    name: "Venus",
    category: "Planet",
    type: "Terrestrial planet",
    radiusKm: 6051.8,
    texture: planetTexture("venus_surface.jpg"),
    cloudTexture: planetTexture("venus_atmosphere.jpg"),
    cloudScale: 1.02,
    cloudSegments: 64,
    rotationPeriodHours: -243.018 * 24,
    previewSpinSpeed: -0.03,
    cloudSpinSpeed: 0.12,
    roughness: 0.6,
    metalness: 0.25,
  },
  Earth: {
    name: "Earth",
    category: "Planet",
    type: "Terrestrial planet",
    radiusKm: 6371,
    texture: planetTexture("earth_daymap.jpg"),
    cloudTexture: planetTexture("earth_clouds.jpg"),
    cloudScale: 1.02,
    cloudSegments: 96,
    rotationPeriodHours: 0.99726968 * 24,
    previewSpinSpeed: 0.12,
    cloudSpinSpeed: 0.14,
    roughness: 0.5,
    metalness: 0.3,
  },
  Mars: {
    name: "Mars",
    category: "Planet",
    type: "Terrestrial planet",
    radiusKm: 3389.5,
    texture: planetTexture("mars.jpg"),
    rotationPeriodHours: 1.02595676 * 24,
    previewSpinSpeed: 0.115,
    roughness: 0.7,
    metalness: 0.25,
  },
  Jupiter: {
    name: "Jupiter",
    category: "Planet",
    type: "Gas giant",
    radiusKm: 69911,
    texture: planetTexture("jupiter.jpg"),
    rotationPeriodHours: 0.41354 * 24,
    previewSpinSpeed: 0.18,
    surfaceSegments: 128,
    roughness: 0.6,
    metalness: 0.3,
  },
  Saturn: {
    name: "Saturn",
    category: "Planet",
    type: "Gas giant",
    radiusKm: 58232,
    texture: planetTexture("saturn.jpg"),
    ringTexture: planetTexture("saturn_ring.png"),
    renderKind: "saturn",
    visualExtent: 2.1,
    rotationPeriodHours: 0.44401 * 24,
    previewSpinSpeed: 0.17,
    surfaceSegments: 128,
    roughness: 0.7,
    metalness: 0.25,
  },
  Uranus: {
    name: "Uranus",
    category: "Planet",
    type: "Ice giant",
    radiusKm: 25362,
    texture: planetTexture("uranus.jpg"),
    rotationPeriodHours: -0.71833 * 24,
    previewSpinSpeed: -0.14,
    axialTiltDeg: 97.8,
    roughness: 0.6,
    metalness: 0.25,
  },
  Neptune: {
    name: "Neptune",
    category: "Planet",
    type: "Ice giant",
    radiusKm: 24622,
    texture: planetTexture("neptune.jpg"),
    rotationPeriodHours: 0.67125 * 24,
    previewSpinSpeed: 0.15,
    roughness: 0.6,
    metalness: 0.25,
  },

  // Dwarf planets
  Ceres: {
    name: "Ceres",
    category: "Dwarf Planet",
    type: "Dwarf planet",
    radiusKm: 469.7,
    texture: planetTexture("ceres.jpg"),
    rotationPeriodHours: 0.37809042 * 24,
    previewSpinSpeed: 0.16,
    surfaceSegments: 64,
    roughness: 0.85,
    metalness: 0.1,
  },
  Pluto: {
    name: "Pluto",
    category: "Dwarf Planet",
    type: "Dwarf planet",
    radiusKm: 1188.3,
    texture: planetTexture("pluto.jpg"),
    rotationPeriodHours: -6.3872 * 24,
    previewSpinSpeed: -0.07,
    surfaceSegments: 72,
    roughness: 0.8,
    metalness: 0.18,
  },
  Haumea: {
    name: "Haumea",
    category: "Dwarf Planet",
    type: "Elongated dwarf planet",
    radiusKm: 715,
    texture: planetTexture("haumea.jpg"),
    rotationPeriodHours: 0.1631 * 24,
    previewSpinSpeed: 0.34,
    renderKind: "haumea",
    visualExtent: 1.8,
    // Exact visual ellipsoid axes used by src/components/celestials/haumea-system.jsx.
    // This is visual geometry; physical volumetric radius is unchanged.
    ellipsoidScale: [1.8, 0.9, 1.3],
    surfaceSegments: 64,
    roughness: 0.8,
    metalness: 0.18,
  },
  Makemake: {
    name: "Makemake",
    category: "Dwarf Planet",
    type: "Dwarf planet",
    radiusKm: 714,
    texture: planetTexture("makemake.jpg"),
    rotationPeriodHours: 0.937 * 24,
    previewSpinSpeed: 0.12,
    surfaceSegments: 64,
    roughness: 0.82,
    metalness: 0.16,
  },
  Eris: {
    name: "Eris",
    category: "Dwarf Planet",
    type: "Dwarf planet",
    radiusKm: 1200,
    texture: planetTexture("eris.jpg"),
    rotationPeriodHours: 1.079 * 24,
    previewSpinSpeed: 0.11,
    surfaceSegments: 64,
    roughness: 0.84,
    metalness: 0.18,
  },

  // Earth moon
  Moon: moon("Moon", "Earth", 1737.4, planetTexture("moon.jpg"), 0.08, {
    rotationPeriodHours: 655.7,
  }),

  // Mars moons
  Phobos: moon(
    "Phobos",
    "Mars",
    11.08,
    moonTexture("mars", "phobos.jpg"),
    0.15,
    { rotationPeriodHours: 0.31891023 * 24 },
  ),
  Deimos: moon("Deimos", "Mars", 6.2, moonTexture("mars", "deimos.jpg"), 0.13, {
    rotationPeriodHours: 1.2624407 * 24,
  }),

  // Jupiter moons
  Io: moon("Io", "Jupiter", 1821.49, moonTexture("jupiter", "io.jpeg"), 0.2, {
    rotationPeriodHours: 1.769138 * 24,
  }),
  Europa: moon(
    "Europa",
    "Jupiter",
    1560.8,
    moonTexture("jupiter", "europa.jpg"),
    0.18,
    { rotationPeriodHours: 3.551181 * 24 },
  ),
  Ganymede: moon(
    "Ganymede",
    "Jupiter",
    2631.2,
    moonTexture("jupiter", "ganymede.jpeg"),
    0.17,
    { rotationPeriodHours: 7.154553 * 24 },
  ),
  Callisto: moon(
    "Callisto",
    "Jupiter",
    2410.3,
    moonTexture("jupiter", "callisto.jpg"),
    0.15,
    { rotationPeriodHours: 16.689017 * 24 },
  ),
  Amalthea: moon(
    "Amalthea",
    "Jupiter",
    83.5,
    moonTexture("jupiter", "amalthea.jpg"),
    0.17,
    { rotationPeriodHours: 0.498179 * 24 },
  ),
  Thebe: moon(
    "Thebe",
    "Jupiter",
    49.3,
    moonTexture("jupiter", "thebe.jpg"),
    0.17,
    { rotationPeriodHours: 0.6745 * 24 },
  ),
  Himalia: moon(
    "Himalia",
    "Jupiter",
    85,
    moonTexture("jupiter", "himalia.jpg"),
    0.12,
    { rotationPeriodHours: 7.7819 },
  ),
  Elara: moon(
    "Elara",
    "Jupiter",
    38,
    moonTexture("jupiter", "elara.jpg"),
    0.12,
    { approximateRadius: true },
  ), // No reliable photometric rotation period.
  Pasiphae: moon(
    "Pasiphae",
    "Jupiter",
    25,
    moonTexture("jupiter", "pasiphae.jpg"),
    0.12,
    { approximateRadius: true },
  ),

  // Saturn moons
  Mimas: moon(
    "Mimas",
    "Saturn",
    198.2,
    moonTexture("saturn", "Mimas.jpg"),
    0.16,
    { rotationPeriodHours: 0.9424218 * 24 },
  ),
  Enceladus: moon(
    "Enceladus",
    "Saturn",
    252.1,
    moonTexture("saturn", "Enceladus.jpeg"),
    0.17,
    { rotationPeriodHours: 1.370218 * 24 },
  ),
  Tethys: moon(
    "Tethys",
    "Saturn",
    531.1,
    moonTexture("saturn", "Tethys.jpeg"),
    0.16,
    { rotationPeriodHours: 1.887802 * 24 },
  ),
  Dione: moon(
    "Dione",
    "Saturn",
    561.4,
    moonTexture("saturn", "Dione.jpeg"),
    0.16,
    { rotationPeriodHours: 2.736915 * 24 },
  ),
  Rhea: moon("Rhea", "Saturn", 763.5, moonTexture("saturn", "Rhea.jpg"), 0.16, {
    rotationPeriodHours: 4.5175 * 24,
  }),
  Titan: moon(
    "Titan",
    "Saturn",
    2574.76,
    moonTexture("saturn", "TitanSurface.jpeg"),
    0.15,
    {
      cloudTexture: moonTexture("saturn", "TitanClouds.jpg"),
      cloudScale: 1.035,
      cloudSegments: 64,
      cloudSpinSpeed: 0.16,
      rotationPeriodHours: 15.945421 * 24,
    },
  ),
  Iapetus: moon(
    "Iapetus",
    "Saturn",
    734.3,
    moonTexture("saturn", "Iapetus.jpg"),
    0.12,
    { rotationPeriodHours: 79.330183 * 24 },
  ),

  // Uranus moons
  Miranda: moon(
    "Miranda",
    "Uranus",
    235.8,
    moonTexture("uranus", "miranda.jpg"),
    0.17,
    { rotationPeriodHours: 1.413479 * 24 },
  ),
  Ariel: moon(
    "Ariel",
    "Uranus",
    578.9,
    moonTexture("uranus", "ariel.jpg"),
    0.16,
    { rotationPeriodHours: 2.520379 * 24 },
  ),
  Umbriel: moon(
    "Umbriel",
    "Uranus",
    584.7,
    moonTexture("uranus", "umbriel.jpg"),
    0.15,
    { rotationPeriodHours: 4.144176 * 24 },
  ),
  Titania: moon(
    "Titania",
    "Uranus",
    788.9,
    moonTexture("uranus", "titania.jpg"),
    0.16,
    { rotationPeriodHours: 8.705867 * 24 },
  ),
  Oberon: moon(
    "Oberon",
    "Uranus",
    761.4,
    moonTexture("uranus", "oberon.jpg"),
    0.14,
    { rotationPeriodHours: 13.463234 * 24 },
  ),

  // Neptune moons
  Proteus: moon(
    "Proteus",
    "Neptune",
    208,
    moonTexture("neptune", "proteus.jpg"),
    0.16,
    { rotationPeriodHours: 1.122315 * 24 },
  ),
  Triton: moon(
    "Triton",
    "Neptune",
    1352.6,
    moonTexture("neptune", "triton.jpg"),
    0.16,
    { rotationPeriodHours: -5.876854 * 24 },
  ),
};

// Stellar radii below are physical measurements/estimates, NOT the arbitrary
// render radii used by the Solar System scenes. R☉ = 695,700 km.
const SOLAR_RADIUS_KM = 695700;
const starTexture = (file) => `/textures/stars/${file}`;
function star(name, radiusSolar, texture, previewSpinSpeed, extra = {}) {
  return {
    name,
    category: "Star",
    type: "Star",
    radiusKm: radiusSolar * SOLAR_RADIUS_KM,
    texture: starTexture(texture),
    renderKind: "star",
    previewSpinSpeed,
    glowColor: "#fff2cf",
    visualExtent: 1.25,
    ...extra,
  };
}

export const STELLAR_COMPARE_BODIES = {
  // Sirius binary: Sirius A main sequence and Sirius B white dwarf
  "Sirius A": star("Sirius A", 1.713, "sirius.jpg", 0.4, {
    type: "A-type main-sequence star",
    glowColor: "#a9dcff",
    tint: "#eaf5ff",
  }),
  "Sirius B": star("Sirius B", 0.0084, "sirius.jpg", 0.6, {
    type: "White dwarf",
    glowColor: "#b8eaff",
    tint: "#dbeaff",
    radiusApproximate: true,
  }),

  // Alpha Centauri: use existing project textures from active system code.
  "Rigil Kentaurus": star(
    "Rigil Kentaurus",
    1.227,
    "capellaAb_yellow.jpg",
    0.45,
    {
      type: "G-type main-sequence star (Alpha Centauri A)",
      glowColor: "#ffe6aa",
      tint: "#fff1d5",
    },
  ),
  Toliman: star("Toliman", 0.865, "capellaAa_orange.jpg", 0.5, {
    type: "K-type main-sequence star (Alpha Centauri B)",
    glowColor: "#ffc88c",
    tint: "#ffe5bb",
  }),
  "Proxima Centauri": star(
    "Proxima Centauri",
    0.154,
    "capellaH_red_dwarf.jpg",
    0.65,
    {
      type: "Red dwarf (Alpha Centauri C)",
      glowColor: "#fa725f",
      tint: "#ffad98",
      radiusApproximate: true,
    },
  ),

  Vega: star("Vega", 2.6, "antares_b.jpg", 0.22, {
    type: "A-type main-sequence star",
    glowColor: "#9dbfff",
    tint: "#e7f2ff",
    // Vega rotates very rapidly and is oblate. Mean spherical radius is approximate.
    radiusApproximate: true, // Original VegaSystem uses a sphere.
  }),
  Betelgeuse: star("Betelgeuse", 800, "betelgeuse.jpg", 0.22, {
    type: "Red supergiant",
    glowColor: "#ff7a59",
    renderKind: "betelgeuse",
    radiusApproximate: true,
    // Estimated period (~36 ± 8 years) is disputed; don't imply a measured period.
    rotationPeriodStatus: "Uncertain (≈36 years proposed)",
    // 0.22 rad/s is from the supplied BetelgeuseSystem visual animation;
    // 800 solar radii remains an approximate PHYSICAL radius, not the
    // 60 scene-unit radius in the source system.
  }),

  "Antares A": star("Antares A", 680, "betelgeuse.jpg", 0.14, {
    type: "Red supergiant",
    glowColor: "#ff683b",
    tint: "#ffbb9e",
    radiusApproximate: true,
  }),
  "Antares B": star("Antares B", 5.2, "antares_b.jpg", 0.22, {
    type: "B-type main-sequence star",
    glowColor: "#69b8ff",
    tint: "#d5e8ff",
    radiusApproximate: true,
  }),

  "Capella Aa": star("Capella Aa", 11.98, "capellaAa_orange.jpg", 0.08, {
    type: "Yellow-orange giant",
    glowColor: "#ff9c47",
    tint: "#ffe0ae",
  }),
  "Capella Ab": star("Capella Ab", 8.83, "capellaAb_yellow.jpg", 0.12, {
    type: "Yellow giant",
    glowColor: "#ffd77c",
    tint: "#fff0bf",
  }),
  "Capella H": star("Capella H", 0.54, "capellaH_red_dwarf.jpg", 0.18, {
    type: "Red dwarf",
    glowColor: "#ff7659",
    tint: "#ffb39c",
    radiusApproximate: true,
  }),
  "Capella L": star("Capella L", 0.25, "capellaH_red_dwarf.jpg", 0.2, {
    type: "Red dwarf",
    glowColor: "#ff674c",
    tint: "#ffa38e",
    radiusApproximate: true,
    // Radius of Capella L is poorly constrained; indicative model scale.
    estimatedRadius: true,
  }),

  "Castor Aa": star("Castor Aa", 2.4, "antares_b.jpg", 0.22, {
    type: "A-type main-sequence star",
    glowColor: "#bddfff",
    tint: "#e7f5ff",
  }),
  "Castor Ab": star("Castor Ab", 0.4, "capellaH_red_dwarf.jpg", 0.28, {
    type: "Red dwarf",
    glowColor: "#ff765a",
    tint: "#ffae94",
    radiusApproximate: true,
    estimatedRadius: true,
  }),
  "Castor Ba": star("Castor Ba", 3.3, "antares_b.jpg", 0.24, {
    type: "A-type main-sequence star",
    glowColor: "#b8dbff",
    tint: "#eaf5ff",
    radiusApproximate: true,
  }),
  "Castor Bb": star("Castor Bb", 0.4, "capellaH_red_dwarf.jpg", 0.32, {
    type: "Red dwarf",
    glowColor: "#ff735a",
    tint: "#ffab92",
    radiusApproximate: true,
    estimatedRadius: true,
  }),
  "Castor Ca (YY Gem A)": star(
    "Castor Ca (YY Gem A)",
    0.619,
    "capellaH_red_dwarf.jpg",
    0.55,
    {
      type: "Red dwarf (YY Gem A)",
      glowColor: "#ff6551",
      tint: "#ffa495",
      radiusApproximate: true,
    },
  ),
  "Castor Cb (YY Gem B)": star(
    "Castor Cb (YY Gem B)",
    0.619,
    "capellaH_red_dwarf.jpg",
    0.62,
    {
      type: "Red dwarf (YY Gem B)",
      glowColor: "#ff6050",
      tint: "#ffa297",
      radiusApproximate: true,
    },
  ),

  Naos: star("Naos", 18.4, "naos.jpg", 0.2, {
    type: "O-type hot star",
    glowColor: "#89caff",
    tint: "#d9efff",
    radiusApproximate: true,
  }),

  "Kepler-22": star("Kepler-22", 0.979, "capellaAb_yellow.jpg", 0.075, {
    type: "G-type main-sequence star",
    glowColor: "#ffe0a0",
    tint: "#fff2d7",
    radiusApproximate: true,
  }),
  "Kepler-22b": {
    name: "Kepler-22b",
    category: "Exoplanet",
    type: "Super-Earth exoplanet",
    radiusKm: 2.1 * 6371,
    radiusApproximate: true,
    texture: "/textures/planets/kepler-22_b.jpg",
    previewSpinSpeed: 0.5,
    roughness: 1,
    metalness: 0,
  },

  "Sagittarius A*": {
    name: "Sagittarius A*",
    category: "Black Hole",
    type: "Supermassive black hole",
    // Approx. event horizon radius in km (not the artistic GLTF disk outer radius).
    radiusKm: 12000000,
    radiusApproximate: true,
    radiusKind: "eventHorizon",
    previewSpinSpeed: 0.8,
    renderKind: "blackholeModel",
    visualExtent: 2.2,
  },
};

Object.assign(COMPARE_BODIES, STELLAR_COMPARE_BODIES);

const ACTIVE_CRAFT_DIMENSIONS = {
  voyager: {
    referenceSpanM: 13,
    sizeLabel: "Approx. span (boom)",
    type: "Deep-space probe",
    sizeApproximate: true,
  },
  newHorizons: {
    referenceSpanM: 3.2,
    sizeLabel: "Overall length",
    type: "Deep-space probe",
  },
  iss: {
    referenceSpanM: 109,
    sizeLabel: "Truss span",
    type: "Space station",
  },
  hubble: {
    referenceSpanM: 13.2,
    sizeLabel: "Length",
    type: "Space telescope",
  },
};

export const SPACECRAFT_COMPARE_BODIES = Object.fromEntries(
  CUSTOM_MODELS.filter(({ id }) =>
    Object.hasOwn(ACTIVE_CRAFT_DIMENSIONS, id),
  ).map((model) => {
    const physical = ACTIVE_CRAFT_DIMENSIONS[model.id];
    return [
      model.name,
      {
        name: model.name,
        category: "Spacecraft",
        type: physical.type,
        renderKind: "spacecraft",
        modelUrl: model.url,
        modelRotation: model.rotation ?? [0, 0, 0],
        referenceSpanM: physical.referenceSpanM,
        sizeLabel: physical.sizeLabel,
        sizeApproximate: physical.sizeApproximate ?? false,
        radiusKm: physical.referenceSpanM / 2000,
        // Only orbiting registry entries have autonomous self-spin.
        // Orbital travel around Earth is not duplicated in an isolated comparison.
        previewSpinSpeed: model.spin?.enabled ? (model.spin.speed ?? 0) : 0,
        visualExtent: 1,
      },
    ];
  }),
);

Object.assign(COMPARE_BODIES, SPACECRAFT_COMPARE_BODIES);
