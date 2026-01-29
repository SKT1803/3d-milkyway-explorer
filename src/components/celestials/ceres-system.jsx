import * as THREE from "three";
import { Html } from "@react-three/drei";

export function CeresSystem({
  groupRef,
  planetRef,
  ceresRadius,
  ceresOrbitRadius,
  ceresTex,
  labelScale,
  showLabelCeres,
  showLabels,
  focusedPlanetName,
  orbitTiltDeg = 10.6,
  onPlanetLabelClick,
}) {
  const orbitTiltRad = THREE.MathUtils.degToRad(orbitTiltDeg);
  const isFocused = focusedPlanetName === "Ceres";

  const handlePlanetLabelClick = (e) => {
    e.stopPropagation();
    if (!onPlanetLabelClick || !planetRef?.current) return;

    const wp = new THREE.Vector3();
    planetRef.current.getWorldPosition(wp);
    onPlanetLabelClick("Ceres", [wp.x, wp.y, wp.z], ceresRadius);
  };

  return (
    <group rotation-z={orbitTiltRad}>
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry
          args={[ceresOrbitRadius - 0.03, ceresOrbitRadius + 0.03, 128]}
        />
        <meshBasicMaterial
          color="#cfcfcf"
          transparent
          opacity={0.32}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={groupRef}>
        <mesh ref={planetRef} position={[ceresOrbitRadius, 0, 0]}>
          <sphereGeometry args={[ceresRadius, 64, 64]} />
          <meshStandardMaterial
            map={ceresTex}
            roughness={0.85}
            metalness={0.1}
          />

          {showLabels && showLabelCeres && (
            <Html distanceFactor={13} position={[0, ceresRadius + 0.7, 0]}>
              <div
                className={`px-2 py-1 rounded bg-black/70 text-white border ${
                  isFocused ? "border-white" : "border-white/40"
                }`}
                style={{
                  fontSize: `${0.88 * labelScale}rem`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={handlePlanetLabelClick}
              >
                Ceres
              </div>
            </Html>
          )}
        </mesh>
      </group>
    </group>
  );
}

export default CeresSystem;
