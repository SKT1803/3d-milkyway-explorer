import React, { useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ModelAsset from "./model-asset";

export default function OrbitingModel({
  name,
  url,

  orbitRadius = 2,
  orbitSpeed = 1,
  tiltDeg = 0,
  initialPhase = 0,

  plane = "equatorial", // "equatorial" (XZ) | "tilted" (XY)

  showRing = true,
  ringWidth = 0.02,
  ringOpacity = 0.35,
  ringColor = "#ffffff",

  paused = false,

  scale = 1,
  rotation = [0, 0, 0],

  spinEnabled = true,
  spinSpeed = 0.2,
  spinAxis = "y",
  showLabel = true,
  labelScale = 1,
  labelOffset, // undefined olabilir
  focusedName,
  onLabelClick,
  onClickModel,
  externalOrbitRef,
}) {
  const showLabelFor = (n) => showLabel && (!focusedName || focusedName !== n);
  const orbitGroupRef = externalOrbitRef ?? useRef(null);

  // Spin için ayrı ref (orbitGroup'a spin vermiyoruz)
  const modelRef = useRef(null);

  const angleRef = useRef(initialPhase);

  const tiltRad = useMemo(() => (tiltDeg * Math.PI) / 180, [tiltDeg]);

  // ringGeometry default XY düzleminde çizilir
  // equatorial orbit (XZ) için ring'i X ekseninde 90° yatırıyoruz
  const ringRotation = useMemo(
    () => (plane === "equatorial" ? [Math.PI / 2, 0, 0] : [0, 0, 0]),
    [plane],
  );

  // scale küçülünce ring çok ince kalıp “gap” hissi yapmasın diye dinamik width
  const effectiveRingWidth = useMemo(() => {
    return Math.max(ringWidth, 0.12 * scale);
  }, [ringWidth, scale]);

  // label default’u: modelin üstünde dursun (JupiterSystem gibi)
  // Modelin gerçek bbox yüksekliğini her frame hesaplamak pahalı.
  // Pratik: scale ile orantılı offset.
  const effectiveLabelOffset = useMemo(() => {
    if (labelOffset) return labelOffset;
    return [0, Math.max(0.6, 1.2 * scale), 0];
  }, [labelOffset, scale]);

  useFrame((_, delta) => {
    if (!orbitGroupRef.current) return;

    if (!paused) angleRef.current += orbitSpeed * delta;
    const a = angleRef.current;

    let x = 0,
      y = 0,
      z = 0;

    if (plane === "equatorial") {
      // XZ düzlemi
      x = orbitRadius * Math.cos(a);
      z = orbitRadius * Math.sin(a);
      y = 0;
    } else {
      // XY düzlemi
      x = orbitRadius * Math.cos(a);
      y = orbitRadius * Math.sin(a);
      z = 0;
    }

    // Hareket eden sadece orbitGroup
    orbitGroupRef.current.position.set(x, y, z);

    // Spin sadece modelin kendisinde
    if (modelRef.current && spinEnabled && spinSpeed !== 0) {
      if (spinAxis === "x") modelRef.current.rotation.x += spinSpeed * delta;
      else if (spinAxis === "z")
        modelRef.current.rotation.z += spinSpeed * delta;
      else modelRef.current.rotation.y += spinSpeed * delta;
    }
  });

  return (
    <group rotation={[tiltRad, 0, 0]}>
      {showRing && (
        <mesh rotation={ringRotation}>
          <ringGeometry
            args={[
              orbitRadius - effectiveRingWidth,
              orbitRadius + effectiveRingWidth,
              128,
            ]}
          />
          <meshBasicMaterial
            color={ringColor}
            side={THREE.DoubleSide}
            transparent
            opacity={ringOpacity}
          />
        </mesh>
      )}

      <group ref={orbitGroupRef}>
        <ModelAsset
          ref={modelRef}
          url={url}
          rotation={rotation}
          scale={scale}
          center={false}
          normalize={false}
          name={name}
        />

        {showLabelFor(name) && (
          <Html distanceFactor={10} position={effectiveLabelOffset}>
            <div
              className="px-2 py-1 rounded bg-black/70 text-white border border-white/30"
              style={{
                fontSize: `${0.85 * labelScale}rem`,
                cursor: "pointer",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onLabelClick?.(name);
              }}
            >
              {name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
