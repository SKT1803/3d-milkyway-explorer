import { Canvas } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import {
  Suspense,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import * as THREE from "three";

import { LoadingScreen } from "./components/loading-screen";

import { MilkyWay } from "./components/milky-way";
import { CameraControls } from "./components/camera-controls";
import { InnerSpace } from "./components/inner-space";
import { GalaxyShell } from "./components/galaxy-shell";
import { SunSpace } from "./components/sun-space";
import { SunPortal } from "./components/sun-portal";
import { SiriusPortal } from "./components/sirius-portal";
import { AlphaCentauriPortal } from "./components/alpha-centauri-portal";
import { SpaceInfoPanel } from "./components/space-info-panel";
import { GuidedTourControls } from "./components/guided-tour-controls";
import { GuidedTourInfoCard } from "./components/guided-tour-info-card";
import { GuidedTourDistance } from "./components/guided-tour-distance";
import { SiriusSpace } from "./components/sirius-space";
import { AlphaCentauriSpace } from "./components/alpha-centauri-space";
import { BetelgeusePortal } from "./components/betelgeuse-portal";
import { BetelgeuseSpace } from "./components/betelgeuse-space";
import { NaosPortal } from "./components/naos-portal";
import { NaosSpace } from "./components/naos-space";
import { AntaresPortal } from "./components/antares-portal";
import { AntaresSpace } from "./components/antares-space";
import { CapellaPortal } from "./components/capella-portal";
import { CapellaSpace } from "./components/capella-space";
import { CastorPortal } from "./components/castor-portal";
import { CastorSpace } from "./components/castor-space";
import { SagittariusPortal } from "./components/sagittarius-portal";
import { SagittariusSpace } from "./components/sagittarius-space";
import { Kepler22Portal } from "./components/kepler22-portal";
import { Kepler22Space } from "./components/kepler22-space";
import { VegaPortal } from "./components/vega-portal";
import { VegaSpace } from "./components/vega-space";

const FOCUS = {
  MILKY_WAY: "milkyWay",
  SUN: "sun",
  SIRIUS: "sirius",
  ALPHA: "alphaCentauri",
  BETELGEUSE: "betelgeuse",
  ANTARES: "antares",
  NAOS: "naos",
  CAPELLA: "capella",
  CASTOR: "castor",
  SAGITTARIUS: "sagittarius",
  KEPLER22: "kepler22",
  VEGA: "vega",
};

const MODE = {
  GALAXY: "galaxy",
  INNER: "inner",
};

const WARP_TARGET = {
  TO_GALAXY: "toGalaxy",
  TO_SUN: "toSun",
  TO_SIRIUS: "toSirius",
  TO_ALPHA: "toAlphaCentauri",
  TO_BETELGEUSE: "toBetelgeuse",
  TO_NAOS: "toNaos",
  TO_ANTARES: "toAntares",
  TO_CAPELLA: "toCapella",
  TO_CASTOR: "toCastor",
  TO_SAGITTARIUS: "toSagittarius",
  TO_KEPLER22: "toKepler22",
  TO_VEGA: "toVega",
  TO_INNER_GENERIC: "toInnerGeneric",
};

// Existing galaxy portals + original warp handlers; all systems use the same tour logic.
const TOUR_TRANSITIONS = {
  toSirius: {
    warp: WARP_TARGET.TO_SIRIUS,
    focus: FOCUS.SIRIUS,
    space: "sirius",
    overview: "siriusA",
    portal: [-0.6, 0.15, 1.5],
  },
  toAlpha: {
    warp: WARP_TARGET.TO_ALPHA,
    focus: FOCUS.ALPHA,
    space: "alphaCentauri",
    overview: "alphaA",
    portal: [-2, 0.15, 2],
  },
  toKepler: {
    warp: WARP_TARGET.TO_KEPLER22,
    focus: FOCUS.KEPLER22,
    space: "kepler22",
    overview: "keplerStar",
    portal: [-3.3, 0.15, -1],
  },
  toVega: {
    warp: WARP_TARGET.TO_VEGA,
    focus: FOCUS.VEGA,
    space: "vega",
    overview: "vega",
    portal: [1.6, 0.15, 1.35],
  },
  toBetelgeuse: {
    warp: WARP_TARGET.TO_BETELGEUSE,
    focus: FOCUS.BETELGEUSE,
    space: "betelgeuse",
    overview: "betelgeuse",
    portal: [3.45, 0.15, 0.65],
  },
  toNaos: {
    warp: WARP_TARGET.TO_NAOS,
    focus: FOCUS.NAOS,
    space: "naos",
    overview: "naos",
    portal: [3.2, 0.15, -1.35],
  },
  toAntares: {
    warp: WARP_TARGET.TO_ANTARES,
    focus: FOCUS.ANTARES,
    space: "antares",
    overview: "antaresA",
    portal: [-1.55, 0.15, -1.35],
  },
  toCapella: {
    warp: WARP_TARGET.TO_CAPELLA,
    focus: FOCUS.CAPELLA,
    space: "capella",
    overview: "capellaAa",
    portal: [2.2, 0.15, -2.0],
  },
  toCastor: {
    warp: WARP_TARGET.TO_CASTOR,
    focus: FOCUS.CASTOR,
    space: "castor",
    overview: "castorAa",
    portal: [0.9, 0.15, -2.6],
  },
  toSagittarius: {
    warp: WARP_TARGET.TO_SAGITTARIUS,
    focus: FOCUS.SAGITTARIUS,
    space: "sagittarius",
    overview: "sagittariusCore",
    portal: [0, 0, 0],
  },
};

// Every stop invokes the mounted System focus API; transitions use one camera flow.
const TOUR_STOPS = {
  sun: { space: "sun", name: "Sun", next: "mercury" },
  mercury: { space: "sun", name: "Mercury", next: "venus" },
  venus: { space: "sun", name: "Venus", next: "earth" },
  earth: { space: "sun", name: "Earth", next: "moon" },
  moon: { space: "sun", name: "Moon", next: "mars" },
  mars: { space: "sun", name: "Mars", next: "jupiter" },
  jupiter: { space: "sun", name: "Jupiter", next: "saturn" },
  saturn: { space: "sun", name: "Saturn", next: "uranus" },
  uranus: { space: "sun", name: "Uranus", next: "neptune" },
  neptune: { space: "sun", name: "Neptune", next: "toSirius" },
  siriusA: { space: "sirius", name: "Sirius A", next: "siriusB" },
  siriusB: { space: "sirius", name: "Sirius B", next: "toAlpha" },
  alphaA: { space: "alphaCentauri", name: "Rigil Kentaurus", next: "alphaB" },
  alphaB: { space: "alphaCentauri", name: "Toliman", next: "alphaProxima" },
  alphaProxima: {
    space: "alphaCentauri",
    name: "Proxima Centauri",
    next: "toKepler",
  },
  keplerStar: { space: "kepler22", name: "Kepler-22", next: "keplerPlanet" },
  keplerPlanet: { space: "kepler22", name: "Kepler-22b", next: "toVega" },
  vega: { space: "vega", name: "Vega", next: "toBetelgeuse" },
  betelgeuse: { space: "betelgeuse", name: "Betelgeuse", next: "toNaos" },
  naos: { space: "naos", name: "Naos", next: "toAntares" },
  antaresA: { space: "antares", name: "Antares A", next: "antaresB" },
  antaresB: { space: "antares", name: "Antares B", next: "toCapella" },
  capellaAa: { space: "capella", name: "Capella Aa", next: "capellaAb" },
  capellaAb: { space: "capella", name: "Capella Ab", next: "capellaH" },
  capellaH: { space: "capella", name: "Capella H", next: "capellaL" },
  capellaL: { space: "capella", name: "Capella L", next: "toCastor" },
  castorAa: { space: "castor", name: "Castor Aa", next: "castorAb" },
  castorAb: { space: "castor", name: "Castor Ab", next: "castorBa" },
  castorBa: { space: "castor", name: "Castor Ba", next: "castorBb" },
  castorBb: { space: "castor", name: "Castor Bb", next: "castorCa" },
  castorCa: { space: "castor", name: "YY Gem A (Ca)", next: "castorCb" },
  castorCb: { space: "castor", name: "YY Gem B (Cb)", next: "toSagittarius" },
  sagittariusCore: {
    space: "sagittarius",
    name: "Sagittarius A*",
    next: "complete",
  },
};

function GuidedTourGalaxySceneReady({ visible, onReady }) {
  useLayoutEffect(() => {
    if (visible) onReady();
  }, [visible, onReady]);
  return null;
}

export default function App() {
  const [galaxyParams] = useState({
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 4,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  });

  const [isMilkyWayReady, setIsMilkyWayReady] = useState(false);

  const [mode, setMode] = useState(MODE.GALAXY);
  const [focus, setFocus] = useState(FOCUS.MILKY_WAY);
  const [activeInnerSpace, setActiveInnerSpace] = useState(null); // "sun" | "sirius" | "alphaCentauri" | null
  const [warpTarget, setWarpTarget] = useState(null);
  const [isBackAnimating, setIsBackAnimating] = useState(false);

  const [focusedPlanet, setFocusedPlanet] = useState(null);
  const focusedDistanceRef = useRef(null);

  const [showGalaxyRegions, setShowGalaxyRegions] = useState(false);

  const cameraRef = useRef(null);
  const lastCamPosRef = useRef(new THREE.Vector3());
  const lastCamTargetRef = useRef(new THREE.Vector3());

  const planetFocusApiRef = useRef(null);

  const backProgressRef = useRef(0);
  const isBackAnimatingRef = useRef(false);

  // Guided Tour: the existing galactic transition, followed by a Solar System fly-through.
  // Refs invalidate stale camera callbacks when a tour is exited or a stop is skipped.
  const tourRunIdRef = useRef(0);
  const tourBodyRef = useRef(null);
  const tourBodyStartedRef = useRef(null);
  const tourTravelStartedRef = useRef(null);
  // Pending galaxy flight is started only AFTER the R3F scene switch commits.
  const pendingGalaxyTourFlightRef = useRef(null);
  // Shared with the ordinary Back to Milky Way button. The camera must not
  // jump to galaxy coordinates until the previous inner scene has unmounted.
  const pendingManualGalaxyResetRef = useRef(false);
  const [tourPlanetFocusReady, setTourPlanetFocusReady] = useState(false);
  const [tourPhase, setTourPhase] = useState("idle");
  const [tourPaused, setTourPaused] = useState(false);
  const tourActive = tourPhase !== "idle" && tourPhase !== "complete";
  const tourCameraLocked = tourActive && tourPhase !== "complete";

  const shellRadius = galaxyParams.radius * 1.05;
  const shellHalfHeight = galaxyParams.radius * 0.2;

  const ENTER_DIST = shellRadius * 0.96;
  const EXIT_DIST = shellRadius * 1.04;

  const GALAXY_CAM = {
    position: [0, 3, 10],
    target: [0, 0, 0],
  };

  const INNER_GENERIC_CAM = {
    position: [0, 10, 3000],
    target: [0, 0, 0],
  };

  const SUN_CAM = {
    position: [0, 0, 5000],
    target: [0, 0, 0],
  };

  const SIRIUS_CAM = {
    position: [0, 60, 3000],
    target: [0, 0, 0],
  };

  const ALPHA_CAM = {
    position: [0, 70, 5000],
    target: [0, 0, 0],
  };

  const BETELGEUSE_CAM = {
    position: [0, 40, 5000],
    target: [0, 0, 0],
  };

  const NAOS_CAM = {
    position: [0, 55, 5000],
    target: [0, 0, 0],
  };

  const ANTARES_CAM = {
    position: [0, 60, 5000],
    target: [0, 0, 0],
  };

  const CAPELLA_CAM = {
    position: [0, 60, 5000],
    target: [0, 0, 0],
  };

  const CASTOR_CAM = {
    position: [0, 60, 5000],
    target: [0, 0, 0],
  };

  const SAGITTARIUS_CAM = {
    position: [0, 55, 5000],
    target: [0, 0, 0],
  };

  const KEPLER22_CAM = {
    position: [0, 0, 5000],
    target: [0, 0, 0],
  };

  const VEGA_CAM = {
    position: [0, 55, 4200],
    target: [0, 0, 0],
  };

  useLayoutEffect(() => {
    if (!warpTarget || !cameraRef.current) return;

    if (warpTarget === WARP_TARGET.TO_SUN) {
      setMode(MODE.INNER);
      setActiveInnerSpace("sun");
      cameraRef.current.setPositionAndTarget(SUN_CAM.position, SUN_CAM.target);
    } else if (warpTarget === WARP_TARGET.TO_SIRIUS) {
      setMode(MODE.INNER);
      setActiveInnerSpace("sirius");
      cameraRef.current.setPositionAndTarget(
        SIRIUS_CAM.position,
        SIRIUS_CAM.target,
      );
    } else if (warpTarget === WARP_TARGET.TO_ALPHA) {
      setMode(MODE.INNER);
      setActiveInnerSpace("alphaCentauri");
      cameraRef.current.setPositionAndTarget(
        ALPHA_CAM.position,
        ALPHA_CAM.target,
      );
    } else if (warpTarget === WARP_TARGET.TO_BETELGEUSE) {
      setMode(MODE.INNER);
      setActiveInnerSpace("betelgeuse");
      cameraRef.current.setPositionAndTarget(
        BETELGEUSE_CAM.position,
        BETELGEUSE_CAM.target,
      );
    } else if (warpTarget === WARP_TARGET.TO_NAOS) {
      setMode(MODE.INNER);
      setActiveInnerSpace("naos");
      cameraRef.current.setPositionAndTarget(
        NAOS_CAM.position,
        NAOS_CAM.target,
      );
    } else if (warpTarget === WARP_TARGET.TO_ANTARES) {
      setMode(MODE.INNER);
      setActiveInnerSpace("antares");
      cameraRef.current.setPositionAndTarget(
        ANTARES_CAM.position,
        ANTARES_CAM.target,
      );
    } else if (warpTarget === WARP_TARGET.TO_CAPELLA) {
      setMode(MODE.INNER);
      setActiveInnerSpace("capella");
      cameraRef.current.setPositionAndTarget(
        CAPELLA_CAM.position,
        CAPELLA_CAM.target,
      );
    } else if (warpTarget === WARP_TARGET.TO_CASTOR) {
      setMode(MODE.INNER);
      setActiveInnerSpace("castor");
      cameraRef.current.setPositionAndTarget(
        CASTOR_CAM.position,
        CASTOR_CAM.target,
      );
    } else if (warpTarget === WARP_TARGET.TO_SAGITTARIUS) {
      setMode(MODE.INNER);
      setActiveInnerSpace("sagittarius");
      cameraRef.current.setPositionAndTarget(
        SAGITTARIUS_CAM.position,
        SAGITTARIUS_CAM.target,
      );
    } else if (warpTarget === WARP_TARGET.TO_KEPLER22) {
      setMode(MODE.INNER);
      setActiveInnerSpace("kepler22");
      cameraRef.current.setPositionAndTarget(
        KEPLER22_CAM.position,
        KEPLER22_CAM.target,
      );
    } else if (warpTarget === WARP_TARGET.TO_VEGA) {
      setMode(MODE.INNER);
      setActiveInnerSpace("vega");
      cameraRef.current.setPositionAndTarget(
        VEGA_CAM.position,
        VEGA_CAM.target,
      );
    } else if (warpTarget === WARP_TARGET.TO_INNER_GENERIC) {
      setMode(MODE.INNER);
      setActiveInnerSpace(null);
      cameraRef.current.setPositionAndTarget(
        INNER_GENERIC_CAM.position,
        INNER_GENERIC_CAM.target,
      );
    }

    setWarpTarget(null);
  }, [warpTarget]);

  const handlePlanetLabelClick = useCallback((name, worldPosArray, radius) => {
    if (!cameraRef.current) return;

    // Only while the automated tour is visiting this body: use a longer,
    // eased approach followed by an orbit. Regular label clicks are unchanged.
    const tourStop = tourBodyRef.current;
    if (tourStop?.name === name && tourStop.runId === tourRunIdRef.current) {
      tourStop.focusStarted = true; // Scene confirmed the target's world coordinates.
      const target = new THREE.Vector3(...worldPosArray);
      const direction =
        target.lengthSq() < 1e-5
          ? new THREE.Vector3(0.7, 0.18, 1).normalize()
          : target.clone().normalize();
      const distance =
        name === "Sun" ? 48 : Math.min(Math.max(radius * 7.5, 3.8), 1150);
      const cameraPosition = target
        .clone()
        .addScaledVector(direction, distance);
      cameraPosition.y += distance * 0.14;

      setFocusedPlanet(name); // Existing SolarSystem stops this body's orbital revolution.
      focusedDistanceRef.current = distance;
      cameraRef.current.animateTo(
        cameraPosition.toArray(),
        target.toArray(),
        3.8,
        () => {
          if (
            tourRunIdRef.current !== tourStop.runId ||
            tourBodyRef.current !== tourStop
          )
            return;
          cameraRef.current?.orbitAroundTarget?.(6.5, 0.78, () => {
            if (
              tourRunIdRef.current !== tourStop.runId ||
              tourBodyRef.current !== tourStop
            )
              return;
            tourStop.onFinished();
          });
        },
        "smooth",
      );
      return;
    }

    const worldPos = new THREE.Vector3(
      worldPosArray[0],
      worldPosArray[1],
      worldPosArray[2],
    );

    const dir = worldPos.clone().normalize();

    let distanceFromBody = radius * 7;
    let extraY = radius * 0.5;

    // =========================
    // VOYAGER (free model)
    // =========================
    if (name === "Voyager 1") {
      distanceFromBody = Math.max(radius * 2, 2);
      extraY = Math.max(radius * -2, 0);

      const target = worldPos.clone();
      const camPos = worldPos.clone().add(dir.multiplyScalar(distanceFromBody));

      cameraRef.current.animateTo(
        [camPos.x, camPos.y + extraY, camPos.z],
        [target.x, target.y, target.z],
        1.2,
      );

      setFocusedPlanet(name);
      focusedDistanceRef.current = distanceFromBody;
      return;
    }

    // =========================
    // ISS (orbit model, very small)
    // =========================
    if (name === "ISS") {
      distanceFromBody = Math.max(radius * 1, -2);
      extraY = Math.max(radius * -2, 0);

      const target = worldPos.clone();
      const camPos = worldPos.clone().add(dir.multiplyScalar(distanceFromBody));

      cameraRef.current.animateTo(
        [camPos.x, camPos.y + extraY, camPos.z],
        [target.x, target.y, target.z],
        1.2,
      );

      setFocusedPlanet(name);
      focusedDistanceRef.current = distanceFromBody;
      return;
    }

    if (name === "New Horizons") {
      distanceFromBody = Math.max(radius * 1, -10);
      extraY = Math.max(radius * -2, 0);

      const target = worldPos.clone();
      const camPos = worldPos.clone().add(dir.multiplyScalar(distanceFromBody));

      cameraRef.current.animateTo(
        [camPos.x, camPos.y + extraY, camPos.z],
        [target.x, target.y, target.z],
        1.2,
      );

      setFocusedPlanet(name);
      focusedDistanceRef.current = distanceFromBody;
      return;
    }

    if (name === "Hubble") {
      distanceFromBody = Math.max(radius * 1, -4);
      extraY = Math.max(radius * -2, 0);

      const target = worldPos.clone();
      const camPos = worldPos.clone().add(dir.multiplyScalar(distanceFromBody));

      cameraRef.current.animateTo(
        [camPos.x, camPos.y + extraY, camPos.z],
        [target.x, target.y, target.z],
        1.2,
      );

      setFocusedPlanet(name);
      focusedDistanceRef.current = distanceFromBody;
      return;
    }

    // =========================
    // ASTEROID BELT
    // =========================
    if (name === "Asteroid Belt") {
      distanceFromBody = radius * 9;
      extraY = 4;

      const target = new THREE.Vector3(0, 0, 0);
      const camPos = worldPos.clone().add(dir.multiplyScalar(distanceFromBody));

      cameraRef.current.animateTo(
        [camPos.x, camPos.y + extraY, camPos.z],
        [target.x, target.y, target.z],
        1.2,
      );

      setFocusedPlanet(name);
      focusedDistanceRef.current = distanceFromBody;
      return;
    }

    // =========================
    // KUIPER BELT
    // =========================
    if (name === "Kuiper Belt") {
      distanceFromBody = radius * 9;
      extraY = 50;

      const target = new THREE.Vector3(0, 0, 0);
      const camPos = worldPos.clone().add(dir.multiplyScalar(distanceFromBody));

      cameraRef.current.animateTo(
        [camPos.x, camPos.y + extraY, camPos.z],
        [target.x, target.y, target.z],
        1.2,
      );

      setFocusedPlanet(name);
      focusedDistanceRef.current = distanceFromBody;
      return;
    }

    if (name === "Sagittarius A*") {
      const target = worldPos.clone();

      // BH origin'de olduğu için normalize kullanma
      const dir = new THREE.Vector3(0, 0, 1); // "karşıdan" (senin sahnede +Z)

      // 360 vs çok küçük kalıyor, modelin içine giriyorsun
      distanceFromBody = 600; // istersen 3500-7000 arası oyna
      extraY = 20; // tam karşıdan istiyorsan 0

      const camPos = target.clone().add(dir.multiplyScalar(distanceFromBody));

      cameraRef.current.animateTo(
        [camPos.x, camPos.y + extraY, camPos.z],
        [target.x, target.y, target.z],
        1.2,
      );

      setFocusedPlanet(name);
      focusedDistanceRef.current = distanceFromBody;
      return;
    }

    // =========================
    // SUN (origin'de olduğu için özel kamera açısı)
    // =========================
    if (name === "Sun" || name === "Kepler-22") {
      const target = worldPos.clone(); // (0,0,0)

      // origin'de normalize yok. Sabit bir "cinematic" yön seçiyoruz
      // İstersen yönü değiştir: (1, 0.35, 1) daha diagonal, (0, 0.6, 1) daha üstten
      const dir = new THREE.Vector3(0, 0, 1).normalize();

      // Sun radius=10 => radius*7=70 çok yakın kalabilir; biraz daha “hero shot”
      // const distanceFromBody = Math.max(radius * 3, 20); // 220-600 arası oynamak güzel
      // const extraY = Math.max(radius * 1, 2);

      distanceFromBody = 30; // istersen 3500-7000 arası oyna
      extraY = 5;

      const camPos = target.clone().add(dir.multiplyScalar(distanceFromBody));

      cameraRef.current.animateTo(
        [camPos.x, camPos.y + extraY, camPos.z],
        [target.x, target.y, target.z],
        1.2,
      );

      setFocusedPlanet(name);
      focusedDistanceRef.current = distanceFromBody;
      return;
    }

    // =========================
    // DEFAULT (planets & moons)
    // =========================
    const target = worldPos.clone();
    const camPos = worldPos.clone().add(dir.multiplyScalar(distanceFromBody));

    cameraRef.current.animateTo(
      [camPos.x, camPos.y + extraY, camPos.z],
      [target.x, target.y, target.z],
      1.2,
    );

    setFocusedPlanet(name);
    focusedDistanceRef.current = distanceFromBody;
  }, []);

  const handleRegisterPlanetFocusApi = useCallback((apiFn) => {
    planetFocusApiRef.current = apiFn;
    // The solar scene is Suspense-mounted; this signals that the body refs exist.
    setTourPlanetFocusReady(Boolean(apiFn));
  }, []);

  const focusPlanetFromUi = useCallback((name) => {
    if (!planetFocusApiRef.current) return;
    planetFocusApiRef.current(name);
  }, []);

  const handleCameraChange = useCallback(
    (position, target) => {
      const distFromCenter = position.length();

      if (position && target) {
        lastCamPosRef.current.copy(position);
        lastCamTargetRef.current.copy(target);
      }

      if (isBackAnimating) return;
      if (warpTarget) return;

      if (mode === MODE.GALAXY) {
        const REGION_LABEL_DIST = shellRadius * 9;

        const shouldShowRegions = distFromCenter < REGION_LABEL_DIST;
        if (shouldShowRegions !== showGalaxyRegions) {
          setShowGalaxyRegions(shouldShowRegions);
        }

        // While touring, transitions are intentional (not triggered by zoom).
        if (tourActive) return;

        if (focus === FOCUS.SUN && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_SUN);
          return;
        }

        if (focus === FOCUS.SIRIUS && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_SIRIUS);
          return;
        }

        if (focus === FOCUS.ALPHA && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_ALPHA);
          return;
        }

        if (focus === FOCUS.BETELGEUSE && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_BETELGEUSE);
          return;
        }
        if (focus === FOCUS.NAOS && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_NAOS);
          return;
        }

        if (focus === FOCUS.ANTARES && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_ANTARES);
          return;
        }

        if (focus === FOCUS.CAPELLA && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_CAPELLA);
          return;
        }

        if (focus === FOCUS.CASTOR && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_CASTOR);
          return;
        }

        if (focus === FOCUS.SAGITTARIUS && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_SAGITTARIUS);
          return;
        }

        if (focus === FOCUS.KEPLER22 && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_KEPLER22);
          return;
        }

        if (focus === FOCUS.VEGA && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_VEGA);
          return;
        }

        if (focus === FOCUS.MILKY_WAY && distFromCenter <= ENTER_DIST) {
          setWarpTarget(WARP_TARGET.TO_INNER_GENERIC);
          return;
        }
      }
    },
    [
      mode,
      focus,
      ENTER_DIST,
      EXIT_DIST,
      warpTarget,
      isBackAnimating,
      shellRadius,
      showGalaxyRegions,
      tourActive,
    ],
  );

  const finishGalaxyTourHandoff = useCallback(() => {
    if (pendingManualGalaxyResetRef.current) {
      pendingManualGalaxyResetRef.current = false;
      cameraRef.current?.setPositionAndTarget(
        GALAXY_CAM.position,
        GALAXY_CAM.target,
      );
      backProgressRef.current = 0;
      isBackAnimatingRef.current = false;
      setIsBackAnimating(false);
    }

    const pending = pendingGalaxyTourFlightRef.current;
    if (!pending) return;
    pendingGalaxyTourFlightRef.current = null;

    if (tourRunIdRef.current !== pending.runId || !cameraRef.current) return;
    const { transition, runId } = pending;

    cameraRef.current.setPositionAndTarget([0, 3, 10], [0, 0, 0]);
    // Restoring before the inner scene is unmounted can briefly reveal a star.
    backProgressRef.current = 0;
    const [x, y, z] = transition.portal;
    cameraRef.current.animateTo(
      [x + 0.85, y + 1.0, z + 2.25],
      transition.portal,
      5.2,
      () => {
        if (tourRunIdRef.current !== runId) return;
        setWarpTarget(transition.warp);
      },
      "smooth",
    );
  }, []);

  const startGuidedTour = useCallback(() => {
    if (
      !cameraRef.current ||
      !isMilkyWayReady ||
      mode !== MODE.GALAXY ||
      warpTarget ||
      isBackAnimating
    )
      return;

    const runId = ++tourRunIdRef.current;
    tourBodyRef.current = null;
    tourBodyStartedRef.current = null;
    tourTravelStartedRef.current = null;
    pendingGalaxyTourFlightRef.current = null;
    planetFocusApiRef.current = null;
    setTourPlanetFocusReady(false);
    cameraRef.current.cancelAnimation?.();
    setTourPaused(false);
    setFocus(FOCUS.MILKY_WAY);
    setTourPhase("galaxy");
    setFocusedPlanet(null);

    cameraRef.current.animateTo(
      [5.5, 4.5, 12.5],
      [0, 0, 0],
      5,
      () => {
        if (tourRunIdRef.current !== runId) return;
        setTourPhase("approach");
        cameraRef.current?.animateTo(
          [-1.1, 1.05, 3.2],
          [-2.0, 0.15, 0.9],
          5.5,
          () => {
            if (tourRunIdRef.current !== runId) return;
            setTourPhase("transit");
            setFocus(FOCUS.SUN);
            setWarpTarget(WARP_TARGET.TO_SUN);
          },
          "smooth",
        );
      },
      "smooth",
    );
  }, [isMilkyWayReady, mode, warpTarget, isBackAnimating]);

  // The existing TO_SUN transition teleports into the Solar System scene.
  useEffect(() => {
    if (
      tourPhase !== "transit" ||
      mode !== MODE.INNER ||
      activeInnerSpace !== "sun" ||
      warpTarget
    )
      return;

    const runId = tourRunIdRef.current;
    setTourPhase("solar");
    cameraRef.current?.animateTo(
      [180, 130, 2100],
      [0, 0, 0],
      6,
      () => {
        if (tourRunIdRef.current === runId) setTourPhase("sun");
      },
      "smooth",
    );
  }, [tourPhase, mode, activeInnerSpace, warpTarget]);

  // Exit the current system, return to a wide Milky Way view, then fly toward
  // the destination's EXISTING portal before using the normal warp handler.
  // The run ID prevents delayed animation callbacks from reviving an exited tour.
  useEffect(() => {
    const transition = TOUR_TRANSITIONS[tourPhase];
    if (!transition || !cameraRef.current) return;
    if (tourTravelStartedRef.current === tourPhase) return;

    tourTravelStartedRef.current = tourPhase;
    const runId = ++tourRunIdRef.current;
    tourBodyRef.current = null;
    tourBodyStartedRef.current = null;
    planetFocusApiRef.current = null;
    setTourPlanetFocusReady(false);
    setTourPaused(false);
    setFocusedPlanet(null);
    cameraRef.current.cancelAnimation?.();

    const flyThroughGalaxy = () => {
      if (tourRunIdRef.current !== runId) return;

      // DO NOT teleport the camera before React Three Fiber unmounts the
      // previous inner scene. Galaxy coordinates could land inside that star!
      pendingGalaxyTourFlightRef.current = { runId, transition };
      backProgressRef.current = 1; // keep old system hidden through the handoff
      if (mode === MODE.GALAXY) {
        // No scene switch is needed if we're already looking at the galaxy.
        finishGalaxyTourHandoff();
        return;
      }
      setFocus(transition.focus);
      setShowGalaxyRegions(true);
      setMode(MODE.GALAXY);
      setActiveInnerSpace(null);
      // GuidedTourGalaxySceneReady will start the portal flight after the
      // Canvas commit removes the old star-system meshes.
    };

    if (mode === MODE.INNER) {
      // Distances are in the *current* inner scene, not galaxy coordinates.
      cameraRef.current.animateTo(
        [0, 380, 5200],
        [0, 0, 0],
        3.2,
        flyThroughGalaxy,
        "smooth",
      );
    } else {
      flyThroughGalaxy();
    }
  }, [tourPhase, finishGalaxyTourHandoff]);

  // After the target scene is active, start at its first actual body.
  // The shared focus effect waits for onRegisterPlanetFocusApi before moving.
  useEffect(() => {
    const transition = TOUR_TRANSITIONS[tourPhase];
    if (
      !transition ||
      mode !== MODE.INNER ||
      warpTarget ||
      activeInnerSpace !== transition.space
    )
      return;
    setTourPhase(transition.overview);
  }, [tourPhase, mode, warpTarget, activeInnerSpace]);

  useEffect(() => {
    const stop = TOUR_STOPS[tourPhase];
    if (
      !stop ||
      mode !== MODE.INNER ||
      activeInnerSpace !== stop.space ||
      warpTarget ||
      !tourPlanetFocusReady ||
      tourPaused ||
      tourBodyStartedRef.current === tourPhase
    )
      return;

    // Solar System: freeze the target's orbit before reading its position.
    if (stop.space === "sun" && focusedPlanet !== stop.name) {
      setFocusedPlanet(stop.name);
      return;
    }

    const runId = tourRunIdRef.current;
    let cancelled = false;
    let retryFrameId = null;
    let framesUntilRetry = 0;
    let warnedMissingTarget = false;

    const attemptFocus = () => {
      if (
        cancelled ||
        tourRunIdRef.current !== runId ||
        tourBodyStartedRef.current === tourPhase
      )
        return;

      const focusApi = planetFocusApiRef.current;
      if (!focusApi) {
        scheduleRetry();
        return;
      }

      const visit = {
        name: stop.name,
        runId,
        focusStarted: false,
        onFinished: () => {
          if (tourRunIdRef.current !== runId || tourBodyRef.current !== visit)
            return;
          tourBodyRef.current = null;
          setTourPhase(stop.next);
        },
      };
      tourBodyRef.current = visit;
      tourBodyStartedRef.current = tourPhase;
      focusApi(stop.name);

      // handlePlanetLabelClick sets focusStarted=true only if the real mesh
      // reported its current world coordinates and started camera movement.
      if (!visit.focusStarted) {
        if (tourBodyRef.current === visit) tourBodyRef.current = null;
        tourBodyStartedRef.current = null;
        if (!warnedMissingTarget) {
          console.warn(`[Guided Tour] Waiting for focus target: ${stop.name}`);
          warnedMissingTarget = true;
        }
        scheduleRetry();
      }
    };

    const scheduleRetry = () => {
      // Retry approximately every 8 rendered frames while the mesh mounts.
      // This is a readiness retry, NOT a timer that advances the tour.
      retryFrameId = window.requestAnimationFrame(() => {
        if (cancelled) return;
        framesUntilRetry += 1;
        if (framesUntilRetry < 8) scheduleRetry();
        else {
          framesUntilRetry = 0;
          attemptFocus();
        }
      });
    };

    attemptFocus();

    return () => {
      cancelled = true;
      if (retryFrameId !== null) window.cancelAnimationFrame(retryFrameId);
    };
  }, [
    tourPhase,
    mode,
    activeInnerSpace,
    warpTarget,
    tourPlanetFocusReady,
    tourPaused,
    focusedPlanet,
  ]);

  const toggleTourPause = useCallback(() => {
    if (
      [
        "idle",
        "complete",
        "transit",
        ...Object.keys(TOUR_TRANSITIONS),
      ].includes(tourPhase)
    )
      return;
    if (tourPaused) cameraRef.current?.resumeAnimation?.();
    else cameraRef.current?.pauseAnimation?.();
    setTourPaused((prev) => !prev);
  }, [tourPhase, tourPaused]);

  const skipTourStop = useCallback(() => {
    const runId = ++tourRunIdRef.current;
    void runId;
    cameraRef.current?.cancelAnimation?.();
    tourBodyRef.current = null;
    tourBodyStartedRef.current = null;
    setTourPaused(false);

    if (["galaxy", "approach"].includes(tourPhase)) {
      setTourPhase("transit");
      setFocus(FOCUS.SUN);
      setWarpTarget(WARP_TARGET.TO_SUN);
      return;
    }
    if (tourPhase === "solar") {
      setTourPhase("sun");
      return;
    }
    const stop = TOUR_STOPS[tourPhase];
    if (stop) {
      setTourPhase(stop.next);
      return;
    }
  }, [tourPhase]);

  const exitGuidedTour = useCallback(() => {
    ++tourRunIdRef.current;
    pendingGalaxyTourFlightRef.current = null;
    tourBodyRef.current = null;
    tourBodyStartedRef.current = null;
    tourTravelStartedRef.current = null;
    cameraRef.current?.cancelAnimation?.();
    setTourPaused(false);
    if (mode === MODE.GALAXY) {
      // Normal galaxy zoom-entry is active again after exiting the tour.
      // Return to a safe wide view so this does not trigger an unwanted warp.
      setFocus(FOCUS.MILKY_WAY);
      cameraRef.current?.setPositionAndTarget(
        GALAXY_CAM.position,
        GALAXY_CAM.target,
      );
    }
    setTourPhase("idle");
    // Keep the current inner scene for manual exploration.
  }, [mode]);

  const backToMilkyWay = useCallback(() => {
    if (cameraRef.current?.animateTo) {
      const fromPos = lastCamPosRef.current.clone();
      const fromTarget = lastCamTargetRef.current.clone();

      const distToTarget = fromPos.distanceTo(fromTarget);
      const desiredFar = 380;

      let extra = desiredFar - distToTarget;
      extra = Math.min(Math.max(extra, 120), 320);

      let dir = fromPos.clone().sub(fromTarget);
      if (dir.length() < 1e-3) {
        dir.set(0, 0, 1);
      }
      dir.normalize();

      const destPos = fromPos.clone().add(dir.multiplyScalar(extra));
      const distanceToTravel = extra;

      const baseSpeed = 240;
      let durationSec = distanceToTravel / baseSpeed;
      durationSec = Math.min(Math.max(durationSec, 0.7), 2.0);

      setIsBackAnimating(true);
      isBackAnimatingRef.current = true;
      backProgressRef.current = 0;

      cameraRef.current.animateTo(
        [destPos.x, destPos.y, destPos.z],
        [fromTarget.x, fromTarget.y, fromTarget.z],
        durationSec,
      );

      const start = performance.now();
      const animateProgress = () => {
        if (!isBackAnimatingRef.current) return;

        const now = performance.now();
        const t = Math.min((now - start) / (durationSec * 1000), 1);
        backProgressRef.current = t;

        if (t < 1) {
          requestAnimationFrame(animateProgress);
        }
      };
      requestAnimationFrame(animateProgress);

      setTimeout(() => {
        // HIDE old meshes first; do not reset exit progress to zero here.
        // A premature zero could re-show the original star for one frame.
        isBackAnimatingRef.current = false; // stop the progress RAF loop
        backProgressRef.current = 1;
        pendingManualGalaxyResetRef.current = true;
        setMode(MODE.GALAXY);
        setActiveInnerSpace(null);
        setFocus(FOCUS.MILKY_WAY);
        setFocusedPlanet(null);
        focusedDistanceRef.current = null;
        // Camera teleport and the final ref reset happen only in the
        // Canvas layout-effect handoff, after old inner meshes unmount.
      }, durationSec * 1000);
    } else if (cameraRef.current?.setPositionAndTarget) {
      // Same commit boundary for non-animated fallback.
      backProgressRef.current = 1;
      pendingManualGalaxyResetRef.current = true;
      setMode(MODE.GALAXY);
      setActiveInnerSpace(null);
      setFocus(FOCUS.MILKY_WAY);
      setFocusedPlanet(null);
      focusedDistanceRef.current = null;
    }
  }, []);

  const enterSunByClick = useCallback(() => {
    setFocus(FOCUS.SUN);
    setWarpTarget(WARP_TARGET.TO_SUN);
  }, []);

  const enterSiriusByClick = useCallback(() => {
    setFocus(FOCUS.SIRIUS);
    setWarpTarget(WARP_TARGET.TO_SIRIUS);
  }, []);

  const enterAlphaByClick = useCallback(() => {
    setFocus(FOCUS.ALPHA);
    setWarpTarget(WARP_TARGET.TO_ALPHA);
  }, []);

  const enterBetelgeuseByClick = useCallback(() => {
    setFocus(FOCUS.BETELGEUSE);
    setWarpTarget(WARP_TARGET.TO_BETELGEUSE);
  }, []);

  const enterNaosByClick = useCallback(() => {
    setFocus(FOCUS.NAOS);
    setWarpTarget(WARP_TARGET.TO_NAOS);
  }, []);

  const enterAntaresByClick = useCallback(() => {
    setFocus(FOCUS.ANTARES);
    setWarpTarget(WARP_TARGET.TO_ANTARES);
  }, []);

  const enterCapellaByClick = useCallback(() => {
    setFocus(FOCUS.CAPELLA);
    setWarpTarget(WARP_TARGET.TO_CAPELLA);
  }, []);

  const enterCastorByClick = useCallback(() => {
    setFocus(FOCUS.CASTOR);
    setWarpTarget(WARP_TARGET.TO_CASTOR);
  }, []);

  const enterSagittariusByClick = useCallback(() => {
    setFocus(FOCUS.SAGITTARIUS);
    setWarpTarget(WARP_TARGET.TO_SAGITTARIUS);
  }, []);

  const enterKepler22ByClick = useCallback(() => {
    setFocus(FOCUS.KEPLER22);
    setWarpTarget(WARP_TARGET.TO_KEPLER22);
  }, []);

  const enterVegaByClick = useCallback(() => {
    setFocus(FOCUS.VEGA);
    setWarpTarget(WARP_TARGET.TO_VEGA);
  }, []);

  const resetSolarSystemView = useCallback(() => {
    if (!cameraRef.current) return;
    setFocusedPlanet(null);
    focusedDistanceRef.current = null;
    cameraRef.current.animateTo(SUN_CAM.position, SUN_CAM.target, 1.0);
  }, []);

  const resetSiriusView = useCallback(() => {
    if (!cameraRef.current) return;
    setFocusedPlanet(null);
    focusedDistanceRef.current = null;
    cameraRef.current.animateTo(SIRIUS_CAM.position, SIRIUS_CAM.target, 1.0);
  }, []);

  const resetAlphaView = useCallback(() => {
    if (!cameraRef.current) return;
    setFocusedPlanet(null);
    focusedDistanceRef.current = null;
    cameraRef.current.animateTo(ALPHA_CAM.position, ALPHA_CAM.target, 1.0);
  }, []);

  const resetBetelgeuseView = useCallback(() => {
    if (!cameraRef.current) return;
    setFocusedPlanet(null);
    focusedDistanceRef.current = null;
    cameraRef.current.animateTo(
      BETELGEUSE_CAM.position,
      BETELGEUSE_CAM.target,
      1.0,
    );
  }, []);

  const resetNaosView = useCallback(() => {
    if (!cameraRef.current) return;
    setFocusedPlanet(null);
    focusedDistanceRef.current = null;
    cameraRef.current.animateTo(NAOS_CAM.position, NAOS_CAM.target, 1.0);
  }, []);

  const resetAntaresView = useCallback(() => {
    if (!cameraRef.current) return;
    setFocusedPlanet(null);
    focusedDistanceRef.current = null;
    cameraRef.current.animateTo(ANTARES_CAM.position, ANTARES_CAM.target, 1.0);
  }, []);

  const resetCapellaView = useCallback(() => {
    if (!cameraRef.current) return;
    setFocusedPlanet(null);
    focusedDistanceRef.current = null;
    cameraRef.current.animateTo(CAPELLA_CAM.position, CAPELLA_CAM.target, 1.0);
  }, []);

  const resetCastorView = useCallback(() => {
    if (!cameraRef.current) return;
    setFocusedPlanet(null);
    focusedDistanceRef.current = null;
    cameraRef.current.animateTo(CASTOR_CAM.position, CASTOR_CAM.target, 1.0);
  }, []);

  const resetSagittariusView = useCallback(() => {
    if (!cameraRef.current) return;
    setFocusedPlanet(null);
    focusedDistanceRef.current = null;
    cameraRef.current.animateTo(
      SAGITTARIUS_CAM.position,
      SAGITTARIUS_CAM.target,
      1.0,
    );
  }, []);

  const resetKepler22View = useCallback(() => {
    if (!cameraRef.current) return;
    setFocusedPlanet(null);
    focusedDistanceRef.current = null;
    cameraRef.current.animateTo(
      KEPLER22_CAM.position,
      KEPLER22_CAM.target,
      1.0,
    );
  }, []);

  const resetVegaView = useCallback(() => {
    if (!cameraRef.current) return;
    setFocusedPlanet(null);
    focusedDistanceRef.current = null;
    cameraRef.current.animateTo(VEGA_CAM.position, VEGA_CAM.target, 1.0);
  }, []);

  const isWarping = warpTarget !== null;
  const showGalaxy = !isWarping && mode === MODE.GALAXY;
  const showSunSpace =
    !isWarping &&
    activeInnerSpace === "sun" &&
    (mode === MODE.INNER || isBackAnimating);

  const showSiriusSpace =
    !isWarping &&
    activeInnerSpace === "sirius" &&
    (mode === MODE.INNER || isBackAnimating);

  const showAlphaSpace =
    !isWarping &&
    activeInnerSpace === "alphaCentauri" &&
    (mode === MODE.INNER || isBackAnimating);

  const showBetelgeuseSpace =
    !isWarping &&
    activeInnerSpace === "betelgeuse" &&
    (mode === MODE.INNER || isBackAnimating);

  const showNaosSpace =
    !isWarping &&
    activeInnerSpace === "naos" &&
    (mode === MODE.INNER || isBackAnimating);

  const showAntaresSpace =
    !isWarping &&
    activeInnerSpace === "antares" &&
    (mode === MODE.INNER || isBackAnimating);

  const showCapellaSpace =
    !isWarping &&
    activeInnerSpace === "capella" &&
    (mode === MODE.INNER || isBackAnimating);

  const showCastorSpace =
    !isWarping &&
    activeInnerSpace === "castor" &&
    (mode === MODE.INNER || isBackAnimating);

  const showSagittariusSpace =
    !isWarping &&
    activeInnerSpace === "sagittarius" &&
    (mode === MODE.INNER || isBackAnimating);

  const showKepler22Space =
    !isWarping &&
    activeInnerSpace === "kepler22" &&
    (mode === MODE.INNER || isBackAnimating);

  const showVegaSpace =
    !isWarping &&
    activeInnerSpace === "vega" &&
    (mode === MODE.INNER || isBackAnimating);

  const planetButtonNames = [
    "Sun",
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Ceres",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
    "Haumea",
    "Makemake",
    "Eris",
    "Asteroid Belt",
    "Kuiper Belt",
    "Voyager 1",
    "New Horizons",
  ];

  const InnerFallback = () => (
    <Html center>
      <div
        style={{
          position: "relative",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {/* Orbital rings */}
        <div style={{ position: "relative", width: "80px", height: "80px" }}>
          {/* Outer ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid rgba(100, 150, 255, 0.3)",
              borderRadius: "50%",
              borderTopColor: "#4a9eff",
              animation: "spin 2s linear infinite",
            }}
          />
          {/* Middle ring */}
          <div
            style={{
              position: "absolute",
              inset: "10px",
              border: "2px solid rgba(150, 100, 255, 0.3)",
              borderRadius: "50%",
              borderRightColor: "#9d4aff",
              animation: "spin 1.5s linear infinite reverse",
            }}
          />
          {/* Inner ring */}
          <div
            style={{
              position: "absolute",
              inset: "20px",
              border: "2px solid rgba(255, 100, 150, 0.3)",
              borderRadius: "50%",
              borderBottomColor: "#ff4a9d",
              animation: "spin 1s linear infinite",
            }}
          />
          {/* Center core */}
          <div
            style={{
              position: "absolute",
              inset: "32px",
              background:
                "radial-gradient(circle, #4a9eff 0%, transparent 70%)",
              borderRadius: "50%",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Text */}
        <div
          style={{
            color: "#88ccff",
            fontSize: "13px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "3px",
            fontWeight: "300",
            textTransform: "uppercase",
            animation: "fade 1.5s ease-in-out infinite",
          }}
        >
          Loading system...
        </div>

        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @keyframes pulse-glow {
              0%, 100% {
                opacity: 0.4;
                transform: scale(0.8);
                filter: blur(4px);
              }
              50% {
                opacity: 1;
                transform: scale(1.2);
                filter: blur(6px);
              }
            }
            @keyframes fade {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 1; }
            }
          `}
        </style>
      </div>
    </Html>
  );

  const showSpaceLoading =
    (mode === MODE.INNER || isBackAnimating) && activeInnerSpace !== null; // sadece gerçek space’lerde

  return (
    <div className="w-full h-screen bg-black relative">
      {!isMilkyWayReady && <LoadingScreen />}
      {!tourActive && (
        <SpaceInfoPanel
          mode={mode}
          focus={focus}
          activeInnerSpace={activeInnerSpace}
          isWarping={isWarping}
          isBackAnimating={isBackAnimating}
          focusedPlanet={focusedPlanet}
          planetButtonNames={planetButtonNames}
          onSetFocusMilkyWay={() => setFocus(FOCUS.MILKY_WAY)}
          onSetFocusSun={() => setFocus(FOCUS.SUN)}
          onSetFocusSirius={() => setFocus(FOCUS.SIRIUS)}
          onSetFocusAlpha={() => setFocus(FOCUS.ALPHA)}
          onSetFocusBetelgeuse={() => setFocus(FOCUS.BETELGEUSE)}
          onSetFocusNaos={() => setFocus(FOCUS.NAOS)}
          onSetFocusAntares={() => setFocus(FOCUS.ANTARES)}
          onSetFocusCapella={() => setFocus(FOCUS.CAPELLA)}
          onSetFocusCastor={() => setFocus(FOCUS.CASTOR)}
          onSetFocusSagittarius={() => setFocus(FOCUS.SAGITTARIUS)}
          onSetFocusKepler22={() => setFocus(FOCUS.KEPLER22)}
          onSetFocusVega={() => setFocus(FOCUS.VEGA)}
          onBackToMilkyWay={backToMilkyWay}
          onPlanetButtonClick={focusPlanetFromUi}
          onResetSolarSystemView={resetSolarSystemView}
          onResetSiriusView={resetSiriusView}
          onResetAlphaView={resetAlphaView}
          onResetBetelgeuseView={resetBetelgeuseView}
          onResetNaosView={resetNaosView}
          onResetAntaresView={resetAntaresView}
          onResetCapellaView={resetCapellaView}
          onResetCastorView={resetCastorView}
          onResetSagittariusView={resetSagittariusView}
          onResetKepler22View={resetKepler22View}
          onResetVegaView={resetVegaView}
          onStartGuidedTour={startGuidedTour}
          isTourActive={tourActive}
          canStartGuidedTour={isMilkyWayReady && !isWarping && !isBackAnimating}
        />
      )}

      {tourActive && <GuidedTourInfoCard phase={tourPhase} />}

      {tourActive && (
        <GuidedTourDistance
          phase={tourPhase}
          paused={tourPaused}
          space={
            TOUR_STOPS[tourPhase]?.space ?? TOUR_TRANSITIONS[tourPhase]?.space
          }
        />
      )}

      {tourActive && (
        <GuidedTourControls
          phase={tourPhase}
          paused={tourPaused}
          onPauseResume={toggleTourPause}
          onSkip={skipTourStop}
          onExit={exitGuidedTour}
        />
      )}

      {isWarping && (
        <div className="pointer-events-none absolute inset-0 z-20 bg-black/60" />
      )}

      <Canvas
        className="relative z-0"
        camera={{
          position: GALAXY_CAM.position,
          fov: 50,
          near: 0.1,
          far: 8000,
        }}
        gl={{ antialias: true }}
      >
        <CameraControls
          ref={cameraRef}
          autoRotate={
            showGalaxy && !isWarping && !isBackAnimating && !tourActive
          }
          tourLocked={tourCameraLocked}
          onCameraChange={handleCameraChange}
        />
        {/* <Suspense fallback={null}> */}
        <Suspense fallback={showSpaceLoading ? <InnerFallback /> : null}>
          <ambientLight intensity={0.35} />
          <pointLight
            position={[0, 0, 0]}
            intensity={4.5}
            distance={120}
            decay={2}
            color="#ffffff"
          />
          <directionalLight
            position={[6, 5, 4]}
            intensity={0.8}
            color="#ffffff"
          />

          <Environment preset="night" />

          <InnerSpace
            visible={true}
            // maxRadius={1600}
            // count={3000}
            // minSize={0.38}
            // maxSize={0.4}
            maxRadius={5000}
            minRadius={200}
            count={3000}
            minSize={0.82}
            maxSize={1.25}
          />

          <GalaxyShell
            radius={shellRadius}
            halfHeight={shellHalfHeight}
            visible={showGalaxy}
          />

          <MilkyWay
            {...galaxyParams}
            visible={showGalaxy}
            onReady={() => setIsMilkyWayReady(true)}
            defer
          />

          {showGalaxy && !showGalaxyRegions && (
            <Html
              center
              position={[0, 4.6, 0]}
              style={{
                fontSize: "14px",
                color: "white",
                background: "rgba(0,0,0,0.45)",
                padding: "3px 8px",
                borderRadius: "8px",
                whiteSpace: "nowrap",
              }}
            >
              Milky Way
            </Html>
          )}

          {showGalaxy &&
            mode === MODE.GALAXY &&
            !isBackAnimating &&
            showGalaxyRegions && (
              <>
                <SunPortal
                  label="Solar System"
                  position={[-2, 0.15, 0.9]} // x, y, z
                  onClick={enterSunByClick}
                />

                <SiriusPortal
                  label="Sirius A / B"
                  position={[-0.6, 0.15, 1.5]}
                  onClick={enterSiriusByClick}
                />

                <AlphaCentauriPortal
                  label="Alpha Centauri"
                  position={[-2.0, 0.15, 2]}
                  onClick={enterAlphaByClick}
                />
                <BetelgeusePortal
                  label="Betelgeuse"
                  // position={[1.6, 0.15, 1.35]}
                  position={[3.45, 0.15, 0.65]}
                  onClick={enterBetelgeuseByClick}
                />

                <NaosPortal
                  label="Naos"
                  position={[3.2, 0.15, -1.35]}
                  onClick={enterNaosByClick}
                />

                <AntaresPortal
                  label="Antares (α Scorpii)"
                  position={[-1.55, 0.15, -1.35]}
                  onClick={enterAntaresByClick}
                />

                <CapellaPortal
                  label="Capella (α Aurigae)"
                  position={[2.2, 0.15, -2.0]}
                  onClick={enterCapellaByClick}
                />

                <CastorPortal
                  label="Castor (α Geminorum)"
                  position={[0.9, 0.15, -2.6]}
                  onClick={enterCastorByClick}
                />

                <SagittariusPortal
                  label="Sagittarius A*"
                  position={[0, 0, 0]}
                  onClick={enterSagittariusByClick}
                />

                <Kepler22Portal
                  label="Kepler-22"
                  position={[-3.3, 0.15, -1]}
                  onClick={enterKepler22ByClick}
                />

                <VegaPortal
                  label="Vega (α Lyrae)"
                  // position={[3.45, 0.15, 0.65]}
                  position={[1.6, 0.15, 1.35]}
                  onClick={enterVegaByClick}
                />
              </>
            )}

          {/* memory efficient , spaceye girmeden mount yok */}

          {showSunSpace && (
            <SunSpace
              position={[0, 0, 0]}
              exitProgressRef={backProgressRef}
              onPlanetLabelClick={handlePlanetLabelClick}
              focusedPlanetName={focusedPlanet}
              onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
            />
          )}

          {showSiriusSpace && (
            <SiriusSpace
              position={[0, 0, 0]}
              exitProgressRef={backProgressRef}
              onPlanetLabelClick={handlePlanetLabelClick}
              focusedPlanetName={focusedPlanet}
              onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
            />
          )}

          {showAlphaSpace && (
            <AlphaCentauriSpace
              position={[0, 0, 0]}
              exitProgressRef={backProgressRef}
              onPlanetLabelClick={handlePlanetLabelClick}
              focusedPlanetName={focusedPlanet}
              onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
            />
          )}

          {showBetelgeuseSpace && (
            <BetelgeuseSpace
              position={[0, 0, 0]}
              exitProgressRef={backProgressRef}
              onPlanetLabelClick={handlePlanetLabelClick}
              focusedPlanetName={focusedPlanet}
              onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
            />
          )}

          {showNaosSpace && (
            <NaosSpace
              position={[0, 0, 0]}
              exitProgressRef={backProgressRef}
              onPlanetLabelClick={handlePlanetLabelClick}
              focusedPlanetName={focusedPlanet}
              onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
            />
          )}

          {showAntaresSpace && (
            <AntaresSpace
              position={[0, 0, 0]}
              exitProgressRef={backProgressRef}
              onPlanetLabelClick={handlePlanetLabelClick}
              focusedPlanetName={focusedPlanet}
              onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
            />
          )}

          {showCapellaSpace && (
            <CapellaSpace
              position={[0, 0, 0]}
              exitProgressRef={backProgressRef}
              onPlanetLabelClick={handlePlanetLabelClick}
              focusedPlanetName={focusedPlanet}
              onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
            />
          )}

          {showCastorSpace && (
            <CastorSpace
              position={[0, 0, 0]}
              exitProgressRef={backProgressRef}
              onPlanetLabelClick={handlePlanetLabelClick}
              focusedPlanetName={focusedPlanet}
              onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
            />
          )}

          {showSagittariusSpace && (
            <SagittariusSpace
              position={[0, 0, 0]}
              exitProgressRef={backProgressRef}
              onPlanetLabelClick={handlePlanetLabelClick}
              focusedPlanetName={focusedPlanet}
              onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
            />
          )}

          {showKepler22Space && (
            <Kepler22Space
              position={[0, 0, 0]}
              exitProgressRef={backProgressRef}
              onPlanetLabelClick={handlePlanetLabelClick}
              focusedPlanetName={focusedPlanet}
              onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
            />
          )}

          {showVegaSpace && (
            <VegaSpace
              position={[0, 0, 0]}
              exitProgressRef={backProgressRef}
              onPlanetLabelClick={handlePlanetLabelClick}
              focusedPlanetName={focusedPlanet}
              onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
            />
          )}

          {/* R3F scene-commit barrier: prevents a 1-frame old-star close-up
              during an automated inner-system -> galaxy camera reset. */}
          <GuidedTourGalaxySceneReady
            visible={showGalaxy && activeInnerSpace === null}
            onReady={finishGalaxyTourHandoff}
          />
        </Suspense>
      </Canvas>

      {tourActive && (
        <div
          className="pointer-events-auto absolute inset-0 z-30"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
