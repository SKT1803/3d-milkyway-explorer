import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function CapellaSystem({
  showLabels = true,
  labelScale: _ignoredLabelScaleProp,
  focusedPlanetName,
  onPlanetLabelClick,
  onRegisterPlanetFocusApi,
}) {
  const { camera } = useThree();

  const systemRef = useRef(null);

  const giantsPairRef = useRef(null);
  const dwarfsPairRef = useRef(null);

  const aaGroupRef = useRef(null);
  const abGroupRef = useRef(null);
  const hGroupRef = useRef(null);
  const lGroupRef = useRef(null);

  const aaRef = useRef(null);
  const abRef = useRef(null);
  const hRef = useRef(null);
  const lRef = useRef(null);

  const aaMatRef = useRef(null);
  const abMatRef = useRef(null);
  const hMatRef = useRef(null);
  const lMatRef = useRef(null);

  const aaHaloRef = useRef(null);
  const abHaloRef = useRef(null);
  const hHaloRef = useRef(null);
  const lHaloRef = useRef(null);

  const giantAngleRef = useRef(0);
  const dwarfAngleRef = useRef(0);

  const [labelScale, setLabelScale] = useState(1);
  const [labelsVisibleByDistance, setLabelsVisibleByDistance] = useState(true);

  const [aaTex, abTex, hTex, lTex] = useTexture([
    "/textures/stars/capellaAa_orange.jpg",
    "/textures/stars/capellaAb_yellow.jpg",
    "/textures/stars/capellaH_red_dwarf.jpg",
    "/textures/stars/capellaH_red_dwarf.jpg",
  ]);

  [aaTex, abTex, hTex, lTex].forEach((t) => {
    if (t) t.colorSpace = THREE.SRGBColorSpace;
  });

  // =========================
  // Sizes
  // =========================
  const capellaAaRadius = 58;
  const capellaAbRadius = 44;
  const capellaHRadius = 9;
  const capellaLRadius = 8;

  const GIANTS_TILT_RAD = THREE.MathUtils.degToRad(40); // Aa/Ab orbit tilt
  const DWARFS_TILT_RAD = THREE.MathUtils.degToRad(0); // H/L orbit tilt

  const GIANTS_CENTER = useMemo(() => new THREE.Vector3(-1200, 0, 0), []);
  const DWARFS_CENTER = useMemo(() => new THREE.Vector3(1600, 1200, -300), []);

  const giantsBinaryOrbitRadius = 560;
  const giantsBinaryOrbitWidth = 2.5;

  const dwarfsBinaryOrbitRadius = 1000;
  const dwarfsBinaryOrbitWidth = 1.0;

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

  const aaHaloTexture = useMemo(
    () =>
      makeHaloTexture([
        { p: 0.0, c: "rgba(255, 235, 210, 1.00)" },
        { p: 0.12, c: "rgba(255, 170, 90, 0.82)" },
        { p: 0.32, c: "rgba(255, 125, 60, 0.46)" },
        { p: 0.6, c: "rgba(255, 95, 35, 0.20)" },
        { p: 1.0, c: "rgba(255, 70, 20, 0.00)" },
      ]),
    [],
  );

  const abHaloTexture = useMemo(
    () =>
      makeHaloTexture([
        { p: 0.0, c: "rgba(255, 248, 220, 1.00)" },
        { p: 0.12, c: "rgba(255, 220, 120, 0.78)" },
        { p: 0.32, c: "rgba(255, 190, 80, 0.40)" },
        { p: 0.6, c: "rgba(255, 165, 50, 0.18)" },
        { p: 1.0, c: "rgba(255, 145, 30, 0.00)" },
      ]),
    [],
  );

  const hHaloTexture = useMemo(
    () =>
      makeHaloTexture([
        { p: 0.0, c: "rgba(255, 220, 205, 1.00)" },
        { p: 0.14, c: "rgba(255, 130, 105, 0.62)" },
        { p: 0.34, c: "rgba(220, 80, 60, 0.34)" },
        { p: 0.62, c: "rgba(170, 45, 35, 0.16)" },
        { p: 1.0, c: "rgba(120, 20, 15, 0.00)" },
      ]),
    [],
  );

  const lHaloTexture = useMemo(
    () =>
      makeHaloTexture([
        { p: 0.0, c: "rgba(255, 230, 215, 1.00)" },
        { p: 0.14, c: "rgba(255, 150, 120, 0.58)" },
        { p: 0.34, c: "rgba(235, 95, 70, 0.30)" },
        { p: 0.62, c: "rgba(185, 55, 40, 0.14)" },
        { p: 1.0, c: "rgba(120, 20, 15, 0.00)" },
      ]),
    [],
  );

  // =========================
  // Orbit positions (binary)
  // =========================
  const updateGiantPositions = useCallback(
    (a) => {
      const x = giantsBinaryOrbitRadius * Math.cos(a);
      const z = giantsBinaryOrbitRadius * Math.sin(a);

      aaGroupRef.current?.position.set(x, 0, z);
      abGroupRef.current?.position.set(-x, 0, -z);
    },
    [giantsBinaryOrbitRadius],
  );

  const updateDwarfPositions = useCallback(
    (a) => {
      const x = dwarfsBinaryOrbitRadius * Math.cos(a);
      const z = dwarfsBinaryOrbitRadius * Math.sin(a);

      hGroupRef.current?.position.set(x, 0, z);
      lGroupRef.current?.position.set(-x, 0, -z);
    },
    [dwarfsBinaryOrbitRadius],
  );

  useEffect(() => {
    if (giantsPairRef.current)
      giantsPairRef.current.position.copy(GIANTS_CENTER);
    if (dwarfsPairRef.current)
      dwarfsPairRef.current.position.copy(DWARFS_CENTER);

    updateGiantPositions(giantAngleRef.current);
    updateDwarfPositions(dwarfAngleRef.current);
  }, [
    GIANTS_CENTER,
    DWARFS_CENTER,
    updateGiantPositions,
    updateDwarfPositions,
  ]);

  const getBodyDataByName = (name) => {
    switch (name) {
      case "Capella Aa":
        return { ref: aaRef, radius: capellaAaRadius };
      case "Capella Ab":
        return { ref: abRef, radius: capellaAbRadius };
      case "Capella H":
        return { ref: hRef, radius: capellaHRadius };
      case "Capella L":
        return { ref: lRef, radius: capellaLRadius };
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
    if (onRegisterPlanetFocusApi) onRegisterPlanetFocusApi(focusBodyByName);
  }, [onRegisterPlanetFocusApi, focusBodyByName]);

  const showLabelFor = (name) =>
    showLabels &&
    labelsVisibleByDistance &&
    (!focusedPlanetName || focusedPlanetName !== name);

  const handleLabelClick = (e, name) => {
    e.stopPropagation();
    focusBodyByName(name);
  };

  useFrame((_, delta) => {
    {
      const d = camera.position.length();
      const minDist = 1000;
      const maxDist = 5000;

      const t = THREE.MathUtils.clamp(
        (maxDist - d) / (maxDist - minDist),
        0,
        1,
      );
      const targetScale = 0.85 + t * 1.2;

      setLabelScale((prev) => {
        const lerped = THREE.MathUtils.lerp(prev, targetScale, 0.12);
        return Math.abs(lerped - prev) < 0.001 ? prev : lerped;
      });

      const shouldShow = d > 0 && d < 3000;
      setLabelsVisibleByDistance((prev) =>
        prev === shouldShow ? prev : shouldShow,
      );
    }

    const systemFocused =
      focusedPlanetName === "Capella Aa" ||
      focusedPlanetName === "Capella Ab" ||
      focusedPlanetName === "Capella H" ||
      focusedPlanetName === "Capella L";

    const giantSpeed = systemFocused ? 0 : 0.065;
    const dwarfSpeed = systemFocused ? 0 : 0.03;

    giantAngleRef.current += giantSpeed * delta;
    dwarfAngleRef.current += dwarfSpeed * delta;

    updateGiantPositions(giantAngleRef.current);
    updateDwarfPositions(dwarfAngleRef.current);

    // spins
    if (aaRef.current) aaRef.current.rotation.y += 0.08 * delta;
    if (abRef.current) abRef.current.rotation.y += 0.12 * delta;
    if (hRef.current) hRef.current.rotation.y += 0.18 * delta;
    if (lRef.current) lRef.current.rotation.y += 0.2 * delta;

    const t = performance.now() * 0.001;
    const pulseG = 0.55 + 0.45 * Math.sin(t * 0.9);
    const pulseD = 0.55 + 0.45 * Math.sin(t * 1.2 + 0.8);

    if (aaMatRef.current)
      aaMatRef.current.emissiveIntensity = 2.7 + pulseG * 1.2;
    if (abMatRef.current)
      abMatRef.current.emissiveIntensity = 2.1 + pulseG * 1.0;

    if (hMatRef.current)
      hMatRef.current.emissiveIntensity = 0.9 + pulseD * 0.45;
    if (lMatRef.current) lMatRef.current.emissiveIntensity = 1.0 + pulseD * 0.5;

    if (aaHaloRef.current) {
      const base = capellaAaRadius * 9.5;
      const k = 1.0 + pulseG * 0.14;
      aaHaloRef.current.scale.set(base * k, base * k, 1);
      const mat = aaHaloRef.current.material;
      if (mat) mat.opacity = 0.22 + pulseG * 0.28;
    }
    if (abHaloRef.current) {
      const base = capellaAbRadius * 9.0;
      const k = 1.0 + pulseG * 0.12;
      abHaloRef.current.scale.set(base * k, base * k, 1);
      const mat = abHaloRef.current.material;
      if (mat) mat.opacity = 0.18 + pulseG * 0.24;
    }
    if (hHaloRef.current) {
      const base = capellaHRadius * 26.0;
      const k = 1.0 + pulseD * 0.12;
      hHaloRef.current.scale.set(base * k, base * k, 1);
      const mat = hHaloRef.current.material;
      if (mat) mat.opacity = 0.12 + pulseD * 0.1;
    }
    if (lHaloRef.current) {
      const base = capellaLRadius * 26.0;
      const k = 1.0 + pulseD * 0.12;
      lHaloRef.current.scale.set(base * k, base * k, 1);
      const mat = lHaloRef.current.material;
      if (mat) mat.opacity = 0.12 + pulseD * 0.1;
    }
  });

  return (
    <group ref={systemRef}>
      {/* ========================= GIANTS PAIR (Aa/Ab) ========================= */}
      <group ref={giantsPairRef} rotation-z={GIANTS_TILT_RAD}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[
              giantsBinaryOrbitRadius - giantsBinaryOrbitWidth,
              giantsBinaryOrbitRadius + giantsBinaryOrbitWidth,
              160,
            ]}
          />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Aa */}
        <group ref={aaGroupRef}>
          <mesh ref={aaRef}>
            <sphereGeometry args={[capellaAaRadius, 128, 128]} />
            <meshStandardMaterial
              ref={aaMatRef}
              map={aaTex}
              emissiveMap={aaTex}
              roughness={0.26}
              metalness={0.1}
              emissive="#ff8a2a"
              emissiveIntensity={3.0}
              toneMapped={false}
            />
          </mesh>

          <sprite ref={aaHaloRef}>
            <spriteMaterial
              map={aaHaloTexture}
              transparent
              opacity={0.3}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </sprite>

          {showLabelFor("Capella Aa") && (
            <Html distanceFactor={14} position={[0, capellaAaRadius + 26, 0]}>
              <div
                className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                style={{
                  fontSize: `${25.2 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={(e) => handleLabelClick(e, "Capella Aa")}
              >
                Capella Aa
              </div>
            </Html>
          )}
        </group>

        {/* Ab */}
        <group ref={abGroupRef}>
          <mesh ref={abRef}>
            <sphereGeometry args={[capellaAbRadius, 128, 128]} />
            <meshStandardMaterial
              ref={abMatRef}
              map={abTex}
              emissiveMap={abTex}
              roughness={0.28}
              metalness={0.1}
              emissive="#ffd166"
              emissiveIntensity={2.4}
              toneMapped={false}
            />
          </mesh>

          <sprite ref={abHaloRef}>
            <spriteMaterial
              map={abHaloTexture}
              transparent
              opacity={0.26}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </sprite>

          {showLabelFor("Capella Ab") && (
            <Html distanceFactor={14} position={[0, capellaAbRadius + 22, 0]}>
              <div
                className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                style={{
                  fontSize: `${25.15 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={(e) => handleLabelClick(e, "Capella Ab")}
              >
                Capella Ab
              </div>
            </Html>
          )}
        </group>
      </group>

      {/* ========================= DWARFS PAIR (H/L) ========================= */}
      <group ref={dwarfsPairRef} rotation-z={DWARFS_TILT_RAD}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[
              dwarfsBinaryOrbitRadius - dwarfsBinaryOrbitWidth,
              dwarfsBinaryOrbitRadius + dwarfsBinaryOrbitWidth,
              180,
            ]}
          />
          <meshBasicMaterial
            color="#fb7185"
            transparent
            opacity={0.16}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* H */}
        <group ref={hGroupRef}>
          <mesh ref={hRef}>
            <sphereGeometry args={[capellaHRadius, 96, 96]} />
            <meshStandardMaterial
              ref={hMatRef}
              map={hTex}
              emissiveMap={hTex}
              roughness={0.35}
              metalness={0.06}
              emissive="#ff5a3a"
              emissiveIntensity={1.1}
              toneMapped={false}
            />
          </mesh>

          <sprite ref={hHaloRef}>
            <spriteMaterial
              map={hHaloTexture}
              transparent
              opacity={0.16}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </sprite>

          {showLabelFor("Capella H") && (
            <Html distanceFactor={14} position={[0, capellaHRadius + 14, 0]}>
              <div
                className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                style={{
                  fontSize: `${11.0 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={(e) => handleLabelClick(e, "Capella H")}
              >
                Capella H
              </div>
            </Html>
          )}
        </group>

        {/* L */}
        <group ref={lGroupRef}>
          <mesh ref={lRef}>
            <sphereGeometry args={[capellaLRadius, 96, 96]} />
            <meshStandardMaterial
              ref={lMatRef}
              map={lTex}
              emissiveMap={lTex}
              roughness={0.35}
              metalness={0.06}
              emissive="#ff6b4a"
              emissiveIntensity={1.2}
              toneMapped={false}
            />
          </mesh>

          <sprite ref={lHaloRef}>
            <spriteMaterial
              map={lHaloTexture}
              transparent
              opacity={0.16}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </sprite>

          {showLabelFor("Capella L") && (
            <Html distanceFactor={14} position={[0, capellaLRadius + 14, 0]}>
              <div
                className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                style={{
                  fontSize: `${11.0 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={(e) => handleLabelClick(e, "Capella L")}
              >
                Capella L
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}

export default CapellaSystem;
