import { useRef, useEffect, useCallback, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const BH_MODEL_URL = "/models/blackhole/scene.gltf";

export function SagittariusSystem({
  showLabels = true,
  labelScale: _ignoredLabelScaleProp,
  focusedPlanetName,
  onPlanetLabelClick,
  onRegisterPlanetFocusApi,
}) {
  const { camera } = useThree();
  const systemRef = useRef(null);

  // =========================
  // Core refs
  // =========================
  const bhRef = useRef(null);

  const bhGltf = useGLTF(BH_MODEL_URL);

  const s2GroupRef = useRef(null);
  const s38GroupRef = useRef(null);
  const s62GroupRef = useRef(null);
  const s0102GroupRef = useRef(null);

  const s2Ref = useRef(null);
  const s38Ref = useRef(null);
  const s62Ref = useRef(null);
  const s0102Ref = useRef(null);

  const s2AngleRef = useRef(0);
  const s38AngleRef = useRef(1.8);
  const s62AngleRef = useRef(3.2);
  const s0102AngleRef = useRef(0.9);

  const [labelScale, setLabelScale] = useState(1);
  const [labelsVisibleByDistance, setLabelsVisibleByDistance] = useState(true);

  // =========================
  // Sizes
  // =========================
  const BH_RADIUS = 90;

  const S2_RADIUS = 12;
  const S38_RADIUS = 10;
  const S62_RADIUS = 9;
  const S0102_RADIUS = 8;

  const S2_ORBIT = 900;
  const S38_ORBIT = 1200;
  const S62_ORBIT = 1500;
  const S0102_ORBIT = 780;

  // Tilts
  const S2_TILT = THREE.MathUtils.degToRad(35);
  const S38_TILT = THREE.MathUtils.degToRad(-18);
  const S62_TILT = THREE.MathUtils.degToRad(62);
  const S0102_TILT = THREE.MathUtils.degToRad(-42);

  // =========================
  // Focus rules
  // =========================
  const pauseS2 = focusedPlanetName === "S2";
  const pauseS38 = focusedPlanetName === "S38";
  const pauseS62 = focusedPlanetName === "S62";
  const pauseS0102 = focusedPlanetName === "S0-102";

  const pauseSystemDrift = !!focusedPlanetName;

  const [hotTex, redTex] = useTexture([
    "/textures/stars/antares_b.jpg",
    "/textures/stars/capellaH_red_dwarf.jpg",
  ]);

  [hotTex, redTex].forEach((t) => {
    if (t) t.colorSpace = THREE.SRGBColorSpace;
  });

  // =========================
  // (Opsiyonel) GLTF material ayarı
  // =========================
  useEffect(() => {
    if (!bhGltf?.scene) return;
    bhGltf.scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = false;
        obj.receiveShadow = false;
        // Eğer model karanlık/garip görünürse:
        // obj.material.toneMapped = false;
      }
    });
  }, [bhGltf]);

  // =========================
  // Focus API
  // =========================
  const getBodyDataByName = (name) => {
    switch (name) {
      case "Sagittarius A*":
        return { ref: bhRef, radius: BH_RADIUS };
      case "S2":
        return { ref: s2Ref, radius: S2_RADIUS };
      case "S38":
        return { ref: s38Ref, radius: S38_RADIUS };
      case "S62":
        return { ref: s62Ref, radius: S62_RADIUS };
      case "S0-102":
        return { ref: s0102Ref, radius: S0102_RADIUS };
      default:
        return null;
    }
  };

  const focusBodyByName = useCallback(
    (name) => {
      if (!onPlanetLabelClick) return;
      const data = getBodyDataByName(name);
      if (!data?.ref?.current) return;

      const wp = new THREE.Vector3();
      data.ref.current.getWorldPosition(wp);
      onPlanetLabelClick(name, [wp.x, wp.y, wp.z], data.radius);
    },
    [onPlanetLabelClick],
  );

  useEffect(() => {
    onRegisterPlanetFocusApi?.(focusBodyByName);
  }, [onRegisterPlanetFocusApi, focusBodyByName]);

  const showLabelFor = (name) =>
    showLabels &&
    labelsVisibleByDistance &&
    (!focusedPlanetName || focusedPlanetName !== name);

  const handleLabelClick = (e, name) => {
    e.stopPropagation();
    focusBodyByName(name);
  };

  const setOrbit = (groupRef, r, a) => {
    if (!groupRef.current) return;
    const x = r * Math.cos(a);
    const z = r * Math.sin(a);
    groupRef.current.position.set(x, 0, z);
  };

  useFrame((_, delta) => {
    {
      const d = camera.position.length();
      const minDist = 1200;
      const maxDist = 12000;
      const t = THREE.MathUtils.clamp(
        (maxDist - d) / (maxDist - minDist),
        0,
        1,
      );
      const targetScale = 0.85 + t * 2.2;

      setLabelScale((prev) => {
        const lerped = THREE.MathUtils.lerp(prev, targetScale, 0.12);
        return Math.abs(lerped - prev) < 0.001 ? prev : lerped;
      });

      const shouldShow = d > 0 && d < 3000;
      setLabelsVisibleByDistance((prev) =>
        prev === shouldShow ? prev : shouldShow,
      );
    }

    const s2Speed = pauseS2 ? 0 : 0.22;
    const s38Speed = pauseS38 ? 0 : 0.14;
    const s62Speed = pauseS62 ? 0 : 0.1;
    const s0102Speed = pauseS0102 ? 0 : 0.26;

    s2AngleRef.current += s2Speed * delta;
    s38AngleRef.current += s38Speed * delta;
    s62AngleRef.current += s62Speed * delta;
    s0102AngleRef.current += s0102Speed * delta;

    setOrbit(s2GroupRef, S2_ORBIT, s2AngleRef.current);
    setOrbit(s38GroupRef, S38_ORBIT, s38AngleRef.current);
    setOrbit(s62GroupRef, S62_ORBIT, s62AngleRef.current);
    setOrbit(s0102GroupRef, S0102_ORBIT, s0102AngleRef.current);

    if (systemRef.current && !pauseSystemDrift) {
      systemRef.current.rotation.y += 0.0012 * delta;
    }

    // Spin orbiters
    if (s2Ref.current) s2Ref.current.rotation.y += 0.35 * delta;
    if (s38Ref.current) s38Ref.current.rotation.y += 0.42 * delta;
    if (s62Ref.current) s62Ref.current.rotation.y += 0.48 * delta;
    if (s0102Ref.current) s0102Ref.current.rotation.y += 0.44 * delta;

    if (bhRef.current) {
      bhRef.current.rotation.y += 0.8 * delta;
    }
  });

  const BH_MODEL_SCALE = 250;

  return (
    <group ref={systemRef}>
      {/* ========================= BLACK HOLE (GLTF MODEL) ========================= */}
      <group>
        <group ref={bhRef} position={[0, 0, 0]} scale={BH_MODEL_SCALE}>
          <primitive object={bhGltf.scene} />
        </group>

        {showLabelFor("Sagittarius A*") && (
          <Html distanceFactor={14} position={[0, BH_RADIUS + 250, 0]}>
            <div
              className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
              style={{
                fontSize: `${18.0 * labelScale}rem`,
                cursor: "pointer",
                whiteSpace: "nowrap",
                pointerEvents: "auto",
              }}
              onClick={(e) => handleLabelClick(e, "Sagittarius A*")}
            >
              Sagittarius A*
            </div>
          </Html>
        )}
      </group>

      {/* ========================= ORBITS ========================= */}
      {/* S2 orbit plane */}
      <group rotation-z={S2_TILT}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[S2_ORBIT - 4, S2_ORBIT + 4, 200]} />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.14}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <group ref={s2GroupRef}>
          <mesh ref={s2Ref}>
            <sphereGeometry args={[S2_RADIUS, 96, 96]} />
            <meshStandardMaterial
              map={hotTex}
              emissiveMap={hotTex}
              emissive="#bfe7ff"
              emissiveIntensity={2.0}
              roughness={0.28}
              metalness={0.15}
              toneMapped={false}
            />
          </mesh>

          {showLabelFor("S2") && (
            <Html distanceFactor={14} position={[0, S2_RADIUS + 22, 0]}>
              <div
                className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                style={{
                  fontSize: `${12.0 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  pointerEvents: "auto",
                }}
                onClick={(e) => handleLabelClick(e, "S2")}
              >
                S2
              </div>
            </Html>
          )}
        </group>
      </group>

      {/* S38 orbit plane */}
      <group rotation-z={S38_TILT}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[S38_ORBIT - 4, S38_ORBIT + 4, 220]} />
          <meshBasicMaterial
            color="#93c5fd"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <group ref={s38GroupRef}>
          <mesh ref={s38Ref}>
            <sphereGeometry args={[S38_RADIUS, 96, 96]} />
            <meshStandardMaterial
              map={redTex}
              emissiveMap={redTex}
              emissive="#ff6b4a"
              emissiveIntensity={1.25}
              roughness={0.36}
              metalness={0.08}
              toneMapped={false}
            />
          </mesh>

          {showLabelFor("S38") && (
            <Html distanceFactor={14} position={[0, S38_RADIUS + 20, 0]}>
              <div
                className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                style={{
                  fontSize: `${11.0 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  pointerEvents: "auto",
                }}
                onClick={(e) => handleLabelClick(e, "S38")}
              >
                S38
              </div>
            </Html>
          )}
        </group>
      </group>

      {/* S62 orbit plane */}
      <group rotation-z={S62_TILT}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[S62_ORBIT - 4, S62_ORBIT + 4, 240]} />
          <meshBasicMaterial
            color="#93c5fd"
            transparent
            opacity={0.09}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <group ref={s62GroupRef}>
          <mesh ref={s62Ref}>
            <sphereGeometry args={[S62_RADIUS, 96, 96]} />
            <meshStandardMaterial
              map={hotTex}
              emissiveMap={hotTex}
              emissive="#a9dcff"
              emissiveIntensity={1.6}
              roughness={0.3}
              metalness={0.12}
              toneMapped={false}
            />
          </mesh>

          {showLabelFor("S62") && (
            <Html distanceFactor={14} position={[0, S62_RADIUS + 18, 0]}>
              <div
                className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                style={{
                  fontSize: `${10.5 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  pointerEvents: "auto",
                }}
                onClick={(e) => handleLabelClick(e, "S62")}
              >
                S62
              </div>
            </Html>
          )}
        </group>
      </group>

      {/* S0-102 orbit plane */}
      <group rotation-z={S0102_TILT}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[S0102_ORBIT - 3, S0102_ORBIT + 3, 200]} />
          <meshBasicMaterial
            color="#a78bfa"
            transparent
            opacity={0.11}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <group ref={s0102GroupRef}>
          <mesh ref={s0102Ref}>
            <sphereGeometry args={[S0102_RADIUS, 96, 96]} />
            <meshStandardMaterial
              map={hotTex}
              emissiveMap={hotTex}
              emissive="#d9f2ff"
              emissiveIntensity={1.35}
              roughness={0.32}
              metalness={0.1}
              toneMapped={false}
            />
          </mesh>

          {showLabelFor("S0-102") && (
            <Html distanceFactor={14} position={[0, S0102_RADIUS + 18, 0]}>
              <div
                className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                style={{
                  fontSize: `${10.5 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  pointerEvents: "auto",
                }}
                onClick={(e) => handleLabelClick(e, "S0-102")}
              >
                S0-102
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(BH_MODEL_URL);

export default SagittariusSystem;
