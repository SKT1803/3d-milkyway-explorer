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

const FOCUS = {
  MILKY_WAY: "milkyWay",
  SUN: "sun",
  SIRIUS: "sirius",
  ALPHA: "alphaCentauri",
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
    position: [0, 10, 80],
    target: [0, 0, 0],
  };

  const SUN_CAM = {
    position: [0, 0, 3000],
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
        SIRIUS_CAM.target
      );
    } else if (warpTarget === WARP_TARGET.TO_ALPHA) {
      setMode(MODE.INNER);
      setActiveInnerSpace("alphaCentauri");
      cameraRef.current.setPositionAndTarget(
        ALPHA_CAM.position,
        ALPHA_CAM.target
      );
    } else if (warpTarget === WARP_TARGET.TO_INNER_GENERIC) {
      setMode(MODE.INNER);
      setActiveInnerSpace(null);
      cameraRef.current.setPositionAndTarget(
        INNER_GENERIC_CAM.position,
        INNER_GENERIC_CAM.target
      );
    }

    setWarpTarget(null);
  }, [warpTarget]);

  const handlePlanetLabelClick = useCallback((name, worldPosArray, radius) => {
    if (!cameraRef.current) return;

    const worldPos = new THREE.Vector3(
      worldPosArray[0],
      worldPosArray[1],
      worldPosArray[2]
    );

    const dir = worldPos.clone().normalize();

    let distanceFromBody = radius * 7;
    let extraY = radius * 0.5;

    if (name === "Asteroid Belt") {
      distanceFromBody = radius * 9;
      extraY = 4;
      const target = new THREE.Vector3(0, 0, 0);
      const camPos = worldPos.clone().add(dir.multiplyScalar(distanceFromBody));

      cameraRef.current.animateTo(
        [camPos.x, camPos.y + extraY, camPos.z],
        [target.x, target.y, target.z],
        1.2
      );
      setFocusedPlanet(name);
      focusedDistanceRef.current = distanceFromBody;
      return;
    }

    if (name === "Kuiper Belt") {
      distanceFromBody = radius * 9;
      extraY = 30;
      const target = new THREE.Vector3(0, 0, 0);
      const camPos = worldPos.clone().add(dir.multiplyScalar(distanceFromBody));

      cameraRef.current.animateTo(
        [camPos.x, camPos.y + extraY, camPos.z],
        [target.x, target.y, target.z],
        1.2
      );
      setFocusedPlanet(name);
      focusedDistanceRef.current = distanceFromBody;
      return;
    }

    const target = worldPos.clone();
    const camPos = worldPos.clone().add(dir.multiplyScalar(distanceFromBody));

    cameraRef.current.animateTo(
      [camPos.x, camPos.y + extraY, camPos.z],
      [target.x, target.y, target.z],
      1.2
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
    ]
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
        durationSec
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
            GALAXY_CAM.target
          );
        }

        isBackAnimatingRef.current = false;
        setIsBackAnimating(false);
        backProgressRef.current = 0;
      }, durationSec * 1000);
    } else if (cameraRef.current?.setPositionAndTarget) {
      cameraRef.current.setPositionAndTarget(
        GALAXY_CAM.position,
        GALAXY_CAM.target
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

  const planetButtonNames = [
    "Sun",
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
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
  ];

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
        onBackToMilkyWay={backToMilkyWay}
        onPlanetButtonClick={focusPlanetFromUi}
        onResetSolarSystemView={resetSolarSystemView}
        onResetSiriusView={resetSiriusView}
        onResetAlphaView={resetAlphaView}
      />

      {isWarping && (
        <div className="pointer-events-none absolute inset-0 z-20 bg-black/60" />
      )}

      <Canvas
        camera={{
          position: GALAXY_CAM.position,
          fov: 50,
          near: 0.01,
          // far: 4000,
          far: 8000,
        }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
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
            maxRadius={1600}
            count={3000}
            minSize={0.38}
            maxSize={0.4}
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
                  position={[0.3, 0.15, 2.0]}
                  onClick={enterSiriusByClick}
                />

                <AlphaCentauriPortal
                  label="Alpha Centauri"
                  position={[-2.0, 0.15, 2]}
                  onClick={enterAlphaByClick}
                />
              </>
            )}

          <SunSpace
            visible={showSunSpace}
            position={[0, 0, 0]}
            exitProgressRef={backProgressRef}
            onPlanetLabelClick={handlePlanetLabelClick}
            focusedPlanetName={focusedPlanet}
            onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
          />

          <SiriusSpace
            visible={showSiriusSpace}
            position={[0, 0, 0]}
            exitProgressRef={backProgressRef}
            onPlanetLabelClick={handlePlanetLabelClick}
            focusedPlanetName={focusedPlanet}
            onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
          />

          <AlphaCentauriSpace
            visible={showAlphaSpace}
            position={[0, 0, 0]}
            exitProgressRef={backProgressRef}
            onPlanetLabelClick={handlePlanetLabelClick}
            focusedPlanetName={focusedPlanet}
            onRegisterPlanetFocusApi={handleRegisterPlanetFocusApi}
          />

          <CameraControls
            ref={cameraRef}
            autoRotate={showGalaxy && !isWarping && !isBackAnimating}
            onCameraChange={handleCameraChange}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
