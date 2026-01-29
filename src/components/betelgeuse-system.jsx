import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function BetelgeuseSystem({
  showLabels = true,
  labelScale: _ignoredLabelScaleProp,
  focusedPlanetName,
  onPlanetLabelClick,
  onRegisterPlanetFocusApi,
}) {
  const { camera } = useThree();

  const systemRef = useRef(null);
  const betelRef = useRef(null);

  const haloRef = useRef(null);

  const [labelScale, setLabelScale] = useState(1);
  const [labelsVisibleByDistance, setLabelsVisibleByDistance] = useState(true);

  const [betelTex] = useTexture(["/textures/stars/betelgeuse.jpg"]);
  if (betelTex) betelTex.colorSpace = THREE.SRGBColorSpace;

  const betelRadius = 60;

  // =========================
  // Strong halo sprite texture (canvas radial gradient)
  // =========================
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

    g.addColorStop(0.0, "rgba(255, 160, 90, 1.00)");
    g.addColorStop(0.12, "rgba(255, 120, 60, 0.78)");
    g.addColorStop(0.3, "rgba(255, 80, 35, 0.42)");
    g.addColorStop(0.55, "rgba(255, 55, 25, 0.22)");
    g.addColorStop(1.0, "rgba(255, 50, 20, 0.0)");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  const getBodyDataByName = (name) => {
    switch (name) {
      case "Betelgeuse":
        return { ref: betelRef, radius: betelRadius };
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
    if (onRegisterPlanetFocusApi) {
      onRegisterPlanetFocusApi(focusBodyByName);
    }
  }, [onRegisterPlanetFocusApi, focusBodyByName]);

  useFrame((_, delta) => {
    {
      const d = camera.position.length();
      const minDist = 160;
      const maxDist = 900;

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

      const shouldShow = d > 0 && d < 1400;
      setLabelsVisibleByDistance((prev) =>
        prev === shouldShow ? prev : shouldShow,
      );
    }

    const focused = focusedPlanetName === "Betelgeuse";

    // Spin (focus olunca durdur)
    if (betelRef.current)
      betelRef.current.rotation.y += (focused ? 0 : 0.22) * delta;

    // System hafif drift
    if (systemRef.current)
      systemRef.current.rotation.y += (focused ? 0 : 0.008) * delta;

    if (haloRef.current) {
      const t = performance.now() * 0.001;
      const pulse = 0.55 + 0.45 * Math.sin(t * 0.9);

      const base = betelRadius * 9.0;
      const k = 1.0 + pulse * 0.14;
      haloRef.current.scale.set(base * k, base * k, 1);

      const mat = haloRef.current.material;
      if (mat) mat.opacity = 0.22 + pulse * 0.28;
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
      {/* Betelgeuse */}
      <mesh ref={betelRef} position={[1, 0, 0]}>
        <sphereGeometry args={[betelRadius, 128, 128]} />
        <meshStandardMaterial
          map={betelTex}
          roughness={0.35}
          metalness={0.18}
          emissive="#ff7a59"
          emissiveIntensity={2.4}
          emissiveMap={betelTex}
          toneMapped={false}
        />
      </mesh>
      <sprite ref={haloRef} position={[1, 0, 0]}>
        <spriteMaterial
          map={haloTexture}
          transparent
          opacity={0.26}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {showLabelFor("Betelgeuse") && (
        <Html distanceFactor={14} position={[0, betelRadius + 28, 0]}>
          <div
            className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
            style={{
              fontSize: `${22.5 * labelScale}rem`,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={(e) => handleLabelClick(e, "Betelgeuse")}
          >
            Betelgeuse
          </div>
        </Html>
      )}
    </group>
  );
}

export default BetelgeuseSystem;
