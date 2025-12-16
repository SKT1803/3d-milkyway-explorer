import { useMemo } from "react";
import * as THREE from "three";
import { Instances, Instance } from "@react-three/drei";

export function InnerSpace({
  visible = true,
  count = 2000,
  maxRadius = 440,
  minRadius = 120,
  minSize = 0.04,
  maxSize = 0.05,
}) {
  const stars = useMemo(() => {
    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#ffe9c4"),
      new THREE.Color("#ffd6a5"),
      new THREE.Color("#c4d7ff"),
      new THREE.Color("#f5f5ff"),
      new THREE.Color("#ffd2f0"),
    ];

    const data = [];
    const minR3 = minRadius * minRadius * minRadius;
    const maxR3 = maxRadius * maxRadius * maxRadius;

    for (let i = 0; i < count; i++) {
      const radius = Math.cbrt(minR3 + (maxR3 - minR3) * Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const base = palette[Math.floor(Math.random() * palette.length)].clone();
      const intensity = 0.55 + Math.random() * 0.45;
      base.multiplyScalar(intensity);

      const t = Math.pow(Math.random(), 3.2);
      const size = THREE.MathUtils.lerp(minSize, maxSize, t);

      data.push({
        position: [x, y, z],
        color: base,
        scale: size,
      });
    }

    return data;
  }, [count, maxRadius, minRadius, minSize, maxSize]);

  if (!visible) return null;

  return (
    <Instances limit={count} range={stars.length}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial depthWrite={false} toneMapped={false} />
      {stars.map((star, i) => (
        <Instance
          key={i}
          position={star.position}
          color={star.color}
          scale={star.scale}
        />
      ))}
    </Instances>
  );
}
