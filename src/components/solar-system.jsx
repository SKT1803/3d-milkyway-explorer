import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { JupiterSystem } from "./celestials/jupiter-system";
import { SaturnSystem } from "./celestials/saturn-system";
import { EarthSystem } from "./celestials/earth-system";
import { MarsSystem } from "./celestials/mars-system";
import { UranusSystem } from "./celestials/uranus-system";
import { NeptuneSystem } from "./celestials/neptune-system";
import { PlutoSystem } from "./celestials/pluto-system";
import { HaumeaSystem } from "./celestials/haumea-system";
import { MakemakeSystem } from "./celestials/makemake-system";
import { ErisSystem } from "./celestials/eris-system";
import { AsteroidBelt } from "./celestials/asteroid-belt";

export function SolarSystem({
  showLabels = true,
  onPlanetLabelClick,
  focusedPlanetName,
  onRegisterPlanetFocusApi,
}) {
  const sunGroupRef = useRef(null);
  const sunRef = useRef(null);

  const mercuryGroupRef = useRef(null);
  const mercuryRef = useRef(null);

  const venusGroupRef = useRef(null);
  const venusRef = useRef(null);
  const venusCloudsRef = useRef(null);

  const earthGroupRef = useRef(null);
  const earthRef = useRef(null);
  const cloudsRef = useRef(null);

  const moonGroupRef = useRef(null);
  const moonRef = useRef(null);

  const marsGroupRef = useRef(null);
  const marsRef = useRef(null);

  const jupiterGroupRef = useRef(null);
  const jupiterRef = useRef(null);

  const saturnGroupRef = useRef(null);
  const saturnRef = useRef(null);
  const saturnRingRef = useRef(null);

  const uranusGroupRef = useRef(null);
  const uranusRef = useRef(null);

  const neptuneGroupRef = useRef(null);
  const neptuneRef = useRef(null);

  const plutoGroupRef = useRef(null);
  const plutoRef = useRef(null);

  const haumeaGroupRef = useRef(null);
  const haumeaRef = useRef(null);

  const makemakeGroupRef = useRef(null);
  const makemakeRef = useRef(null);

  const erisGroupRef = useRef(null);
  const erisRef = useRef(null);

  // Asteroid / Kuiper kuşağı için görünmez focus noktaları
  const asteroidBeltFocusRef = useRef(null);
  const kuiperBeltFocusRef = useRef(null);

  // Mars uyduları
  const phobosRef = useRef(null);
  const deimosRef = useRef(null);

  // Jüpiter uyduları için ref'ler
  const ioRef = useRef(null);
  const europaRef = useRef(null);
  const ganymedeRef = useRef(null);
  const callistoRef = useRef(null);

  const amaltheaRef = useRef(null);
  const thebeRef = useRef(null);
  const himaliaRef = useRef(null);
  const pasiphaeRef = useRef(null);
  const elaraRef = useRef(null);

  // Saturn uyduları için ref'ler
  const titanRef = useRef(null);
  const dioneRef = useRef(null);
  const enceladusRef = useRef(null);
  const iapetusRef = useRef(null);
  const mimasRef = useRef(null);
  const rheaRef = useRef(null);
  const tethysRef = useRef(null);

  // Uranus uyduları için ref'ler
  const mirandaRef = useRef(null);
  const arielRef = useRef(null);
  const umbrielRef = useRef(null);
  const titaniaRef = useRef(null);
  const oberonRef = useRef(null);

  // Neptune uyduları için ref'ler
  const proteusRef = useRef(null);
  const tritonRef = useRef(null);

  const { camera } = useThree();
  const [labelScale, setLabelScale] = useState(1);

  const textures = useTexture([
    "/textures/stars/sun.jpg",
    "/textures/planets/earth_daymap.jpg",
    "/textures/planets/earth_clouds.jpg",
    "/textures/planets/moon.jpg",
    "/textures/planets/mercury.jpg",
    "/textures/planets/venus_surface.jpg",
    "/textures/planets/venus_atmosphere.jpg",
    "/textures/planets/mars.jpg",
    "/textures/planets/jupiter.jpg",
    "/textures/planets/saturn.jpg",
    "/textures/planets/saturn_ring.png",
    "/textures/planets/uranus.jpg",
    "/textures/planets/neptune.jpg",
    "/textures/planets/pluto.jpg",
    "/textures/planets/haumea.jpg",

    "/textures/planets/makemake.jpg",
    "/textures/planets/eris.jpg",

    // Jüpiter uyduları
    "/textures/jupiter-moons/elara.jpg",
    "/textures/jupiter-moons/europa.jpg",
    "/textures/jupiter-moons/io.jpeg",
    "/textures/jupiter-moons/ganymede.jpeg",
    "/textures/jupiter-moons/callisto.jpg",
    "/textures/jupiter-moons/amalthea.jpg",
    "/textures/jupiter-moons/himalia.jpg",
    "/textures/jupiter-moons/pasiphae.jpg",
    "/textures/jupiter-moons/thebe.jpg",

    // Saturn uyduları
    "/textures/saturn-moons/Dione.jpeg",
    "/textures/saturn-moons/Enceladus.jpeg",
    "/textures/saturn-moons/Iapetus.jpg",
    "/textures/saturn-moons/Mimas.jpg",
    "/textures/saturn-moons/Rhea.jpg",
    "/textures/saturn-moons/Tethys.jpeg",
    "/textures/saturn-moons/TitanClouds.jpg",
    "/textures/saturn-moons/TitanSurface.jpeg",

    // Mars moons
    "/textures/mars-moons/phobos.jpg",
    "/textures/mars-moons/deimos.jpg",

    // Uranus moons
    "/textures/uranus-moons/miranda.jpg",
    "/textures/uranus-moons/ariel.jpg",
    "/textures/uranus-moons/umbriel.jpg",
    "/textures/uranus-moons/titania.jpg",
    "/textures/uranus-moons/oberon.jpg",

    // Neptune moons
    "/textures/neptune-moons/proteus.jpg",
    "/textures/neptune-moons/triton.jpg",

    // Asteroid belt için tek bir kaya dokusu
    "/textures/asteroids/asteroid_diffuse.jpg",
  ]);

  const [
    sunTex,
    earthDay,
    earthClouds,
    moonTex,
    mercuryTex,
    venusSurfaceTex,
    venusAtmoTex,
    marsTex,
    jupiterTex,
    saturnTex,
    saturnRingTex,
    uranusTex,
    neptuneTex,
    plutoTex,
    haumeaTex,
    makemakeTex,
    erisTex,
    elaraTex,
    europaTex,
    ioTex,
    ganymedeTex,
    callistoTex,
    amaltheaTex,
    himaliaTex,
    pasiphaeTex,
    thebeTex,
    dioneTex,
    enceladusTex,
    iapetusTex,
    mimasTex,
    rheaTex,
    tethysTex,
    titanCloudsTex,
    titanSurfaceTex,
    phobosTex,
    deimosTex,
    mirandaTex,
    arielTex,
    umbrielTex,
    titaniaTex,
    oberonTex,
    proteusTex,
    tritonTex,
    asteroidTex,
  ] = textures;

  textures.forEach((t) => {
    if (t) t.colorSpace = THREE.SRGBColorSpace;
  });

  useFrame((_, delta) => {
    {
      const d = camera.position.length();
      const minDist = 160;
      const maxDist = 800;

      const t = THREE.MathUtils.clamp(
        (maxDist - d) / (maxDist - minDist),
        0,
        1
      );

      const targetScale = 0.8 + t * 1.2;

      setLabelScale((prev) => {
        const lerped = THREE.MathUtils.lerp(prev, targetScale, 0.12);
        if (Math.abs(lerped - prev) < 0.001) return prev;
        return lerped;
      });
    }

    // ORBIT ROTASYONLARI
    if (sunGroupRef.current) {
      sunGroupRef.current.rotation.y += 0.06 * delta;
    }

    if (mercuryGroupRef.current) {
      const speed = focusedPlanetName === "Mercury" ? 0 : 0.29;
      mercuryGroupRef.current.rotation.y += speed * delta;
    }

    if (venusGroupRef.current) {
      const speed = focusedPlanetName === "Venus" ? 0 : 0.21;
      venusGroupRef.current.rotation.y += speed * delta;
    }

    if (earthGroupRef.current) {
      const earthSystemFocused =
        focusedPlanetName === "Earth" || focusedPlanetName === "Moon";
      const speed = earthSystemFocused ? 0 : 0.18;
      earthGroupRef.current.rotation.y += speed * delta;
    }

    if (marsGroupRef.current) {
      const marsSystemFocused =
        focusedPlanetName === "Mars" ||
        focusedPlanetName === "Phobos" ||
        focusedPlanetName === "Deimos";
      const speed = marsSystemFocused ? 0 : 0.15;
      marsGroupRef.current.rotation.y += speed * delta;
    }

    if (jupiterGroupRef.current) {
      const jupiterSystemFocused = [
        "Jupiter",
        "Io",
        "Europa",
        "Ganymede",
        "Callisto",
        "Amalthea",
        "Thebe",
        "Himalia",
        "Elara",
        "Pasiphae",
      ].includes(focusedPlanetName);

      const speed = jupiterSystemFocused ? 0 : 0.08;
      jupiterGroupRef.current.rotation.y += speed * delta;
    }

    if (saturnGroupRef.current) {
      const saturnSystemFocused = [
        "Saturn",
        "Titan",
        "Rhea",
        "Dione",
        "Tethys",
        "Enceladus",
        "Mimas",
        "Iapetus",
      ].includes(focusedPlanetName);

      const speed = saturnSystemFocused ? 0 : 0.06;
      saturnGroupRef.current.rotation.y += speed * delta;
    }

    if (uranusGroupRef.current) {
      const uranusSystemFocused = [
        "Uranus",
        "Miranda",
        "Ariel",
        "Umbriel",
        "Titania",
        "Oberon",
      ].includes(focusedPlanetName);
      const speed = uranusSystemFocused ? 0 : 0.04;
      uranusGroupRef.current.rotation.y += speed * delta;
    }

    if (neptuneGroupRef.current) {
      const neptuneSystemFocused = ["Neptune", "Proteus", "Triton"].includes(
        focusedPlanetName
      );
      const speed = neptuneSystemFocused ? 0 : 0.03;
      neptuneGroupRef.current.rotation.y += speed * delta;
    }

    if (plutoGroupRef.current) {
      const plutoSystemFocused = focusedPlanetName === "Pluto";
      const speed = plutoSystemFocused ? 0 : 0.02;
      plutoGroupRef.current.rotation.y += speed * delta;
    }

    if (haumeaGroupRef.current) {
      const haumeaSystemFocused = focusedPlanetName === "Haumea";
      const speed = haumeaSystemFocused ? 0 : 0.018;
      haumeaGroupRef.current.rotation.y += speed * delta;
    }

    if (makemakeGroupRef.current) {
      const makemakeSystemFocused = focusedPlanetName === "Makemake";
      const speed = makemakeSystemFocused ? 0 : 0.017;
      makemakeGroupRef.current.rotation.y += speed * delta;
    }

    if (erisGroupRef.current) {
      const erisSystemFocused = focusedPlanetName === "Eris";
      const speed = erisSystemFocused ? 0 : 0.014;
      erisGroupRef.current.rotation.y += speed * delta;
    }

    // KENDİ EKSENİ ROTASYONLARI
    if (sunRef.current) sunGroupRef.current.rotation.y += 0.075 * delta;

    if (mercuryRef.current) mercuryRef.current.rotation.y += 0.35 * delta;
    if (venusRef.current) venusRef.current.rotation.y += -0.35 * delta;
    if (venusCloudsRef.current)
      venusCloudsRef.current.rotation.y += 0.3 * delta;

    if (earthRef.current) earthRef.current.rotation.y += 0.5 * delta;
    if (cloudsRef.current) cloudsRef.current.rotation.y += 0.6 * delta;

    if (moonRef.current) {
      moonRef.current.rotation.y += 0.25 * delta;
    }

    if (marsRef.current) marsRef.current.rotation.y += 0.475 * delta;

    if (jupiterRef.current) jupiterRef.current.rotation.y += 1.0 * delta;
    if (saturnRef.current) saturnRef.current.rotation.y += 0.9 * delta;
    if (saturnRingRef.current) saturnRingRef.current.rotation.z += 0.25 * delta;
    if (uranusRef.current) uranusRef.current.rotation.y += 0.7 * delta;
    if (neptuneRef.current) neptuneRef.current.rotation.y += 0.75 * delta;
    if (plutoRef.current) plutoRef.current.rotation.y += 0.3 * delta;
    if (haumeaRef.current) haumeaRef.current.rotation.y += 2 * delta;
    if (makemakeRef.current) makemakeRef.current.rotation.y += 0.28 * delta;
    if (erisRef.current) erisRef.current.rotation.y += 0.24 * delta;
  });

  // ========= ÖLÇEK VE ORBİT MASTER AYARLARI =========

  const sunRadius = 10;

  // Tüm gezegen & uydular için genel scale
  const PLANET_SCALE = 1.8;
  const EARTH_BASE_RADIUS = 0.174;
  const earthRadius = EARTH_BASE_RADIUS * PLANET_SCALE;

  // Cüce gezegenleri biraz büyütmek için multiplier
  const DWARF_VISUAL_MULT = 2;

  // Orbit’ler için AU tabanlı sıkıştırma
  const AU_SCALE = 25; // 1 AU sahnede kaç unit
  const ORBIT_OFFSET = 14; // Güneş’ten minimum offset

  const orbitR = (au) => ORBIT_OFFSET + AU_SCALE * au;

  // Gerçek AU değerleri
  const AU_MERCURY = 0.39;
  const AU_VENUS = 0.72;
  const AU_EARTH = 1.0;
  const AU_MARS = 1.52;
  const AU_JUPITER = 5.2;
  const AU_SATURN = 9.54;
  const AU_URANUS = 19.2;
  const AU_NEPTUNE = 30.1;
  const AU_PLUTO = 39.5;
  const AU_HAUMEA = 43.0;
  const AU_MAKEMAKE = 45.0;
  const AU_ERIS = 68.0;

  // ========= GEZEGEN BOYUTLARI =========

  const mercuryRadius = earthRadius * 0.38;
  const venusRadius = earthRadius * 0.95;
  const marsRadius = earthRadius * 0.53;

  const jupiterRadius = earthRadius * 11.2;
  const saturnRadius = earthRadius * 9.45;
  const uranusRadius = earthRadius * 4.0;
  const neptuneRadius = earthRadius * 3.9;

  const plutoRadius = earthRadius * 0.18 * DWARF_VISUAL_MULT;
  const haumeaRadius = earthRadius * 0.16 * DWARF_VISUAL_MULT;
  const makemakeRadius = earthRadius * 0.17 * DWARF_VISUAL_MULT;
  const erisRadius = earthRadius * 0.19 * DWARF_VISUAL_MULT;

  const moonRadius = earthRadius * 0.27;

  // Mars uyduları (boyut)
  const phobosRadius = marsRadius * 0.32;
  const deimosRadius = marsRadius * 0.38;

  // Jüpiter uyduları (boyut)
  const ioRadius = jupiterRadius * 0.24;
  const europaRadius = jupiterRadius * 0.22;
  const ganymedeRadius = jupiterRadius * 0.3;
  const callistoRadius = jupiterRadius * 0.28;

  const amaltheaRadius = jupiterRadius * 0.1;
  const thebeRadius = jupiterRadius * 0.09;
  const himaliaRadius = jupiterRadius * 0.1;
  const pasiphaeRadius = jupiterRadius * 0.09;
  const elaraRadius = jupiterRadius * 0.18;

  // Saturn uyduları (boyut)
  const mimasRadius = saturnRadius * 0.14;
  const enceladusRadius = saturnRadius * 0.16;
  const tethysRadius = saturnRadius * 0.18;
  const dioneRadius = saturnRadius * 0.2;
  const rheaRadius = saturnRadius * 0.22;
  const titanRadius = saturnRadius * 0.35;
  const iapetusRadius = saturnRadius * 0.24;

  // Uranus uyduları (boyut, sıkıştırılmış ölçek)
  const mirandaRadius = uranusRadius * 0.16;
  const arielRadius = uranusRadius * 0.18;
  const umbrielRadius = uranusRadius * 0.2;
  const titaniaRadius = uranusRadius * 0.24;
  const oberonRadius = uranusRadius * 0.22;

  // Neptune uyduları (boyut – görsel olarak güzel dursun)
  const proteusRadius = neptuneRadius * 0.18;
  const tritonRadius = neptuneRadius * 0.28;

  // ========= GEZEGEN ORBİTLERİ =========

  const mercuryOrbitRadius = orbitR(AU_MERCURY);
  const venusOrbitRadius = orbitR(AU_VENUS);
  const earthOrbitRadius = orbitR(AU_EARTH);
  const marsOrbitRadius = orbitR(AU_MARS);

  const jupiterOrbitRadius = orbitR(AU_JUPITER);
  const saturnOrbitRadius = orbitR(AU_SATURN);
  const uranusOrbitRadius = orbitR(AU_URANUS);
  const neptuneOrbitRadius = orbitR(AU_NEPTUNE);

  const plutoOrbitRadius = orbitR(AU_PLUTO);
  const haumeaOrbitRadius = orbitR(AU_HAUMEA);
  const makemakeOrbitRadius = orbitR(AU_MAKEMAKE);
  const erisOrbitRadius = orbitR(AU_ERIS);

  // Dünya sistemi
  const moonOrbitRadius = earthRadius * 6.5;

  // Mars uyduları – orbit
  const phobosOrbitRadius = marsRadius * 9.0;
  const deimosOrbitRadius = marsRadius * 20.5;

  // JÜPİTER UYDULARI – orbit
  const amaltheaOrbitRadius = jupiterRadius * 1.6;
  const thebeOrbitRadius = jupiterRadius * 2.2;
  const ioOrbitRadius = jupiterRadius * 3.0;
  const europaOrbitRadius = jupiterRadius * 4.0;
  const ganymedeOrbitRadius = jupiterRadius * 5.3;
  const himaliaOrbitRadius = jupiterRadius * 6.5;
  const elaraOrbitRadius = jupiterRadius * 7.5;
  const pasiphaeOrbitRadius = jupiterRadius * 8.7;
  const callistoOrbitRadius = jupiterRadius * 10.0;

  // SATURN UYDULARI – orbit
  const mimasOrbitRadius = saturnRadius * 3.0;
  const enceladusOrbitRadius = saturnRadius * 3.8;
  const tethysOrbitRadius = saturnRadius * 4.4;
  const dioneOrbitRadius = saturnRadius * 5.0;
  const rheaOrbitRadius = saturnRadius * 6.0;
  const titanOrbitRadius = saturnRadius * 7.8;
  const iapetusOrbitRadius = saturnRadius * 11.2;

  // URANUS UYDULARI – orbit
  const mirandaOrbitRadius = uranusRadius * 1.9;
  const arielOrbitRadius = uranusRadius * 2.5;
  const umbrielOrbitRadius = uranusRadius * 3.1;
  const titaniaOrbitRadius = uranusRadius * 3.8;
  const oberonOrbitRadius = uranusRadius * 4.5;

  // NEPTUNE UYDULARI – orbit
  const proteusOrbitRadius = neptuneRadius * 2.5;
  const tritonOrbitRadius = neptuneRadius * 4.2;

  // ========= ASTEROID & KUIPER BELT =========

  // ASTEROID BELT (Mars–Jupiter arası ~2.2–3.2 AU)
  const asteroidBeltInnerRadius = orbitR(2.2);
  const asteroidBeltOuterRadius = orbitR(3.2);
  const asteroidBeltOrbitRadius =
    (asteroidBeltInnerRadius + asteroidBeltOuterRadius) / 2;
  const asteroidBeltCameraRadius = 1;

  // KUIPER BELT (~30–50 AU)
  const kuiperBeltInnerRadius = orbitR(30);
  const kuiperBeltOuterRadius = orbitR(50);
  const kuiperBeltOrbitRadius =
    (kuiperBeltInnerRadius + kuiperBeltOuterRadius) / 2;
  const kuiperBeltCameraRadius = 8;

  const showLabelFor = (name) =>
    showLabels && (!focusedPlanetName || focusedPlanetName !== name);

  // İsim → ref + radius lookup (UI butonları için)
  const getPlanetDataByName = (name) => {
    switch (name) {
      case "Sun":
        return { ref: sunRef, radius: sunRadius };
      case "Mercury":
        return { ref: mercuryRef, radius: mercuryRadius };
      case "Venus":
        return { ref: venusRef, radius: venusRadius };
      case "Earth":
        return { ref: earthRef, radius: earthRadius };
      case "Moon":
        return { ref: moonRef, radius: moonRadius };
      case "Mars":
        return { ref: marsRef, radius: marsRadius };

      // Mars moons
      case "Phobos":
        return { ref: phobosRef, radius: phobosRadius };
      case "Deimos":
        return { ref: deimosRef, radius: deimosRadius };

      case "Jupiter":
        return { ref: jupiterRef, radius: jupiterRadius };
      case "Saturn":
        return { ref: saturnRef, radius: saturnRadius };
      case "Uranus":
        return { ref: uranusRef, radius: uranusRadius };
      case "Neptune":
        return { ref: neptuneRef, radius: neptuneRadius };

      case "Pluto":
        return { ref: plutoRef, radius: plutoRadius };

      case "Haumea":
        return { ref: haumeaRef, radius: haumeaRadius };

      case "Makemake":
        return { ref: makemakeRef, radius: makemakeRadius };
      case "Eris":
        return { ref: erisRef, radius: erisRadius };

      // Jupiter moons
      case "Europa":
        return { ref: europaRef, radius: europaRadius };
      case "Elara":
        return { ref: elaraRef, radius: elaraRadius };
      case "Io":
        return { ref: ioRef, radius: ioRadius };
      case "Ganymede":
        return { ref: ganymedeRef, radius: ganymedeRadius };
      case "Callisto":
        return { ref: callistoRef, radius: callistoRadius };
      case "Amalthea":
        return { ref: amaltheaRef, radius: amaltheaRadius };
      case "Himalia":
        return { ref: himaliaRef, radius: himaliaRadius };
      case "Pasiphae":
        return { ref: pasiphaeRef, radius: pasiphaeRadius };
      case "Thebe":
        return { ref: thebeRef, radius: thebeRadius };

      // Saturn moons
      case "Titan":
        return { ref: titanRef, radius: titanRadius };
      case "Rhea":
        return { ref: rheaRef, radius: rheaRadius };
      case "Dione":
        return { ref: dioneRef, radius: dioneRadius };
      case "Tethys":
        return { ref: tethysRef, radius: tethysRadius };
      case "Enceladus":
        return { ref: enceladusRef, radius: enceladusRadius };
      case "Mimas":
        return { ref: mimasRef, radius: mimasRadius };
      case "Iapetus":
        return { ref: iapetusRef, radius: iapetusRadius };

      // Uranus moons
      case "Miranda":
        return { ref: mirandaRef, radius: mirandaRadius };
      case "Ariel":
        return { ref: arielRef, radius: arielRadius };
      case "Umbriel":
        return { ref: umbrielRef, radius: umbrielRadius };
      case "Titania":
        return { ref: titaniaRef, radius: titaniaRadius };
      case "Oberon":
        return { ref: oberonRef, radius: oberonRadius };

      // Neptune moons
      case "Proteus":
        return { ref: proteusRef, radius: proteusRadius };
      case "Triton":
        return { ref: tritonRef, radius: tritonRadius };

      // Asteroid Belt (görünmez focus noktası)
      case "Asteroid Belt":
        return { ref: asteroidBeltFocusRef, radius: asteroidBeltCameraRadius };

      case "Kuiper Belt":
        return { ref: kuiperBeltFocusRef, radius: kuiperBeltCameraRadius };

      default:
        return null;
    }
  };

  // Ortak focus fonksiyonu (SpaceInfoPanel butonları için)
  const focusPlanetByName = useCallback(
    (name) => {
      if (!onPlanetLabelClick) return;
      const data = getPlanetDataByName(name);
      if (!data || !data.ref.current) return;

      const wp = new THREE.Vector3();
      data.ref.current.getWorldPosition(wp);

      onPlanetLabelClick(name, [wp.x, wp.y, wp.z], data.radius);
    },
    [onPlanetLabelClick]
  );

  // API’yi App’e register et (UI butonları buradan geliyor)
  useEffect(() => {
    if (onRegisterPlanetFocusApi) {
      onRegisterPlanetFocusApi(focusPlanetByName);
    }
  }, [onRegisterPlanetFocusApi, focusPlanetByName]);

  // Label click → planets için SolarSystem pipeline
  const handleLabelClick = (e, name) => {
    e.stopPropagation();
    focusPlanetByName(name);
  };

  const marsMoons = [
    {
      name: "Phobos",
      ref: phobosRef,
      radius: phobosRadius,
      orbitRadius: phobosOrbitRadius,
      texture: phobosTex,
      plane: "equatorial",
      orbitSpeed: 1.7,
      spinSpeed: 1.0,
      ringColor: "#ffae7f",
      ringWidth: 0.012,
      labelOffset: 0.45,
    },
    {
      name: "Deimos",
      ref: deimosRef,
      radius: deimosRadius,
      orbitRadius: deimosOrbitRadius,
      texture: deimosTex,
      plane: "tilted",
      tiltDeg: 97,
      orbitSpeed: 1.4,
      spinSpeed: 0.9,
      ringColor: "#ffcba3",
      ringWidth: 0.012,
      labelOffset: 0.4,
    },
  ];

  const jupiterMoons = [
    {
      name: "Amalthea",
      ref: amaltheaRef,
      radius: amaltheaRadius,
      orbitRadius: amaltheaOrbitRadius,
      texture: amaltheaTex,
      plane: "equatorial",
      orbitSpeed: 1.9,
      spinSpeed: 1.2,
      ringColor: "#ffb3a3",
      ringWidth: 0.012,
    },
    {
      name: "Thebe",
      ref: thebeRef,
      radius: thebeRadius,
      orbitRadius: thebeOrbitRadius,
      texture: thebeTex,
      plane: "equatorial",
      orbitSpeed: 1.8,
      spinSpeed: 1.1,
      ringColor: "#aaaaaa",
      ringWidth: 0.012,
    },
    {
      name: "Io",
      ref: ioRef,
      radius: ioRadius,
      orbitRadius: ioOrbitRadius,
      texture: ioTex,
      plane: "equatorial",
      orbitSpeed: 1.6,
      spinSpeed: 1.4,
      ringColor: "#ffd27f",
      ringWidth: 0.015,
    },
    {
      name: "Europa",
      ref: europaRef,
      radius: europaRadius,
      orbitRadius: europaOrbitRadius,
      texture: europaTex,
      plane: "equatorial",
      orbitSpeed: 1.3,
      spinSpeed: 1.35,
      ringColor: "#ccccff",
      ringWidth: 0.018,
    },
    {
      name: "Ganymede",
      ref: ganymedeRef,
      radius: ganymedeRadius,
      orbitRadius: ganymedeOrbitRadius,
      texture: ganymedeTex,
      plane: "equatorial",
      orbitSpeed: 1.1,
      spinSpeed: 1.3,
      ringColor: "#d6c7b0",
      ringWidth: 0.02,
    },
    {
      name: "Callisto",
      ref: callistoRef,
      radius: callistoRadius,
      orbitRadius: callistoOrbitRadius,
      texture: callistoTex,
      plane: "equatorial",
      orbitSpeed: 0.9,
      spinSpeed: 1.2,
      ringColor: "#b0b0b0",
      ringWidth: 0.022,
    },
    {
      name: "Himalia",
      ref: himaliaRef,
      radius: himaliaRadius,
      orbitRadius: himaliaOrbitRadius,
      texture: himaliaTex,
      plane: "tilted",
      tiltDeg: 27,
      orbitSpeed: 0.6,
      spinSpeed: 0.9,
      ringColor: "#9ad1ff",
      ringWidth: 0.025,
    },
    {
      name: "Elara",
      ref: elaraRef,
      radius: elaraRadius,
      orbitRadius: elaraOrbitRadius,
      texture: elaraTex,
      plane: "tilted",
      tiltDeg: 26,
      orbitSpeed: 0.55,
      spinSpeed: 0.9,
      ringColor: "#ffddaa",
      ringWidth: 0.025,
    },
    {
      name: "Pasiphae",
      ref: pasiphaeRef,
      radius: pasiphaeRadius,
      orbitRadius: pasiphaeOrbitRadius,
      texture: pasiphaeTex,
      plane: "tilted",
      tiltDeg: 150,
      orbitSpeed: -0.5,
      spinSpeed: 0.8,
      ringColor: "#c0c0ff",
      ringWidth: 0.03,
    },
  ];

  const saturnMoons = [
    {
      name: "Mimas",
      ref: mimasRef,
      radius: mimasRadius,
      orbitRadius: mimasOrbitRadius,
      texture: mimasTex,
      plane: "equatorial",
      orbitSpeed: 1.8,
      spinSpeed: 1.0,
      ringColor: "#bbbbbb",
      ringWidth: 0.012,
    },
    {
      name: "Enceladus",
      ref: enceladusRef,
      radius: enceladusRadius,
      orbitRadius: enceladusOrbitRadius,
      texture: enceladusTex,
      plane: "equatorial",
      orbitSpeed: 1.6,
      spinSpeed: 1.1,
      ringColor: "#d7f2ff",
      ringWidth: 0.014,
    },
    {
      name: "Tethys",
      ref: tethysRef,
      radius: tethysRadius,
      orbitRadius: tethysOrbitRadius,
      texture: tethysTex,
      plane: "equatorial",
      orbitSpeed: 1.4,
      spinSpeed: 1.1,
      ringColor: "#cccccc",
      ringWidth: 0.016,
    },
    {
      name: "Dione",
      ref: dioneRef,
      radius: dioneRadius,
      orbitRadius: dioneOrbitRadius,
      texture: dioneTex,
      plane: "equatorial",
      orbitSpeed: 1.2,
      spinSpeed: 1.1,
      ringColor: "#c0c0c0",
      ringWidth: 0.018,
    },
    {
      name: "Rhea",
      ref: rheaRef,
      radius: rheaRadius,
      orbitRadius: rheaOrbitRadius,
      texture: rheaTex,
      plane: "equatorial",
      orbitSpeed: 1.0,
      spinSpeed: 1.1,
      ringColor: "#d0d0d0",
      ringWidth: 0.02,
    },
    {
      name: "Titan",
      ref: titanRef,
      radius: titanRadius,
      orbitRadius: titanOrbitRadius,
      texture: titanSurfaceTex,
      cloudTexture: titanCloudsTex,
      cloudScale: 1.035,
      plane: "equatorial",
      orbitSpeed: 0.8,
      spinSpeed: 1.15,
      ringColor: "#e3b36b",
      ringWidth: 0.022,
    },
    {
      name: "Iapetus",
      ref: iapetusRef,
      radius: iapetusRadius,
      orbitRadius: iapetusOrbitRadius,
      texture: iapetusTex,
      plane: "tilted",
      tiltDeg: 15,
      orbitSpeed: 0.5,
      spinSpeed: 0.9,
      ringColor: "#aaaaaa",
      ringWidth: 0.026,
    },
  ];

  const uranusMoons = [
    {
      name: "Miranda",
      ref: mirandaRef,
      radius: mirandaRadius,
      orbitRadius: mirandaOrbitRadius,
      texture: mirandaTex,
      plane: "tilted",
      tiltDeg: 22,
      orbitSpeed: 1.7,
      spinSpeed: 1.1,
      ringColor: "#dbeaff",
      ringWidth: 0.014,
    },
    {
      name: "Ariel",
      ref: arielRef,
      radius: arielRadius,
      orbitRadius: arielOrbitRadius,
      texture: arielTex,
      plane: "equatorial",
      orbitSpeed: 1.5,
      spinSpeed: 1.1,
      ringColor: "#c8e6ff",
      ringWidth: 0.014,
    },
    {
      name: "Umbriel",
      ref: umbrielRef,
      radius: umbrielRadius,
      orbitRadius: umbrielOrbitRadius,
      texture: umbrielTex,
      plane: "equatorial",
      orbitSpeed: 1.3,
      spinSpeed: 1.05,
      ringColor: "#b0c5ff",
      ringWidth: 0.015,
    },
    {
      name: "Titania",
      ref: titaniaRef,
      radius: titaniaRadius,
      orbitRadius: titaniaOrbitRadius,
      texture: titaniaTex,
      plane: "equatorial",
      orbitSpeed: 1.1,
      spinSpeed: 1.1,
      ringColor: "#9fb7ff",
      ringWidth: 0.017,
    },
    {
      name: "Oberon",
      ref: oberonRef,
      radius: oberonRadius,
      orbitRadius: oberonOrbitRadius,
      texture: oberonTex,
      plane: "equatorial",
      orbitSpeed: 0.9,
      spinSpeed: 1.0,
      ringColor: "#8aa4ff",
      ringWidth: 0.018,
    },
  ];

  const neptuneMoons = [
    {
      name: "Proteus",
      ref: proteusRef,
      radius: proteusRadius,
      orbitRadius: proteusOrbitRadius,
      texture: proteusTex,
      plane: "equatorial",
      orbitSpeed: 1.6,
      spinSpeed: 1.0,
      ringColor: "#c6c6c6",
      ringWidth: 0.015,
      labelOffset: 0.55,
    },
    {
      name: "Triton",
      ref: tritonRef,
      radius: tritonRadius,
      orbitRadius: tritonOrbitRadius,
      texture: tritonTex,
      plane: "tilted",
      tiltDeg: 23,
      orbitSpeed: 0.9,
      spinSpeed: 1.1,
      ringColor: "#dde7ff",
      ringWidth: 0.02,
      labelOffset: 0.6,
    },
  ];

  return (
    <group>
      {/* SUN */}
      <group ref={sunGroupRef} position={[0, 0, 0]}>
        <mesh ref={sunRef}>
          <sphereGeometry args={[sunRadius, 128, 128]} />
          <meshBasicMaterial map={sunTex} />
        </mesh>

        {showLabelFor("Sun") && (
          <Html distanceFactor={15} position={[0, sunRadius + 1.6, 0]}>
            <div
              className="px-4 py-1 rounded bg-black/70 text-white border border-orange-400/60"
              style={{ fontSize: `${1.8 * labelScale}rem`, cursor: "pointer" }}
              onClick={(e) => handleLabelClick(e, "Sun")}
            >
              Sun
            </div>
          </Html>
        )}
      </group>

      {/* ORBIT RINGS */}
      {[
        { r: mercuryOrbitRadius, color: "#888888", w: 0.02 },
        { r: venusOrbitRadius, color: "#ffaa88", w: 0.02 },
        { r: earthOrbitRadius, color: "#22c1ff", w: 0.025 },
        { r: marsOrbitRadius, color: "#ff6644", w: 0.02 },
        { r: jupiterOrbitRadius, color: "#ffaa55", w: 0.03 },
        { r: saturnOrbitRadius, color: "#ffdd88", w: 0.03 },
        { r: uranusOrbitRadius, color: "#66ddff", w: 0.03 },
        { r: neptuneOrbitRadius, color: "#4a7bff", w: 0.03 },
      ].map(({ r, color, w }, i) => (
        <mesh key={i} position={[0, 0, 0]} rotation-x={Math.PI / 2}>
          <ringGeometry args={[r - w, r + w, 128]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.28}
          />
        </mesh>
      ))}

      {/* ASTEROID BELT – Mars ile Jupiter arasında */}
      <group
        ref={asteroidBeltFocusRef}
        position={[asteroidBeltOrbitRadius, 0, 0]}
      >
        <mesh visible={false}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      <AsteroidBelt
        innerRadius={asteroidBeltInnerRadius}
        outerRadius={asteroidBeltOuterRadius}
        tiltDeg={1.8}
        count={1600}
        spinSpeed={0.01}
        minScale={0.12}
        maxScale={0.3}
        opacity={0.95}
        asteroidTexture={asteroidTex}
      />

      {/* KUIPER BELT */}
      <group ref={kuiperBeltFocusRef} position={[kuiperBeltOrbitRadius, 0, 0]}>
        <mesh visible={false}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      <AsteroidBelt
        innerRadius={kuiperBeltInnerRadius}
        outerRadius={kuiperBeltOuterRadius}
        tiltDeg={2.5}
        count={3000}
        spinSpeed={0.004}
        minScale={1.18}
        maxScale={1.55}
        opacity={0.8}
        asteroidTexture={asteroidTex}
      />

      {/* MERCURY */}
      <group ref={mercuryGroupRef}>
        <mesh ref={mercuryRef} position={[mercuryOrbitRadius, 0, 0]}>
          <sphereGeometry args={[mercuryRadius, 96, 96]} />
          <meshStandardMaterial
            map={mercuryTex}
            roughness={0.7}
            metalness={0.2}
          />
          {showLabelFor("Mercury") && (
            <Html distanceFactor={10} position={[0, mercuryRadius + 0.8, 0]}>
              <div
                className="px-2 py-1 rounded bg-black/70 text-white border border-white/30"
                style={{
                  fontSize: `${0.9 * labelScale}rem`,
                  cursor: "pointer",
                }}
                onClick={(e) => handleLabelClick(e, "Mercury")}
              >
                Mercury
              </div>
            </Html>
          )}
        </mesh>
      </group>

      {/* VENUS */}
      <group ref={venusGroupRef}>
        <mesh ref={venusRef} position={[venusOrbitRadius, 0, 0]}>
          <sphereGeometry args={[venusRadius, 96, 96]} />
          <meshStandardMaterial
            map={venusSurfaceTex}
            roughness={0.6}
            metalness={0.25}
          />

          <mesh ref={venusCloudsRef}>
            <sphereGeometry args={[venusRadius * 1.02, 64, 64]} />
            <meshStandardMaterial
              map={venusAtmoTex}
              transparent
              opacity={0.6}
              depthWrite={false}
            />
          </mesh>

          {showLabelFor("Venus") && (
            <Html distanceFactor={11} position={[0, venusRadius + 0.9, 0]}>
              <div
                className="px-2 py-1 rounded bg-black/70 text-white border border-white/30"
                style={{
                  fontSize: `${0.9 * labelScale}rem`,
                  cursor: "pointer",
                }}
                onClick={(e) => handleLabelClick(e, "Venus")}
              >
                Venus
              </div>
            </Html>
          )}
        </mesh>
      </group>

      {/* EARTH SYSTEM (Earth + Moon, Moon orbit 5° tiltli) */}
      <EarthSystem
        groupRef={earthGroupRef}
        earthRef={earthRef}
        cloudsRef={cloudsRef}
        moonGroupRef={moonGroupRef}
        moonRef={moonRef}
        earthRadius={earthRadius}
        earthOrbitRadius={earthOrbitRadius}
        moonRadius={moonRadius}
        moonOrbitRadius={moonOrbitRadius}
        earthDay={earthDay}
        earthClouds={earthClouds}
        moonTex={moonTex}
        labelScale={labelScale}
        showLabels={showLabels}
        focusedPlanetName={focusedPlanetName}
        onPlanetLabelClick={onPlanetLabelClick}
      />

      {/* MARS SYSTEM (Mars + Phobos + Deimos) */}
      <MarsSystem
        groupRef={marsGroupRef}
        planetRef={marsRef}
        marsRadius={marsRadius}
        marsOrbitRadius={marsOrbitRadius}
        marsTex={marsTex}
        labelScale={labelScale}
        showLabelMars={showLabelFor("Mars")}
        showLabels={showLabels}
        focusedPlanetName={focusedPlanetName}
        moons={marsMoons}
        onPlanetLabelClick={onPlanetLabelClick}
      />

      {/* JUPITER SYSTEM (Jupiter + tüm uydular) */}
      <JupiterSystem
        groupRef={jupiterGroupRef}
        planetRef={jupiterRef}
        jupiterRadius={jupiterRadius}
        jupiterOrbitRadius={jupiterOrbitRadius}
        jupiterTex={jupiterTex}
        labelScale={labelScale}
        showLabelJupiter={showLabelFor("Jupiter")}
        showLabels={showLabels}
        focusedPlanetName={focusedPlanetName}
        moons={jupiterMoons}
        onPlanetLabelClick={onPlanetLabelClick}
      />

      {/* SATURN SYSTEM (Saturn + rings + uydular) */}
      <SaturnSystem
        groupRef={saturnGroupRef}
        planetRef={saturnRef}
        ringRef={saturnRingRef}
        saturnRadius={saturnRadius}
        saturnOrbitRadius={saturnOrbitRadius}
        saturnTex={saturnTex}
        saturnRingTex={saturnRingTex}
        labelScale={labelScale}
        showLabelSaturn={showLabelFor("Saturn")}
        showLabels={showLabels}
        focusedPlanetName={focusedPlanetName}
        moons={saturnMoons}
        onPlanetLabelClick={onPlanetLabelClick}
      />

      {/* URANUS SYSTEM (Uranus + moons, Miranda hafif eğimli) */}
      <UranusSystem
        groupRef={uranusGroupRef}
        planetRef={uranusRef}
        uranusRadius={uranusRadius}
        uranusOrbitRadius={uranusOrbitRadius}
        uranusTex={uranusTex}
        labelScale={labelScale}
        showLabelUranus={showLabelFor("Uranus")}
        showLabels={showLabels}
        focusedPlanetName={focusedPlanetName}
        moons={uranusMoons}
        onPlanetLabelClick={onPlanetLabelClick}
      />

      {/* NEPTUNE SYSTEM (Neptune + Proteus + Triton) */}
      <NeptuneSystem
        groupRef={neptuneGroupRef}
        planetRef={neptuneRef}
        neptuneRadius={neptuneRadius}
        neptuneOrbitRadius={neptuneOrbitRadius}
        neptuneTex={neptuneTex}
        labelScale={labelScale}
        showLabelNeptune={showLabelFor("Neptune")}
        showLabels={showLabels}
        focusedPlanetName={focusedPlanetName}
        moons={neptuneMoons}
        onPlanetLabelClick={onPlanetLabelClick}
      />

      {/* PLUTO SYSTEM (dwarf planet, eğimli orbit) */}
      <PlutoSystem
        groupRef={plutoGroupRef}
        planetRef={plutoRef}
        plutoRadius={plutoRadius}
        plutoOrbitRadius={plutoOrbitRadius}
        plutoTex={plutoTex}
        labelScale={labelScale}
        showLabelPluto={showLabelFor("Pluto")}
        showLabels={showLabels}
        focusedPlanetName={focusedPlanetName}
        orbitTiltDeg={17}
        onPlanetLabelClick={onPlanetLabelClick}
      />

      {/* HAUMEA SYSTEM */}
      <HaumeaSystem
        groupRef={haumeaGroupRef}
        planetRef={haumeaRef}
        haumeaRadius={haumeaRadius}
        haumeaOrbitRadius={haumeaOrbitRadius}
        haumeaTex={haumeaTex}
        labelScale={labelScale}
        showLabelHaumea={showLabelFor("Haumea")}
        showLabels={showLabels}
        focusedPlanetName={focusedPlanetName}
        orbitTiltDeg={25}
        onPlanetLabelClick={onPlanetLabelClick}
      />

      {/* MAKEMAKE SYSTEM */}
      <MakemakeSystem
        groupRef={makemakeGroupRef}
        planetRef={makemakeRef}
        makemakeRadius={makemakeRadius}
        makemakeOrbitRadius={makemakeOrbitRadius}
        makemakeTex={makemakeTex}
        labelScale={labelScale}
        showLabelMakemake={showLabelFor("Makemake")}
        showLabels={showLabels}
        focusedPlanetName={focusedPlanetName}
        orbitTiltDeg={29}
        onPlanetLabelClick={onPlanetLabelClick}
      />

      {/* ERIS SYSTEM */}
      <ErisSystem
        groupRef={erisGroupRef}
        planetRef={erisRef}
        erisRadius={erisRadius}
        erisOrbitRadius={erisOrbitRadius}
        erisTex={erisTex}
        labelScale={labelScale}
        showLabelEris={showLabelFor("Eris")}
        showLabels={showLabels}
        focusedPlanetName={focusedPlanetName}
        orbitTiltDeg={44}
        onPlanetLabelClick={onPlanetLabelClick}
      />
    </group>
  );
}

export default SolarSystem;
