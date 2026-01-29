import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

const AB_WIDE_TILT_RAD = THREE.MathUtils.degToRad(16); // A grubu <-> B grubu wide orbit
const A_MINI_TILT_RAD = THREE.MathUtils.degToRad(32); // Aa <-> Ab mini orbit
const B_MINI_TILT_RAD = THREE.MathUtils.degToRad(-24); // Ba <-> Bb mini orbit

// YY Gem bağımsız subsystem: sadece kendi içinde orbit tilt
const YYGEM_PAIR_TILT_RAD = THREE.MathUtils.degToRad(6);
const C_MINI_TILT_RAD = THREE.MathUtils.degToRad(28); // Ca <-> Cb mini orbit

export function CastorSystem({
  showLabels = true,
  labelScale: _ignoredLabelScaleProp,
  focusedPlanetName,
  onPlanetLabelClick,
  onRegisterPlanetFocusApi,
}) {
  const { camera } = useThree();

  const systemRef = useRef(null);

  const abWidePlaneRef = useRef(null);
  const aBaryRef = useRef(null);
  const bBaryRef = useRef(null);

  const aMiniPlaneRef = useRef(null);
  const aaGroupRef = useRef(null);
  const abGroupRef = useRef(null);

  const bMiniPlaneRef = useRef(null);
  const baGroupRef = useRef(null);
  const bbGroupRef = useRef(null);

  const yyGemPairRef = useRef(null);
  const cMiniPlaneRef = useRef(null);
  const caGroupRef = useRef(null);
  const cbGroupRef = useRef(null);

  const aaRef = useRef(null);
  const abRef = useRef(null);
  const baRef = useRef(null);
  const bbRef = useRef(null);
  const caRef = useRef(null);
  const cbRef = useRef(null);

  const aaMatRef = useRef(null);
  const abMatRef = useRef(null);
  const baMatRef = useRef(null);
  const bbMatRef = useRef(null);
  const caMatRef = useRef(null);
  const cbMatRef = useRef(null);

  const aaHaloRef = useRef(null);
  const abHaloRef = useRef(null);
  const baHaloRef = useRef(null);
  const bbHaloRef = useRef(null);
  const caHaloRef = useRef(null);
  const cbHaloRef = useRef(null);

  const wideAngleRef = useRef(0);
  const aMiniAngleRef = useRef(0);
  const bMiniAngleRef = useRef(0);
  const cMiniAngleRef = useRef(0);

  const [labelScale, setLabelScale] = useState(1);
  const [labelsVisibleByDistance, setLabelsVisibleByDistance] = useState(true);

  // =========================
  // TEXTURES
  // =========================
  const [aaTex, abTex, baTex, bbTex, caTex, cbTex] = useTexture([
    "/textures/stars/antares_b.jpg", // Aa (blue)
    "/textures/stars/capellaH_red_dwarf.jpg", // Ab (red dwarf)
    "/textures/stars/antares_b.jpg", // Ba (blue)
    "/textures/stars/capellaH_red_dwarf.jpg", // Bb (red dwarf)
    "/textures/stars/capellaH_red_dwarf.jpg", // Ca (red dwarf)
    "/textures/stars/capellaH_red_dwarf.jpg", // Cb (red dwarf)
  ]);

  [aaTex, abTex, baTex, bbTex, caTex, cbTex].forEach((t) => {
    if (t) t.colorSpace = THREE.SRGBColorSpace;
  });

  // =========================
  // SIZES
  // =========================
  const rAa = 42;
  //   const rAb = 36;
  const rAb = 12;

  const rBa = 40;
  //   const rBb = 30;
  const rBb = 12;

  //   const rCa = 10;
  //   const rCb = 9;

  const rCa = 15;
  const rCb = 13;

  // =========================
  // ORBIT RADII
  // =========================
  // A<->B wide orbit
  const abWideRadius = 2000;
  const abWideWidth = 6;

  // A mini orbit
  const aMiniRadius = 420;
  const aMiniWidth = 3;

  // B mini orbit
  const bMiniRadius = 360;
  const bMiniWidth = 3;

  // YY Gem subsystem distance (AB’ye bağlı orbit yok ama uzak dursun)
  const yyGemDistance = 2000;

  // C mini orbit (Ca<->Cb)
  const cMiniRadius = 180;
  const cMiniWidth = 2.2;

  // YY Gem sabit merkezi
  const YYGEM_CENTER = useMemo(
    () => new THREE.Vector3(0, 1500, yyGemDistance),
    [yyGemDistance],
  );

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

  const hotHaloTex = useMemo(
    () =>
      makeHaloTexture([
        { p: 0.0, c: "rgba(235, 250, 255, 1.00)" },
        { p: 0.12, c: "rgba(160, 225, 255, 0.82)" },
        { p: 0.32, c: "rgba(80, 160, 255, 0.44)" },
        { p: 0.6, c: "rgba(30, 90, 255, 0.20)" },
        { p: 1.0, c: "rgba(10, 30, 120, 0.00)" },
      ]),
    [],
  );

  const redHaloTex = useMemo(
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

  const updateWideAB = useCallback(
    (a) => {
      const ax = abWideRadius * Math.cos(a);
      const az = abWideRadius * Math.sin(a);

      const bx = abWideRadius * Math.cos(a + Math.PI);
      const bz = abWideRadius * Math.sin(a + Math.PI);

      aBaryRef.current?.position.set(ax, 0, az);
      bBaryRef.current?.position.set(bx, 0, bz);
    },
    [abWideRadius],
  );

  const updateAMini = useCallback(
    (a) => {
      const x = aMiniRadius * Math.cos(a);
      const z = aMiniRadius * Math.sin(a);
      aaGroupRef.current?.position.set(x, 0, z);
      abGroupRef.current?.position.set(-x, 0, -z);
    },
    [aMiniRadius],
  );

  const updateBMini = useCallback(
    (a) => {
      const x = bMiniRadius * Math.cos(a);
      const z = bMiniRadius * Math.sin(a);
      baGroupRef.current?.position.set(x, 0, z);
      bbGroupRef.current?.position.set(-x, 0, -z);
    },
    [bMiniRadius],
  );

  const updateCMini = useCallback(
    (a) => {
      const x = cMiniRadius * Math.cos(a);
      const z = cMiniRadius * Math.sin(a);
      caGroupRef.current?.position.set(x, 0, z);
      cbGroupRef.current?.position.set(-x, 0, -z);
    },
    [cMiniRadius],
  );

  useEffect(() => {
    updateWideAB(wideAngleRef.current);
    updateAMini(aMiniAngleRef.current);
    updateBMini(bMiniAngleRef.current);

    // YY Gem sabit merkezde
    if (yyGemPairRef.current) yyGemPairRef.current.position.copy(YYGEM_CENTER);

    updateCMini(cMiniAngleRef.current);
  }, [updateWideAB, updateAMini, updateBMini, updateCMini, YYGEM_CENTER]);

  const getBodyDataByName = (name) => {
    switch (name) {
      case "Castor Aa":
        return { ref: aaRef, radius: rAa };
      case "Castor Ab":
        return { ref: abRef, radius: rAb };
      case "Castor Ba":
        return { ref: baRef, radius: rBa };
      case "Castor Bb":
        return { ref: bbRef, radius: rBb };
      case "YY Gem A (Ca)":
        return { ref: caRef, radius: rCa };
      case "YY Gem B (Cb)":
        return { ref: cbRef, radius: rCb };
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

  const systemFocused =
    focusedPlanetName === "Castor Aa" ||
    focusedPlanetName === "Castor Ab" ||
    focusedPlanetName === "Castor Ba" ||
    focusedPlanetName === "Castor Bb" ||
    focusedPlanetName === "YY Gem A (Ca)" ||
    focusedPlanetName === "YY Gem B (Cb)";

  useFrame((_, delta) => {
    {
      const d = camera.position.length();
      const minDist = 900;
      const maxDist = 4500;

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

      const shouldShow = d > 0 && d < 4000;
      setLabelsVisibleByDistance((prev) =>
        prev === shouldShow ? prev : shouldShow,
      );
    }

    const wideSpeed = systemFocused ? 0 : 0.01;
    const aMiniSpeed = systemFocused ? 0 : 0.09;
    const bMiniSpeed = systemFocused ? 0 : 0.075;
    const cMiniSpeed = systemFocused ? 0 : 0.14;

    wideAngleRef.current += wideSpeed * delta;
    aMiniAngleRef.current += aMiniSpeed * delta;
    bMiniAngleRef.current += bMiniSpeed * delta;
    cMiniAngleRef.current += cMiniSpeed * delta;

    updateWideAB(wideAngleRef.current);
    updateAMini(aMiniAngleRef.current);
    updateBMini(bMiniAngleRef.current);
    updateCMini(cMiniAngleRef.current);

    if (systemRef.current) {
      systemRef.current.rotation.y += (systemFocused ? 0 : 0.0025) * delta;
    }

    aaRef.current && (aaRef.current.rotation.y += 0.22 * delta);
    abRef.current && (abRef.current.rotation.y += 0.28 * delta);
    baRef.current && (baRef.current.rotation.y += 0.24 * delta);
    bbRef.current && (bbRef.current.rotation.y += 0.32 * delta);
    caRef.current && (caRef.current.rotation.y += 0.55 * delta);
    cbRef.current && (cbRef.current.rotation.y += 0.62 * delta);

    const t = performance.now() * 0.001;
    const pulseHot = 0.55 + 0.45 * Math.sin(t * 0.9);
    const pulseRed = 0.55 + 0.45 * Math.sin(t * 1.25 + 0.8);

    if (aaMatRef.current)
      aaMatRef.current.emissiveIntensity = 2.6 + pulseHot * 1.2;
    if (abMatRef.current)
      abMatRef.current.emissiveIntensity = 2.2 + pulseHot * 1.0;
    if (baMatRef.current)
      baMatRef.current.emissiveIntensity = 2.4 + pulseHot * 1.05;
    if (bbMatRef.current)
      bbMatRef.current.emissiveIntensity = 1.9 + pulseHot * 0.9;

    if (caMatRef.current)
      caMatRef.current.emissiveIntensity = 1.05 + pulseRed * 0.55;
    if (cbMatRef.current)
      cbMatRef.current.emissiveIntensity = 0.95 + pulseRed * 0.5;

    const pulseHalo = (ref, base, p, o0, oAmp) => {
      if (!ref.current) return;
      const k = 1.0 + p * 0.14;
      ref.current.scale.set(base * k, base * k, 1);
      const mat = ref.current.material;
      if (mat) mat.opacity = o0 + p * oAmp;
    };

    pulseHalo(aaHaloRef, rAa * 10.5, pulseHot, 0.2, 0.26);
    pulseHalo(abHaloRef, rAb * 10.0, pulseHot, 0.18, 0.24);
    pulseHalo(baHaloRef, rBa * 10.2, pulseHot, 0.19, 0.25);
    pulseHalo(bbHaloRef, rBb * 11.5, pulseHot, 0.16, 0.22);

    pulseHalo(caHaloRef, rCa * 30.0, pulseRed, 0.12, 0.1);
    pulseHalo(cbHaloRef, rCb * 30.0, pulseRed, 0.12, 0.1);
  });

  return (
    <group ref={systemRef}>
      {/* ========================= AB WIDE ORBIT PLANE ========================= */}
      <group ref={abWidePlaneRef} rotation-z={AB_WIDE_TILT_RAD}>
        {/* AB wide ring */}
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[abWideRadius - abWideWidth, abWideRadius + abWideWidth, 220]}
          />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ========================= A GROUP (Aa/Ab) ========================= */}
        <group ref={aBaryRef}>
          <group ref={aMiniPlaneRef} rotation-z={A_MINI_TILT_RAD}>
            {/* A mini ring */}
            <mesh rotation-x={Math.PI / 2}>
              <ringGeometry
                args={[aMiniRadius - aMiniWidth, aMiniRadius + aMiniWidth, 160]}
              />
              <meshBasicMaterial
                color="#93c5fd"
                transparent
                opacity={0.22}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Aa */}
            <group ref={aaGroupRef}>
              <mesh ref={aaRef}>
                <sphereGeometry args={[rAa, 128, 128]} />
                <meshStandardMaterial
                  ref={aaMatRef}
                  map={aaTex}
                  emissiveMap={aaTex}
                  roughness={0.28}
                  metalness={0.18}
                  emissive="#bfe7ff"
                  emissiveIntensity={2.8}
                  toneMapped={false}
                />
              </mesh>
              <sprite ref={aaHaloRef}>
                <spriteMaterial
                  map={hotHaloTex}
                  transparent
                  opacity={0.22}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  toneMapped={false}
                />
              </sprite>

              {showLabelFor("Castor Aa") && (
                <Html distanceFactor={14} position={[0, rAa + 16, 0]}>
                  <div
                    className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                    style={{
                      fontSize: `${22.5 * labelScale}rem`,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    onClick={(e) => handleLabelClick(e, "Castor Aa")}
                  >
                    Castor Aa
                  </div>
                </Html>
              )}
            </group>

            {/* Ab */}
            <group ref={abGroupRef}>
              <mesh ref={abRef}>
                <sphereGeometry args={[rAb, 128, 128]} />
                <meshStandardMaterial
                  ref={abMatRef}
                  map={abTex}
                  emissiveMap={abTex}
                  roughness={0.3}
                  metalness={0.16}
                  emissive="#a9dcff"
                  emissiveIntensity={2.35}
                  toneMapped={false}
                />
              </mesh>
              <sprite ref={abHaloRef}>
                <spriteMaterial
                  map={hotHaloTex}
                  transparent
                  opacity={0.2}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  toneMapped={false}
                />
              </sprite>

              {showLabelFor("Castor Ab") && (
                <Html distanceFactor={14} position={[0, rAb + 14, 0]}>
                  <div
                    className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                    style={{
                      fontSize: `${21.0 * labelScale}rem`,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    onClick={(e) => handleLabelClick(e, "Castor Ab")}
                  >
                    Castor Ab
                  </div>
                </Html>
              )}
            </group>
          </group>
        </group>

        {/* ========================= B GROUP (Ba/Bb) ========================= */}
        <group ref={bBaryRef}>
          <group ref={bMiniPlaneRef} rotation-z={B_MINI_TILT_RAD}>
            {/* B mini ring */}
            <mesh rotation-x={Math.PI / 2}>
              <ringGeometry
                args={[bMiniRadius - bMiniWidth, bMiniRadius + bMiniWidth, 160]}
              />
              <meshBasicMaterial
                color="#7dd3fc"
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Ba */}
            <group ref={baGroupRef}>
              <mesh ref={baRef}>
                <sphereGeometry args={[rBa, 128, 128]} />
                <meshStandardMaterial
                  ref={baMatRef}
                  map={baTex}
                  emissiveMap={baTex}
                  roughness={0.28}
                  metalness={0.18}
                  emissive="#bfe7ff"
                  emissiveIntensity={2.55}
                  toneMapped={false}
                />
              </mesh>
              <sprite ref={baHaloRef}>
                <spriteMaterial
                  map={hotHaloTex}
                  transparent
                  opacity={0.2}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  toneMapped={false}
                />
              </sprite>

              {showLabelFor("Castor Ba") && (
                <Html distanceFactor={14} position={[0, rBa + 16, 0]}>
                  <div
                    className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                    style={{
                      fontSize: `${22.0 * labelScale}rem`,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    onClick={(e) => handleLabelClick(e, "Castor Ba")}
                  >
                    Castor Ba
                  </div>
                </Html>
              )}
            </group>

            {/* Bb */}
            <group ref={bbGroupRef}>
              <mesh ref={bbRef}>
                <sphereGeometry args={[rBb, 128, 128]} />
                <meshStandardMaterial
                  ref={bbMatRef}
                  map={bbTex}
                  emissiveMap={bbTex}
                  roughness={0.32}
                  metalness={0.16}
                  emissive="#9bd4ff"
                  emissiveIntensity={2.0}
                  toneMapped={false}
                />
              </mesh>
              <sprite ref={bbHaloRef}>
                <spriteMaterial
                  map={hotHaloTex}
                  transparent
                  opacity={0.18}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  toneMapped={false}
                />
              </sprite>

              {showLabelFor("Castor Bb") && (
                <Html distanceFactor={14} position={[0, rBb + 12, 0]}>
                  <div
                    className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                    style={{
                      fontSize: `${19.0 * labelScale}rem`,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    onClick={(e) => handleLabelClick(e, "Castor Bb")}
                  >
                    Castor Bb
                  </div>
                </Html>
              )}
            </group>
          </group>
        </group>
      </group>

      {/* ========================= YY GEM (Ca/Cb) — bağımsız pair ========================= */}
      <group ref={yyGemPairRef} rotation-z={YYGEM_PAIR_TILT_RAD}>
        <group ref={cMiniPlaneRef} rotation-z={C_MINI_TILT_RAD}>
          {/* C mini ring */}
          <mesh rotation-x={Math.PI / 2}>
            <ringGeometry
              args={[cMiniRadius - cMiniWidth, cMiniRadius + cMiniWidth, 120]}
            />
            <meshBasicMaterial
              color="#fda4af"
              transparent
              opacity={0.18}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Ca */}
          <group ref={caGroupRef}>
            <mesh ref={caRef}>
              <sphereGeometry args={[rCa, 96, 96]} />
              <meshStandardMaterial
                ref={caMatRef}
                map={caTex}
                emissiveMap={caTex}
                roughness={0.42}
                metalness={0.1}
                emissive="#ff6b4a"
                emissiveIntensity={1.2}
                toneMapped={false}
              />
            </mesh>
            <sprite ref={caHaloRef}>
              <spriteMaterial
                map={redHaloTex}
                transparent
                opacity={0.14}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
              />
            </sprite>

            {showLabelFor("YY Gem A (Ca)") && (
              <Html distanceFactor={14} position={[0, rCa + 10, 0]}>
                <div
                  className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                  style={{
                    fontSize: `${14.0 * labelScale}rem`,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  onClick={(e) => handleLabelClick(e, "YY Gem A (Ca)")}
                >
                  YY Gem A (Ca)
                </div>
              </Html>
            )}
          </group>

          {/* Cb */}
          <group ref={cbGroupRef}>
            <mesh ref={cbRef}>
              <sphereGeometry args={[rCb, 96, 96]} />
              <meshStandardMaterial
                ref={cbMatRef}
                map={cbTex}
                emissiveMap={cbTex}
                roughness={0.46}
                metalness={0.1}
                emissive="#ff5a3a"
                emissiveIntensity={1.1}
                toneMapped={false}
              />
            </mesh>
            <sprite ref={cbHaloRef}>
              <spriteMaterial
                map={redHaloTex}
                transparent
                opacity={0.14}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
              />
            </sprite>

            {showLabelFor("YY Gem B (Cb)") && (
              <Html distanceFactor={14} position={[0, rCb + 10, 0]}>
                <div
                  className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
                  style={{
                    fontSize: `${14.0 * labelScale}rem`,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  onClick={(e) => handleLabelClick(e, "YY Gem B (Cb)")}
                >
                  YY Gem B (Cb)
                </div>
              </Html>
            )}
          </group>
        </group>
      </group>
    </group>
  );
}

export default CastorSystem;
