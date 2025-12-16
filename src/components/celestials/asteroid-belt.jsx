import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function AsteroidBelt({
  innerRadius = 35,
  outerRadius = 55,
  count = 1500,
  tiltDeg = 1.5,
  spinSpeed = 0.02,
  minScale = 0.12,
  maxScale = 0.6,
  color = "#aaaaaa",
  opacity = 0.9,
  asteroidTexture = null,
}) {
  const groupRef = useRef(null);
  const meshRef = useRef(null);

  const tiltRad = THREE.MathUtils.degToRad(tiltDeg);

  useEffect(() => {
    if (!asteroidTexture) return;
    asteroidTexture.wrapS = asteroidTexture.wrapT = THREE.RepeatWrapping;
  }, [asteroidTexture]);

  const asteroidMatrices = useMemo(() => {
    const temp = new THREE.Object3D();
    const matrices = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const height = (Math.random() - 0.5) * 2.0; // -1 .. +1

      temp.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      const s = minScale + Math.random() * (maxScale - minScale);
      temp.scale.setScalar(s);

      temp.rotation.y = Math.random() * Math.PI * 2;

      temp.updateMatrix();
      matrices.push(temp.matrix.clone());
    }

    return matrices;
  }, [innerRadius, outerRadius, count, minScale, maxScale]);

  useEffect(() => {
    if (!meshRef.current) return;
    asteroidMatrices.forEach((matrix, i) => {
      meshRef.current.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [asteroidMatrices]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += spinSpeed * delta;
    }
  });

  return (
    <group ref={groupRef} rotation-z={tiltRad}>
      <instancedMesh
        ref={meshRef}
        args={[null, null, count]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          map={asteroidTexture || null}
          color={color}
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </instancedMesh>
    </group>
  );
}

export default AsteroidBelt;
