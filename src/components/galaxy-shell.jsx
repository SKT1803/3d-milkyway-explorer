import * as THREE from "three";

export function GalaxyShell({
  radius = 5.5,
  halfHeight = 2.0,
  visible = true,
}) {
  if (!visible) return null;

  const height = Math.min(halfHeight * 2, radius * 0.6);

  const fogColor = new THREE.Color("#040408");

  return (
    <group>
      <mesh>
        <cylinderGeometry
          args={[radius * 1.02, radius * 1.02, height, 64, 1, true]}
        />
        <meshBasicMaterial
          color={fogColor}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[radius * 0.3, radius * 1.05, 96]} />
        <meshBasicMaterial
          color={fogColor}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[radius * 0.35, 64]} />
        <meshBasicMaterial
          color="#05050a"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
