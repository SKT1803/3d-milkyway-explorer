import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function VegaSystem({
  showLabels = true,
  labelScale: _ignoredLabelScaleProp,
  focusedPlanetName,
  onPlanetLabelClick,
  onRegisterPlanetFocusApi,
}) {
  const { camera } = useThree();

  const systemRef = useRef(null);
  const vegaRef = useRef(null);
  const vegaMatRef = useRef(null);
  const haloRef = useRef(null);

  const [labelScale, setLabelScale] = useState(1);
  const [labelsVisibleByDistance, setLabelsVisibleByDistance] = useState(true);

  const [vegaTex] = useTexture(["/textures/stars/antares_b.jpg"]);
  useEffect(() => {
    if (vegaTex) vegaTex.colorSpace = THREE.SRGBColorSpace;
  }, [vegaTex]);

  const vegaRadius = 44;

  // küçük offset (origin edge-case olmasın)
  const VEGA_POS = useMemo(() => [1, 0, 0], []);

  const haloTexture = useMemo(() => {
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

    g.addColorStop(0.0, "rgba(245, 250, 255, 1.00)");
    g.addColorStop(0.12, "rgba(180, 225, 255, 0.85)");
    g.addColorStop(0.3, "rgba(110, 175, 255, 0.50)");
    g.addColorStop(0.55, "rgba(80, 120, 255, 0.22)");
    g.addColorStop(1.0, "rgba(20, 40, 120, 0.00)");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  const getBodyDataByName = (name) => {
    switch (name) {
      case "Vega":
        return { ref: vegaRef, radius: vegaRadius };
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
    // label scale + visible
    {
      const d = camera.position.length();
      const minDist = 300;
      const maxDist = 1200;

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

      const shouldShow = d > 0 && d < 2200;
      setLabelsVisibleByDistance((prev) =>
        prev === shouldShow ? prev : shouldShow,
      );
    }

    const focused = focusedPlanetName === "Vega";

    // Spin + slight drift (focus olunca dursun)
    if (vegaRef.current)
      vegaRef.current.rotation.y += (focused ? 0 : 0.22) * delta;
    if (systemRef.current)
      systemRef.current.rotation.y += (focused ? 0 : 0.006) * delta;

    const t = performance.now() * 0.001;
    const pulse = 0.55 + 0.45 * Math.sin(t * 0.95);

    if (vegaMatRef.current) {
      vegaMatRef.current.emissiveIntensity = 2.3 + pulse * 1.0;
    }

    if (haloRef.current) {
      const base = vegaRadius * 11.0;
      const k = 1.0 + pulse * 0.14;
      haloRef.current.scale.set(base * k, base * k, 1);

      const mat = haloRef.current.material;
      if (mat) mat.opacity = 0.2 + pulse * 0.22;
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
      {/* Vega surface */}
      <mesh ref={vegaRef} position={VEGA_POS}>
        <sphereGeometry args={[vegaRadius, 128, 128]} />
        <meshStandardMaterial
          ref={vegaMatRef}
          map={vegaTex}
          roughness={0.18}
          metalness={0.08}
          emissive="#bfe3ff"
          emissiveIntensity={2.6}
          emissiveMap={vegaTex}
          toneMapped={false}
        />
      </mesh>

      {/* Halo */}
      <sprite ref={haloRef} position={VEGA_POS}>
        <spriteMaterial
          map={haloTexture}
          transparent
          opacity={0.24}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {showLabelFor("Vega") && (
        <Html distanceFactor={14} position={[0, vegaRadius + 24, 0]}>
          <div
            className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
            style={{
              fontSize: `${22.5 * labelScale}rem`,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={(e) => handleLabelClick(e, "Vega")}
          >
            Vega
          </div>
        </Html>
      )}
    </group>
  );
}

export default VegaSystem;
