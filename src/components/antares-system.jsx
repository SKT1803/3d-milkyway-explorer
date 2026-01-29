import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function AntaresSystem({
  showLabels = true,
  labelScale: _ignoredLabelScaleProp,
  focusedPlanetName,
  onPlanetLabelClick,
  onRegisterPlanetFocusApi,
}) {
  const { camera } = useThree();

  const systemRef = useRef(null);

  const aGroupRef = useRef(null);
  const bGroupRef = useRef(null);

  const aRef = useRef(null);
  const bRef = useRef(null);

  const aMatRef = useRef(null);
  const bMatRef = useRef(null);

  const aHaloRef = useRef(null);
  const bHaloRef = useRef(null);

  const angleRef = useRef(0);

  const [labelScale, setLabelScale] = useState(1);
  const [labelsVisibleByDistance, setLabelsVisibleByDistance] = useState(true);

  const [aTex, bTex] = useTexture([
    "/textures/stars/betelgeuse.jpg",
    "/textures/stars/antares_b.jpg",
  ]);

  useEffect(() => {
    if (aTex) aTex.colorSpace = THREE.SRGBColorSpace;
    if (bTex) bTex.colorSpace = THREE.SRGBColorSpace;
  }, [aTex, bTex]);

  const aRadius = 170;
  const bRadius = 16;

  const orbitRadius = 1700;
  const orbitWidth = 4;

  const updatePositions = useCallback(
    (a) => {
      const ax = orbitRadius * Math.cos(a);
      const az = orbitRadius * Math.sin(a);

      const bx = orbitRadius * Math.cos(a + Math.PI);
      const bz = orbitRadius * Math.sin(a + Math.PI);

      if (aGroupRef.current) aGroupRef.current.position.set(ax, 0, az);
      if (bGroupRef.current) bGroupRef.current.position.set(bx, 0, bz);
    },
    [orbitRadius],
  );

  useEffect(() => {
    updatePositions(angleRef.current);
  }, [updatePositions]);

  const aHaloTexture = useMemo(() => {
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

    g.addColorStop(0.0, "rgba(255, 170, 140, 1.00)");
    g.addColorStop(0.12, "rgba(255, 90, 40, 0.78)");
    g.addColorStop(0.32, "rgba(255, 60, 25, 0.42)");
    g.addColorStop(0.55, "rgba(255, 40, 15, 0.20)");
    g.addColorStop(1.0, "rgba(255, 30, 10, 0.0)");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  const bHaloTexture = useMemo(() => {
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

    g.addColorStop(0.0, "rgba(225, 245, 255, 1.00)");
    g.addColorStop(0.12, "rgba(140, 220, 255, 0.85)");
    g.addColorStop(0.32, "rgba(60, 160, 255, 0.52)");
    g.addColorStop(0.55, "rgba(30, 110, 255, 0.24)");
    g.addColorStop(1.0, "rgba(10, 40, 120, 0.00)");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  const getBodyDataByName = (name) => {
    switch (name) {
      case "Antares A":
        return { ref: aRef, radius: aRadius };
      case "Antares B":
        return { ref: bRef, radius: bRadius };
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
    [onPlanetLabelClick],
  );

  useEffect(() => {
    if (onRegisterPlanetFocusApi) onRegisterPlanetFocusApi(focusBodyByName);
  }, [onRegisterPlanetFocusApi, focusBodyByName]);

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
      const targetScale = 0.8 + t * 1.2;

      setLabelScale((prev) => {
        const lerped = THREE.MathUtils.lerp(prev, targetScale, 0.12);
        if (Math.abs(lerped - prev) < 0.001) return prev;
        return lerped;
      });

      const shouldShow = d > 0 && d < 4000;
      setLabelsVisibleByDistance((prev) =>
        prev === shouldShow ? prev : shouldShow,
      );
    }

    const systemFocused =
      focusedPlanetName === "Antares A" || focusedPlanetName === "Antares B";

    const orbitSpeed = systemFocused ? 0 : 0.008;
    angleRef.current += orbitSpeed * delta;
    updatePositions(angleRef.current);
    if (systemRef.current)
      systemRef.current.rotation.y += (systemFocused ? 0 : 0.003) * delta;
    if (aRef.current)
      aRef.current.rotation.y += (systemFocused ? 0 : 0.14) * delta;
    if (bRef.current)
      bRef.current.rotation.y += (systemFocused ? 0 : 0.22) * delta;
    const t = performance.now() * 0.001;
    const pulseA = 0.55 + 0.45 * Math.sin(t * 0.9);
    const pulseB = 0.55 + 0.45 * Math.sin(t * 1.15 + 1.2);

    if (aMatRef.current) aMatRef.current.emissiveIntensity = 3.0 + pulseA * 1.2;
    if (bMatRef.current) bMatRef.current.emissiveIntensity = 1.8 + pulseB * 0.8;

    if (aHaloRef.current) {
      const base = aRadius * 10.5;
      const k = 1.0 + pulseA * 0.14;
      aHaloRef.current.scale.set(base * k, base * k, 1);

      const mat = aHaloRef.current.material;
      if (mat) mat.opacity = 0.24 + pulseA * 0.28;
    }

    if (bHaloRef.current) {
      const base = bRadius * 30.0;
      const k = 1.0 + pulseB * 0.16;
      bHaloRef.current.scale.set(base * k, base * k, 1);

      const mat = bHaloRef.current.material;
      if (mat) mat.opacity = 0.18 + pulseB * 0.2;
    }
  });

  const showLabelFor = (name) =>
    showLabels &&
    labelsVisibleByDistance &&
    (!focusedPlanetName || focusedPlanetName !== name);

  const handleLabelClick = (e, name) => {
    e.stopPropagation();
    focusBodyByName(name);
  };

  return (
    <group ref={systemRef}>
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry
          args={[orbitRadius - orbitWidth, orbitRadius + orbitWidth, 128]}
        />
        <meshBasicMaterial
          color="#ffb37a"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Antares A group */}
      <group ref={aGroupRef}>
        <mesh ref={aRef}>
          <sphereGeometry args={[aRadius, 128, 128]} />
          <meshStandardMaterial
            ref={aMatRef}
            map={aTex}
            roughness={0.26}
            metalness={0.12}
            emissive="#ff3b18"
            emissiveIntensity={3.2}
            emissiveMap={aTex}
            toneMapped={false}
          />
        </mesh>

        <sprite ref={aHaloRef}>
          <spriteMaterial
            map={aHaloTexture}
            transparent
            opacity={0.28}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>

        {showLabelFor("Antares A") && (
          <Html distanceFactor={14} position={[0, aRadius + 22, 0]}>
            <div
              className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
              style={{
                fontSize: `${22.5 * labelScale}rem`,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={(e) => handleLabelClick(e, "Antares A")}
            >
              Antares A
            </div>
          </Html>
        )}
      </group>

      {/* Antares B group */}
      <group ref={bGroupRef}>
        <mesh ref={bRef}>
          <sphereGeometry args={[bRadius, 96, 96]} />
          <meshStandardMaterial
            ref={bMatRef}
            map={bTex}
            roughness={0.14}
            metalness={0.08}
            emissive="#1ea7ff"
            emissiveIntensity={2.0}
            emissiveMap={bTex}
            toneMapped={false}
          />
        </mesh>

        <sprite ref={bHaloRef}>
          <spriteMaterial
            map={bHaloTexture}
            transparent
            opacity={0.2}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>

        {showLabelFor("Antares B") && (
          <Html distanceFactor={14} position={[0, bRadius + 12, 0]}>
            <div
              className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
              style={{
                fontSize: `${18.0 * labelScale}rem`,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={(e) => handleLabelClick(e, "Antares B")}
            >
              Antares B
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

export default AntaresSystem;
