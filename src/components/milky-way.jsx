import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function MilkyWay({
  count,
  size,
  radius,
  branches,
  spin,
  randomness,
  randomnessPower,
  insideColor,
  outsideColor,
  visible = true,
  onReady,
  defer = true,
}) {
  const pointsRef = useRef(null);

  // geometry data sonradan set edilecek
  const [data, setData] = useState(null);

  // StrictMode / tekrar render durumları için koruma
  const readyNotifiedRef = useRef(false);
  const computingRef = useRef(false);

  useEffect(() => {
    if (data || computingRef.current) return;

    computingRef.current = true;
    let cancelled = false;

    const compute = () => {
      if (cancelled) return;

      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const colorInside = new THREE.Color(insideColor);
      const colorOutside = new THREE.Color(outsideColor);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        const radiusRandom = Math.random() * radius;
        const spinAngle = radiusRandom * spin;
        const branchAngle = ((i % branches) / branches) * Math.PI * 2;

        const randomX =
          Math.pow(Math.random(), randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          randomness *
          radiusRandom;
        const randomY =
          Math.pow(Math.random(), randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          randomness *
          radiusRandom;
        const randomZ =
          Math.pow(Math.random(), randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          randomness *
          radiusRandom;

        positions[i3] =
          Math.cos(branchAngle + spinAngle) * radiusRandom + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] =
          Math.sin(branchAngle + spinAngle) * radiusRandom + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radiusRandom / radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      if (cancelled) return;

      setData({ positions, colors });
      computingRef.current = false;

      if (!readyNotifiedRef.current) {
        readyNotifiedRef.current = true;
        onReady?.();
      }
    };

    // Loading in ilk frame de görünmesi için hesabı bir frame geciktiriyorum
    let rafId = null;
    if (defer) rafId = requestAnimationFrame(compute);
    else compute();

    return () => {
      cancelled = true;
      computingRef.current = false;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [
    data,
    count,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor,
    onReady,
    defer,
  ]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  if (!visible) return null;
  if (!data) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={data.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={data.colors}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={size}
        sizeAttenuation
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
