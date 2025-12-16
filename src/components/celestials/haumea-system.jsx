import * as THREE from "three";
import { Html } from "@react-three/drei";

export function HaumeaSystem({
  groupRef,
  planetRef,
  haumeaRadius,
  haumeaOrbitRadius,
  haumeaTex,
  labelScale,
  showLabelHaumea,
  showLabels,
  focusedPlanetName,
  orbitTiltDeg = 25,
  onPlanetLabelClick,
}) {
  const orbitTiltRad = THREE.MathUtils.degToRad(orbitTiltDeg);
  const isFocused = focusedPlanetName === "Haumea";

  const handlePlanetLabelClick = (e) => {
    e.stopPropagation();
    if (!onPlanetLabelClick || !planetRef?.current) return;
    const wp = new THREE.Vector3();
    planetRef.current.getWorldPosition(wp);
    onPlanetLabelClick("Haumea", [wp.x, wp.y, wp.z], haumeaRadius);
  };

  return (
    <group ref={groupRef}>
      <group rotation-z={orbitTiltRad}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[haumeaOrbitRadius - 0.035, haumeaOrbitRadius + 0.035, 128]}
          />
          <meshBasicMaterial
            color="#e0c6ff"
            transparent
            opacity={0.32}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Haumea (oval elipsoid) */}
        <mesh
          ref={planetRef}
          position={[haumeaOrbitRadius, 0, 0]}
          scale={[1.8, 0.9, 1.3]} // x: çok uzat, y: biraz bas, z: hafif uzat
        >
          <sphereGeometry args={[haumeaRadius, 64, 64]} />
          <meshStandardMaterial
            map={haumeaTex}
            roughness={0.8}
            metalness={0.18}
          />
          {showLabels && showLabelHaumea && (
            <Html distanceFactor={13} position={[0, haumeaRadius + 0.7, 0]}>
              <div
                className={`px-2 py-1 rounded bg-black/70 text-white border ${
                  isFocused ? "border-white" : "border-white/40"
                }`}
                style={{
                  fontSize: `${0.9 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={handlePlanetLabelClick}
              >
                Haumea
              </div>
            </Html>
          )}
        </mesh>
      </group>
    </group>
  );
}

export default HaumeaSystem;
