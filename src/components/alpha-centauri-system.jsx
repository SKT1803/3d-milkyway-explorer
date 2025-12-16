import { useRef, useEffect, useCallback, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

const INNER_TILT_RAD = THREE.MathUtils.degToRad(28); // Rigil + Toliman düzlemi
const OUTER_TILT_RAD = THREE.MathUtils.degToRad(-6); // Proxima düzlemi

export function AlphaCentauriSystem({
  showLabels = true,
  labelScale: _ignoredLabelScaleProp,
  focusedPlanetName,
  onPlanetLabelClick,
  onRegisterPlanetFocusApi,
}) {
  const { camera } = useThree();

  const systemRef = useRef(null);

  const rigilGroupRef = useRef(null);
  const tolimanGroupRef = useRef(null);
  const proximaGroupRef = useRef(null);

  const rigilRef = useRef(null);
  const tolimanRef = useRef(null);
  const proximaRef = useRef(null);

  const angleRef = useRef(0);

  const [labelScale, setLabelScale] = useState(1);
  const [labelsVisibleByDistance, setLabelsVisibleByDistance] = useState(true);

  const [rigilTex, tolimanTex, proximaTex] = useTexture([
    "/textures/stars/rigil_kentaurus.jpg",
    "/textures/stars/toliman.jpg",
    "/textures/stars/proxima_centauri.jpg",
  ]);

  [rigilTex, tolimanTex, proximaTex].forEach((t) => {
    if (t) t.colorSpace = THREE.SRGBColorSpace;
  });

  // Gövde boyutları
  const rigilRadius = 42;
  const tolimanRadius = 37;
  const proximaRadius = 10;

  // Orbit yarıçapları
  const innerOrbitRadius = 420;
  const innerOrbitWidth = 4;

  const outerOrbitRadius = 1350;
  const outerOrbitWidth = 6;

  const updatePositions = useCallback(
    (a) => {
      // A/B aynı iç halkada 180° zıt
      const ax = innerOrbitRadius * Math.cos(a);
      const az = innerOrbitRadius * Math.sin(a);
      const bx = innerOrbitRadius * Math.cos(a + Math.PI);
      const bz = innerOrbitRadius * Math.sin(a + Math.PI);

      if (rigilGroupRef.current) {
        rigilGroupRef.current.position.set(ax, 0, az);
      }
      if (tolimanGroupRef.current) {
        tolimanGroupRef.current.position.set(bx, 0, bz);
      }

      // Proxima daha geniş ve daha yavaş bir orbitte
      const orbitSpeedInner = 0.12;
      const orbitSpeedOuter = 0.018;
      const ratio = orbitSpeedOuter / Math.max(orbitSpeedInner, 0.0001);
      const bAngle = a * ratio;
      const px = outerOrbitRadius * Math.cos(bAngle);
      const pz = outerOrbitRadius * Math.sin(bAngle);

      if (proximaGroupRef.current) {
        proximaGroupRef.current.position.set(px, 0, pz);
      }
    },
    [innerOrbitRadius, outerOrbitRadius]
  );

  useEffect(() => {
    updatePositions(angleRef.current);
  }, [updatePositions]);

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

      // çok yakında / çok uzakta label gizle
      const shouldShow = d > 0 && d < 1200;
      setLabelsVisibleByDistance((prev) =>
        prev === shouldShow ? prev : shouldShow
      );
    }

    const alphaFocused =
      focusedPlanetName === "Rigil Kentaurus" ||
      focusedPlanetName === "Toliman" ||
      focusedPlanetName === "Proxima Centauri";

    const orbitSpeedInner = alphaFocused ? 0 : 0.12;
    const globalSpinSpeed = alphaFocused ? 0 : 0.01;

    angleRef.current += orbitSpeedInner * delta;
    updatePositions(angleRef.current);

    // Kendi ekseninde dönüşler
    if (rigilRef.current) rigilRef.current.rotation.y += 0.45 * delta;
    if (tolimanRef.current) tolimanRef.current.rotation.y += 0.5 * delta;
    if (proximaRef.current) proximaRef.current.rotation.y += 0.65 * delta;

    // Tüm sistemi hafifçe döndür (y ekseni etrafında)
    if (systemRef.current) {
      systemRef.current.rotation.y += globalSpinSpeed * delta;
    }
  });

  const showLabelFor = (name) =>
    showLabels &&
    labelsVisibleByDistance &&
    (!focusedPlanetName || focusedPlanetName !== name);

  // Info Panel’den fokus için lookup
  const getBodyDataByName = (name) => {
    switch (name) {
      case "Rigil Kentaurus":
        return { ref: rigilRef, radius: rigilRadius };
      case "Toliman":
        return { ref: tolimanRef, radius: tolimanRadius };
      case "Proxima Centauri":
        return { ref: proximaRef, radius: proximaRadius };
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
    <group ref={systemRef}>
      <group rotation-z={INNER_TILT_RAD}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[
              innerOrbitRadius - innerOrbitWidth,
              innerOrbitRadius + innerOrbitWidth,
              128,
            ]}
          />
          <meshBasicMaterial
            color="#ffcc80"
            transparent
            opacity={0.34}
            side={THREE.DoubleSide}
          />
        </mesh>

        <group ref={rigilGroupRef}>
          <mesh ref={rigilRef}>
            <sphereGeometry args={[rigilRadius, 128, 128]} />
            <meshStandardMaterial
              map={rigilTex}
              roughness={0.32}
              metalness={0.3}
              emissive="#ffd9a3"
              emissiveIntensity={2.2}
              emissiveMap={rigilTex}
              toneMapped={false}
            />
          </mesh>

          {showLabelFor("Rigil Kentaurus") && (
            <Html distanceFactor={14} position={[0, rigilRadius + 18, 0]}>
              <div
                className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                style={{
                  fontSize: `${22.1 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={(e) => handleLabelClick(e, "Rigil Kentaurus")}
              >
                Rigil Kentaurus
              </div>
            </Html>
          )}
        </group>

        <group ref={tolimanGroupRef}>
          <mesh ref={tolimanRef}>
            <sphereGeometry args={[tolimanRadius, 96, 96]} />
            <meshStandardMaterial
              map={tolimanTex}
              roughness={0.35}
              metalness={0.25}
              emissive="#ffe9c5"
              emissiveIntensity={1.8}
              emissiveMap={tolimanTex}
              toneMapped={false}
            />
          </mesh>

          {showLabelFor("Toliman") && (
            <Html distanceFactor={14} position={[0, tolimanRadius + 14, 0]}>
              <div
                className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                style={{
                  fontSize: `${22.0 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={(e) => handleLabelClick(e, "Toliman")}
              >
                Toliman
              </div>
            </Html>
          )}
        </group>
      </group>

      <group rotation-z={OUTER_TILT_RAD}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[
              outerOrbitRadius - outerOrbitWidth,
              outerOrbitRadius + outerOrbitWidth,
              128,
            ]}
          />
          <meshBasicMaterial
            color="#ff7043"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        <group ref={proximaGroupRef}>
          <mesh ref={proximaRef}>
            <sphereGeometry args={[proximaRadius, 96, 96]} />
            <meshStandardMaterial
              map={proximaTex}
              roughness={0.5}
              metalness={0.2}
              emissive="#ff8a65"
              emissiveIntensity={1.6}
              emissiveMap={proximaTex}
              toneMapped={false}
            />
          </mesh>

          {showLabelFor("Proxima Centauri") && (
            <Html distanceFactor={14} position={[0, proximaRadius + 10, 0]}>
              <div
                className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                style={{
                  fontSize: `${10.95 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={(e) => handleLabelClick(e, "Proxima Centauri")}
              >
                Proxima Centauri
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}

export default AlphaCentauriSystem;
