import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function NaosSystem({
  showLabels = true,
  labelScale: _ignoredLabelScaleProp,
  focusedPlanetName,
  onPlanetLabelClick,
  onRegisterPlanetFocusApi,
}) {
  const { camera } = useThree();

  const systemRef = useRef(null);
  const naosRef = useRef(null);
  const naosMatRef = useRef(null);
  const haloRef = useRef(null);

  const [labelScale, setLabelScale] = useState(1);
  const [labelsVisibleByDistance, setLabelsVisibleByDistance] = useState(true);

  const [naosTex] = useTexture(["/textures/stars/naos.jpg"]);
  useEffect(() => {
    if (naosTex) naosTex.colorSpace = THREE.SRGBColorSpace;
  }, [naosTex]);

  const naosRadius = 52;

  const NAOS_POS = useMemo(() => [1, 0, 0], []);

  // =========================
  // Blue supergiant halo sprite texture (radial gradient)
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

    // merkez: beyaz-mavi çok parlak, dış: mavi aura, sonra transparan
    g.addColorStop(0.0, "rgba(225, 245, 255, 1.00)"); // hot core white-blue
    g.addColorStop(0.1, "rgba(160, 220, 255, 0.92)");
    g.addColorStop(0.26, "rgba(80, 170, 255, 0.62)");
    g.addColorStop(0.48, "rgba(40, 120, 255, 0.30)");
    g.addColorStop(0.7, "rgba(20, 80, 200, 0.14)");
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
      case "Naos":
        return { ref: naosRef, radius: naosRadius };
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

    const focused = focusedPlanetName === "Naos";

    if (naosRef.current)
      naosRef.current.rotation.y += (focused ? 0 : 0.2) * delta;

    if (systemRef.current)
      systemRef.current.rotation.y += (focused ? 0 : 0.008) * delta;
    const t = performance.now() * 0.001;
    const pulse = 0.55 + 0.45 * Math.sin(t * 0.85);

    if (naosMatRef.current) {
      naosMatRef.current.emissiveIntensity = 2.2 + pulse * 1.0;
    }

    if (haloRef.current) {
      const base = naosRadius * 10.5;
      const k = 1.0 + pulse * 0.16;
      haloRef.current.scale.set(base * k, base * k, 1);

      const mat = haloRef.current.material;
      if (mat) mat.opacity = 0.22 + pulse * 0.3;
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
      {/* Naos surface */}
      <mesh ref={naosRef} position={NAOS_POS}>
        <sphereGeometry args={[naosRadius, 128, 128]} />
        <meshStandardMaterial
          ref={naosMatRef}
          map={naosTex}
          roughness={0.28}
          metalness={0.14}
          emissive="#a7ddff"
          emissiveIntensity={2.6}
          emissiveMap={naosTex}
          toneMapped={false}
        />
      </mesh>

      <sprite ref={haloRef} position={NAOS_POS}>
        <spriteMaterial
          map={haloTexture}
          transparent
          opacity={0.26}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {showLabelFor("Naos") && (
        <Html distanceFactor={14} position={[0, naosRadius + 26, 0]}>
          <div
            className="px-3 py-1 rounded bg-black/70 text-white border border-white/40"
            style={{
              fontSize: `${22.5 * labelScale}rem`,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={(e) => handleLabelClick(e, "Naos")}
          >
            Naos
          </div>
        </Html>
      )}
    </group>
  );
}

export default NaosSystem;
