import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

const INNER_TILT_RAD = THREE.MathUtils.degToRad(28);
const OUTER_TILT_RAD = THREE.MathUtils.degToRad(-6);

const ORBIT_SPEED_INNER = 0.12;
const ORBIT_SPEED_OUTER = 0.018;
const OUTER_RATIO = ORBIT_SPEED_OUTER / ORBIT_SPEED_INNER;

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

  const rigilMatRef = useRef(null);
  const tolimanMatRef = useRef(null);
  const proximaMatRef = useRef(null);

  const rigilHaloRef = useRef(null);
  const tolimanHaloRef = useRef(null);
  const proximaHaloRef = useRef(null);

  const angleRef = useRef(0);

  const [labelScale, setLabelScale] = useState(1);
  const [labelsVisibleByDistance, setLabelsVisibleByDistance] = useState(true);

  const [rigilTex, tolimanTex, proximaTex] = useTexture([
    "/textures/stars/capellaAb_yellow.jpg",
    "/textures/stars/capellaAa_orange.jpg",
    "/textures/stars/capellaH_red_dwarf.jpg",
  ]);

  useEffect(() => {
    [rigilTex, tolimanTex, proximaTex].forEach((t) => {
      if (t) t.colorSpace = THREE.SRGBColorSpace;
    });
  }, [rigilTex, tolimanTex, proximaTex]);

  const rigilRadius = 42;
  const tolimanRadius = 37;
  const proximaRadius = 10;

  const innerOrbitRadius = 500;
  const innerOrbitWidth = 4;

  const outerOrbitRadius = 1800;
  const outerOrbitWidth = 1;

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

  const warmHaloTex = useMemo(
    () =>
      makeHaloTexture([
        { p: 0.0, c: "rgba(255, 250, 235, 1.00)" },
        { p: 0.12, c: "rgba(255, 235, 190, 0.86)" },
        { p: 0.32, c: "rgba(255, 200, 120, 0.50)" },
        { p: 0.58, c: "rgba(255, 150, 80, 0.22)" },
        { p: 1.0, c: "rgba(140, 60, 20, 0.00)" },
      ]),
    [],
  );

  const redHaloTex = useMemo(
    () =>
      makeHaloTexture([
        { p: 0.0, c: "rgba(255, 210, 200, 1.00)" },
        { p: 0.14, c: "rgba(255, 120, 100, 0.55)" },
        { p: 0.34, c: "rgba(210, 70, 55, 0.28)" },
        { p: 0.62, c: "rgba(140, 35, 28, 0.12)" },
        { p: 1.0, c: "rgba(90, 18, 12, 0.00)" },
      ]),
    [],
  );

  const updatePositions = useCallback(
    (a) => {
      const ax = innerOrbitRadius * Math.cos(a);
      const az = innerOrbitRadius * Math.sin(a);
      const bx = innerOrbitRadius * Math.cos(a + Math.PI);
      const bz = innerOrbitRadius * Math.sin(a + Math.PI);

      rigilGroupRef.current?.position.set(ax, 0, az);
      tolimanGroupRef.current?.position.set(bx, 0, bz);

      const pAngle = a * OUTER_RATIO;
      const px = outerOrbitRadius * Math.cos(pAngle);
      const pz = outerOrbitRadius * Math.sin(pAngle);

      proximaGroupRef.current?.position.set(px, 0, pz);
    },
    [innerOrbitRadius, outerOrbitRadius],
  );

  useEffect(() => {
    updatePositions(angleRef.current);
  }, [updatePositions]);

  useFrame((_, delta) => {
    {
      const d = camera.position.length();
      const minDist = 1160;
      const maxDist = 4500;

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

      const shouldShow = d > 0 && d < 2500;
      setLabelsVisibleByDistance((prev) =>
        prev === shouldShow ? prev : shouldShow,
      );
    }

    const alphaFocused =
      focusedPlanetName === "Rigil Kentaurus" ||
      focusedPlanetName === "Toliman" ||
      focusedPlanetName === "Proxima Centauri";

    const orbitSpeedInner = alphaFocused ? 0 : ORBIT_SPEED_INNER;
    const globalSpinSpeed = alphaFocused ? 0 : 0.01;

    angleRef.current += orbitSpeedInner * delta;
    updatePositions(angleRef.current);

    if (rigilRef.current) rigilRef.current.rotation.y += 0.45 * delta;
    if (tolimanRef.current) tolimanRef.current.rotation.y += 0.5 * delta;
    if (proximaRef.current) proximaRef.current.rotation.y += 0.65 * delta;

    if (systemRef.current)
      systemRef.current.rotation.y += globalSpinSpeed * delta;

    const t = performance.now() * 0.001;

    const pulseA = 0.55 + 0.45 * Math.sin(t * 0.95);
    const pulseB = 0.55 + 0.45 * Math.sin(t * 1.15 + 0.8);
    const pulseC = 0.55 + 0.45 * Math.sin(t * 1.35 + 1.6);

    if (rigilMatRef.current)
      rigilMatRef.current.emissiveIntensity = 4.2 + pulseA * 2.2;
    if (tolimanMatRef.current)
      tolimanMatRef.current.emissiveIntensity = 1.35 + pulseB * 0.75;
    if (proximaMatRef.current)
      proximaMatRef.current.emissiveIntensity = 0.35 + pulseC * 0.22;

    const pulseHalo = (ref, base, p, o0, oAmp) => {
      if (!ref.current) return;
      const k = 1.0 + p * 0.14;
      ref.current.scale.set(base * k, base * k, 1);
      const mat = ref.current.material;
      if (mat) mat.opacity = o0 + p * oAmp;
    };

    pulseHalo(rigilHaloRef, rigilRadius * 11.5, pulseA, 0.26, 0.34);
    pulseHalo(tolimanHaloRef, tolimanRadius * 10.0, pulseB, 0.16, 0.2);
    pulseHalo(proximaHaloRef, proximaRadius * 28.0, pulseC, 0.06, 0.06);
  });

  const showLabelFor = (name) =>
    showLabels &&
    labelsVisibleByDistance &&
    (!focusedPlanetName || focusedPlanetName !== name);

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

  const handleLabelClick = (e, name) => {
    e.stopPropagation();
    focusBodyByName(name);
  };

  return (
    <group ref={systemRef}>
      {/* ===================== INNER (A/B) ===================== */}
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

        {/* Rigil Kentaurus (A) */}
        <group ref={rigilGroupRef}>
          <mesh ref={rigilRef}>
            <sphereGeometry args={[rigilRadius, 128, 128]} />
            <meshStandardMaterial
              ref={rigilMatRef}
              map={rigilTex}
              emissiveMap={rigilTex}
              roughness={0.32}
              metalness={0.3}
              emissive="#fff0cc"
              emissiveIntensity={4.6}
              toneMapped={false}
            />
          </mesh>

          <sprite ref={rigilHaloRef}>
            <spriteMaterial
              map={warmHaloTex}
              transparent
              opacity={0.28}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </sprite>

          {showLabelFor("Rigil Kentaurus") && (
            <Html distanceFactor={14} position={[0, rigilRadius + 24, 0]}>
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

        {/* Toliman (B) */}
        <group ref={tolimanGroupRef}>
          <mesh ref={tolimanRef}>
            <sphereGeometry args={[tolimanRadius, 96, 96]} />
            <meshStandardMaterial
              ref={tolimanMatRef}
              map={tolimanTex}
              emissiveMap={tolimanTex}
              roughness={0.35}
              metalness={0.25}
              emissive="#fff6df"
              emissiveIntensity={1.6}
              toneMapped={false}
            />
          </mesh>

          <sprite ref={tolimanHaloRef}>
            <spriteMaterial
              map={warmHaloTex}
              transparent
              opacity={0.18}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </sprite>

          {showLabelFor("Toliman") && (
            <Html distanceFactor={14} position={[0, tolimanRadius + 18, 0]}>
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

      {/* ===================== OUTER (Proxima) ===================== */}
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
              ref={proximaMatRef}
              map={proximaTex}
              emissiveMap={proximaTex}
              roughness={0.5}
              metalness={0.2}
              emissive="#ff6a4a"
              emissiveIntensity={0.45}
              toneMapped={false}
            />
          </mesh>

          <sprite ref={proximaHaloRef}>
            <spriteMaterial
              map={redHaloTex}
              transparent
              opacity={0.07}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </sprite>

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
