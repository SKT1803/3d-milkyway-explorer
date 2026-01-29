import { useRef, useEffect, useCallback, useState, useMemo } from "react";
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

  const siriusAMatRef = useRef(null);
  const siriusBMatRef = useRef(null);
  const siriusAHaloRef = useRef(null);
  const siriusBHaloRef = useRef(null);

  const angleRef = useRef(0);

  const [labelScale, setLabelScale] = useState(1);
  const [labelsVisibleByDistance, setLabelsVisibleByDistance] = useState(true);

  const [siriusTex] = useTexture(["/textures/stars/sirius.jpg"]);
  useEffect(() => {
    if (siriusTex) siriusTex.colorSpace = THREE.SRGBColorSpace;
  }, [siriusTex]);

  const siriusARadius = 40;
  const siriusBRadius = 6;

  const orbitRadius = 500;
  const orbitWidth = 1.25;

  const makeHaloTexture = (stops) => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );

    for (const s of stops) g.addColorStop(s.p, s.c);

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  };

  const siriusHaloTex = useMemo(
    () =>
      makeHaloTexture([
        { p: 0.0, c: "rgba(240, 252, 255, 1.00)" },
        { p: 0.12, c: "rgba(170, 235, 255, 0.88)" },
        { p: 0.32, c: "rgba(90, 175, 255, 0.52)" },
        { p: 0.58, c: "rgba(35, 110, 255, 0.24)" },
        { p: 1.0, c: "rgba(10, 40, 140, 0.00)" },
      ]),
    [],
  );

  const updatePositions = useCallback(
    (a) => {
      const ax = orbitRadius * Math.cos(a);
      const az = orbitRadius * Math.sin(a);
      const bx = orbitRadius * Math.cos(a + Math.PI);
      const bz = orbitRadius * Math.sin(a + Math.PI);

      siriusAGroupRef.current?.position.set(ax, 0, az);
      siriusBGroupRef.current?.position.set(bx, 0, bz);
    },
    [orbitRadius],
  );

  useEffect(() => {
    updatePositions(angleRef.current);
  }, [updatePositions]);

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

  useFrame((_, delta) => {
    {
      const d = camera.position.length();
      const minDist = 160;
      const maxDist = 800;

      const t = THREE.MathUtils.clamp(
        (maxDist - d) / (maxDist - minDist),
        0,
        1,
      );
      const targetScale = 0.8 + t * 1.2;

      setLabelScale((prev) => {
        const lerped = THREE.MathUtils.lerp(prev, targetScale, 0.12);
        return Math.abs(lerped - prev) < 0.001 ? prev : lerped;
      });

      const shouldShow = d > 0 && d < 1200;
      setLabelsVisibleByDistance((prev) =>
        prev === shouldShow ? prev : shouldShow,
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

    if (systemRef.current)
      systemRef.current.rotation.y += globalSpinSpeed * delta;

    // =========================
    // Parlaklık (breathing + halo pulse)
    // Sirius A >>> Sirius B
    // =========================
    const t = performance.now() * 0.001;
    const pulseA = 0.55 + 0.45 * Math.sin(t * 0.95);
    const pulseB = 0.55 + 0.45 * Math.sin(t * 1.25 + 1.1);

    // emissive (A çok daha parlak)
    if (siriusAMatRef.current)
      siriusAMatRef.current.emissiveIntensity = 3.4 + pulseA * 1.6;
    if (siriusBMatRef.current)
      siriusBMatRef.current.emissiveIntensity = 1.15 + pulseB * 0.55;

    const pulseHalo = (ref, base, p, o0, oAmp) => {
      if (!ref.current) return;
      const k = 1.0 + p * 0.14;
      ref.current.scale.set(base * k, base * k, 1);
      const mat = ref.current.material;
      if (mat) mat.opacity = o0 + p * oAmp;
    };

    // A, B halo
    pulseHalo(siriusAHaloRef, siriusARadius * 11.0, pulseA, 0.24, 0.3);
    pulseHalo(siriusBHaloRef, siriusBRadius * 32.0, pulseB, 0.12, 0.12);
  });

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

      {/* ===================== SIRIUS A ===================== */}
      <group ref={siriusAGroupRef}>
        <mesh ref={siriusARef}>
          <sphereGeometry args={[siriusARadius, 128, 128]} />
          <meshStandardMaterial
            ref={siriusAMatRef}
            map={siriusTex}
            emissiveMap={siriusTex}
            roughness={0.32}
            metalness={0.22}
            emissive="#c7f0ff"
            emissiveIntensity={3.8}
            toneMapped={false}
          />
        </mesh>
        <sprite ref={siriusAHaloRef}>
          <spriteMaterial
            map={siriusHaloTex}
            transparent
            opacity={0.26}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>

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

      {/* ===================== SIRIUS B ===================== */}
      <group ref={siriusBGroupRef}>
        <mesh ref={siriusBRef}>
          <sphereGeometry args={[siriusBRadius, 96, 96]} />
          <meshStandardMaterial
            ref={siriusBMatRef}
            map={siriusTex}
            emissiveMap={siriusTex}
            roughness={0.38}
            metalness={0.18}
            emissive="#b8eaff"
            emissiveIntensity={1.25}
            toneMapped={false}
          />
        </mesh>

        <sprite ref={siriusBHaloRef}>
          <spriteMaterial
            map={siriusHaloTex}
            transparent
            opacity={0.14}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>

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
