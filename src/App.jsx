import { Canvas } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import {
  Suspense,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
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
      const dir = new THREE.Vector3(0, 0, 1);
      distanceFromBody = 600;
      extraY = 20;

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
    // SUN & Kepler-22
    // =========================
    if (name === "Sun" || name === "Kepler-22") {
      const target = worldPos.clone(); // (0,0,0)
      const dir = new THREE.Vector3(0, 0, 1).normalize();
      distanceFromBody = 30;
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
    ],
  );

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
        setMode(MODE.GALAXY);
        setActiveInnerSpace(null);
        setFocus(FOCUS.MILKY_WAY);
        setFocusedPlanet(null);
        focusedDistanceRef.current = null;

        if (cameraRef.current?.setPositionAndTarget) {
          cameraRef.current.setPositionAndTarget(
            GALAXY_CAM.position,
            GALAXY_CAM.target,
          );
        }

        isBackAnimatingRef.current = false;
        setIsBackAnimating(false);
        backProgressRef.current = 0;
      }, durationSec * 1000);
    } else if (cameraRef.current?.setPositionAndTarget) {
      cameraRef.current.setPositionAndTarget(
        GALAXY_CAM.position,
        GALAXY_CAM.target,
      );
      setMode(MODE.GALAXY);
      setActiveInnerSpace(null);
      setFocus(FOCUS.MILKY_WAY);
      isBackAnimatingRef.current = false;
      setIsBackAnimating(false);
      setFocusedPlanet(null);
      focusedDistanceRef.current = null;
      backProgressRef.current = 0;
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
    (mode === MODE.INNER || isBackAnimating) && activeInnerSpace !== null; // sadece gerçek spacelerde loading olsun

  return (
    <div className="w-full h-screen bg-black relative">
      {!isMilkyWayReady && <LoadingScreen />}
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
      />

      {isWarping && (
        <div className="pointer-events-none absolute inset-0 z-20 bg-black/60" />
      )}

      <Canvas
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
          autoRotate={showGalaxy && !isWarping && !isBackAnimating}
          onCameraChange={handleCameraChange}
        />
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
                  position={[1.6, 0.15, 1.35]}
                  onClick={enterVegaByClick}
                />
              </>
            )}

          {/* spaceye girmeden mount etmesin */}

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
        </Suspense>
      </Canvas>
    </div>
  );
}
