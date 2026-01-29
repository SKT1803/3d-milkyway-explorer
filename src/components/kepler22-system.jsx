import { useRef, useEffect, useCallback, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Kepler22System({
  showLabels = true,
  focusedPlanetName,
  onPlanetLabelClick,
  onRegisterPlanetFocusApi,
  orbitTiltDeg = 2.5,
}) {
  const { camera } = useThree();

  const systemRef = useRef(null);

  const starGroupRef = useRef(null);
  const starRef = useRef(null);

  const orbitPlaneRef = useRef(null);
  const planetOrbitGroupRef = useRef(null);
  const planetRef = useRef(null);

  const [labelScale, setLabelScale] = useState(1);

  const [starTex, planetTex] = useTexture([
    "/textures/stars/capellaAb_yellow.jpg",
    "/textures/planets/kepler-22_b.jpg",
  ]);

  useEffect(() => {
    [starTex, planetTex].forEach((t) => {
      if (t) t.colorSpace = THREE.SRGBColorSpace;
    });
  }, [starTex, planetTex]);

  // =========================
  // SolarSystem benzeri SCALE
  // =========================
  const STAR_RADIUS = 10;
  const PLANET_SCALE = 1.8;
  const EARTH_BASE_RADIUS = 0.174;
  const earthRadius = EARTH_BASE_RADIUS * PLANET_SCALE;

  const PLANET_RADIUS = earthRadius * 2.4;

  const AU_SCALE = 25;
  const ORBIT_OFFSET = 14;
  const orbitR = (au) => ORBIT_OFFSET + AU_SCALE * au;

  // Kepler-22b ~0.85 AU civarı (yaklaşık)
  const AU_KEPLER22B = 0.85;
  const ORBIT_RADIUS = orbitR(AU_KEPLER22B);

  const ORBIT_SPEED = 0.19;
  const STAR_SPIN = 0.075;
  const PLANET_SPIN = 0.5;

  const orbitTiltRad = THREE.MathUtils.degToRad(orbitTiltDeg);

  const isFocusedSystem =
    focusedPlanetName === "Kepler-22" || focusedPlanetName === "Kepler-22b";

  const isFocusedPlanet = focusedPlanetName === "Kepler-22b";

  useFrame((_, delta) => {
    const d = camera.position.length();
    const minDist = 120;
    const maxDist = 520;

    const t = THREE.MathUtils.clamp((maxDist - d) / (maxDist - minDist), 0, 1);

    const targetScale = 0.8 + t * 1.2;

    setLabelScale((prev) => {
      const lerped = THREE.MathUtils.lerp(prev, targetScale, 0.12);
      if (Math.abs(lerped - prev) < 0.001) return prev;
      return lerped;
    });

    if (planetOrbitGroupRef.current) {
      const speed = isFocusedPlanet ? 0 : ORBIT_SPEED;
      planetOrbitGroupRef.current.rotation.y += speed * delta;
    }

    if (starRef.current) starRef.current.rotation.y += STAR_SPIN * delta;
    if (planetRef.current) planetRef.current.rotation.y += PLANET_SPIN * delta;
  });

  const showLabelFor = (name) =>
    showLabels && (!focusedPlanetName || focusedPlanetName !== name);

  const getBodyDataByName = (name) => {
    switch (name) {
      case "Kepler-22":
        return { ref: starRef, radius: STAR_RADIUS };
      case "Kepler-22b":
        return { ref: planetRef, radius: PLANET_RADIUS };
      default:
        return null;
    }
  };

  const focusBodyByName = useCallback(
    (name) => {
      const d = getBodyDataByName(name);
      if (!d?.ref?.current || !onPlanetLabelClick) return;

      const wp = new THREE.Vector3();
      d.ref.current.getWorldPosition(wp);

      onPlanetLabelClick(name, [wp.x, wp.y, wp.z], d.radius);
    },
    [onPlanetLabelClick],
  );

  useEffect(() => {
    onRegisterPlanetFocusApi?.(focusBodyByName);
  }, [onRegisterPlanetFocusApi, focusBodyByName]);

  return (
    <group ref={systemRef}>
      {/* STAR */}
      <group ref={starGroupRef} position={[0, 0, 0]}>
        <mesh ref={starRef}>
          <sphereGeometry args={[STAR_RADIUS, 128, 128]} />
          <meshStandardMaterial
            map={starTex}
            emissive="#fff1c8"
            emissiveMap={starTex}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {showLabelFor("Kepler-22") && (
          <Html position={[0, STAR_RADIUS + 3.6, 0]} distanceFactor={15}>
            <div
              className="px-4 py-1 rounded bg-black/70 text-white border border-yellow-300/60 text-nowrap"
              style={{ fontSize: `${1.3 * labelScale}rem`, cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                focusBodyByName("Kepler-22");
              }}
            >
              Kepler-22
            </div>
          </Html>
        )}
      </group>

      {/* ORBIT PLANE */}
      <group ref={orbitPlaneRef} rotation={[orbitTiltRad, 0, 0]}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[ORBIT_RADIUS - 0.03, ORBIT_RADIUS + 0.03, 128]}
          />
          <meshBasicMaterial
            color="#9ecbff"
            side={THREE.DoubleSide}
            transparent
            opacity={0.28}
          />
        </mesh>
        <group ref={planetOrbitGroupRef}>
          <mesh ref={planetRef} position={[ORBIT_RADIUS, 0, 0]}>
            <sphereGeometry args={[PLANET_RADIUS, 96, 96]} />
            <meshStandardMaterial map={planetTex} />
            {showLabelFor("Kepler-22b") && (
              <Html position={[0, PLANET_RADIUS + 0.6, 0]} distanceFactor={12}>
                <div
                  className="px-2 py-1 rounded bg-black/70 text-white border border-blue-300/60 text-nowrap"
                  style={{
                    fontSize: `${0.5 * labelScale}rem`,
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    focusBodyByName("Kepler-22b");
                  }}
                >
                  Kepler-22b
                </div>
              </Html>
            )}
          </mesh>
        </group>
      </group>
    </group>
  );
}
