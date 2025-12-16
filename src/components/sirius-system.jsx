import { useRef, useEffect, useCallback, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

const ORBIT_TILT_RAD = THREE.MathUtils.degToRad(28);

export function SiriusSystem({
  showLabels = true,
  labelScale: _ignoredLabelScaleProp,
  focusedPlanetName,
  onPlanetLabelClick,
  onRegisterPlanetFocusApi,
}) {
  const { camera } = useThree();

  const systemRef = useRef(null);
  const siriusAGroupRef = useRef(null);
  const siriusBGroupRef = useRef(null);
  const siriusARef = useRef(null);
  const siriusBRef = useRef(null);
  const angleRef = useRef(0);

  const [labelScale, setLabelScale] = useState(1);
  const [labelsVisibleByDistance, setLabelsVisibleByDistance] = useState(true);

  const [siriusTex] = useTexture(["/textures/stars/sirius.jpg"]);
  if (siriusTex) siriusTex.colorSpace = THREE.SRGBColorSpace;

  const siriusARadius = 40;
  const siriusBRadius = 6;

  const orbitRadius = 500;
  const orbitWidth = 1.25;

  const updatePositions = useCallback(
    (a) => {
      // Aynı halkada, 180° zıt
      const ax = orbitRadius * Math.cos(a);
      const az = orbitRadius * Math.sin(a);
      const bx = orbitRadius * Math.cos(a + Math.PI);
      const bz = orbitRadius * Math.sin(a + Math.PI);

      if (siriusAGroupRef.current) {
        siriusAGroupRef.current.position.set(ax, 0, az);
      }
      if (siriusBGroupRef.current) {
        siriusBGroupRef.current.position.set(bx, 0, bz);
      }
    },
    [orbitRadius]
  );

  useEffect(() => {
    updatePositions(angleRef.current);
  }, [updatePositions]);

  useFrame((_, delta) => {
    // LABEL SCALE + MESAFEYE GÖRE GÖRÜNÜRLÜK
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

      const shouldShow = d > 0 && d < 1200;
      setLabelsVisibleByDistance((prev) =>
        prev === shouldShow ? prev : shouldShow
      );
    }

    const binaryFocused =
      focusedPlanetName === "Sirius A" || focusedPlanetName === "Sirius B";

    const orbitSpeed = binaryFocused ? 0 : 0.1;
    const globalSpinSpeed = binaryFocused ? 0 : 0.015;

    angleRef.current += orbitSpeed * delta;
    updatePositions(angleRef.current);

    if (siriusARef.current) siriusARef.current.rotation.y += 0.4 * delta;
    if (siriusBRef.current) siriusBRef.current.rotation.y += 0.6 * delta;

    if (systemRef.current) {
      systemRef.current.rotation.y += globalSpinSpeed * delta;
    }
  });

  const showLabelFor = (name) =>
    showLabels &&
    labelsVisibleByDistance &&
    (!focusedPlanetName || focusedPlanetName !== name);

  const getBodyDataByName = (name) => {
    switch (name) {
      case "Sirius A":
        return { ref: siriusARef, radius: siriusARadius };
      case "Sirius B":
        return { ref: siriusBRef, radius: siriusBRadius };
      default:
        return null;
    }
  };

  const focusBodyByName = useCallback(
    (name) => {
      if (!onPlanetLabelClick) return;
      const data = getBodyDataByName(name);
      if (!data || !data.ref.current) return;

      const wp = new THREE.Vector3();
      data.ref.current.getWorldPosition(wp);

      onPlanetLabelClick(name, [wp.x, wp.y, wp.z], data.radius);
    },
    [onPlanetLabelClick]
  );

  useEffect(() => {
    if (onRegisterPlanetFocusApi) {
      onRegisterPlanetFocusApi(focusBodyByName);
    }
  }, [onRegisterPlanetFocusApi, focusBodyByName]);

  const handleLabelClick = (e, name) => {
    e.stopPropagation();
    focusBodyByName(name);
  };

  return (
    <group ref={systemRef} rotation-z={ORBIT_TILT_RAD}>
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry
          args={[orbitRadius - orbitWidth, orbitRadius + orbitWidth, 128]}
        />
        <meshBasicMaterial
          color="#3b7aa6"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* SIRIUS A */}
      <group ref={siriusAGroupRef}>
        <mesh ref={siriusARef}>
          <sphereGeometry args={[siriusARadius, 128, 128]} />
          <meshStandardMaterial
            map={siriusTex}
            roughness={0.35}
            metalness={0.25}
            emissive="#aee7ff"
            emissiveIntensity={2.2}
            emissiveMap={siriusTex}
            toneMapped={false}
          />
        </mesh>

        {showLabelFor("Sirius A") && (
          <Html distanceFactor={14} position={[0, siriusARadius + 14, 0]}>
            <div
              className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
              style={{
                fontSize: `${22.6 * labelScale}rem`,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={(e) => handleLabelClick(e, "Sirius A")}
            >
              Sirius A
            </div>
          </Html>
        )}
      </group>

      {/* SIRIUS B */}
      <group ref={siriusBGroupRef}>
        <mesh ref={siriusBRef}>
          <sphereGeometry args={[siriusBRadius, 96, 96]} />
          <meshStandardMaterial
            map={siriusTex}
            roughness={0.4}
            metalness={0.2}
            emissive="#a0dfff"
            emissiveIntensity={1.4}
            emissiveMap={siriusTex}
            toneMapped={false}
          />
        </mesh>

        {showLabelFor("Sirius B") && (
          <Html distanceFactor={14} position={[0, siriusBRadius + 11, 0]}>
            <div
              className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
              style={{
                fontSize: `${16.4 * labelScale}rem`,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={(e) => handleLabelClick(e, "Sirius B")}
            >
              Sirius B
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

export default SiriusSystem;
