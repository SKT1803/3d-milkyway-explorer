import * as THREE from "three";
import { Html } from "@react-three/drei";

export function ErisSystem({
  groupRef,
  planetRef,
  erisRadius,
  erisOrbitRadius,
  erisTex,
  labelScale,
  showLabelEris,
  showLabels,
  focusedPlanetName,
  orbitTiltDeg = 44,
  onPlanetLabelClick,
}) {
  const orbitTiltRad = THREE.MathUtils.degToRad(orbitTiltDeg);
  const isFocused = focusedPlanetName === "Eris";

  const handlePlanetLabelClick = (e) => {
    e.stopPropagation();
    if (!onPlanetLabelClick || !planetRef?.current) return;
    const wp = new THREE.Vector3();
    planetRef.current.getWorldPosition(wp);
    onPlanetLabelClick("Eris", [wp.x, wp.y, wp.z], erisRadius);
  };

  return (
    <group ref={groupRef}>
      <group rotation-z={orbitTiltRad}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[erisOrbitRadius - 0.04, erisOrbitRadius + 0.04, 128]}
          />
          <meshBasicMaterial
            color="#c6f0ff"
            transparent
            opacity={0.34}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={planetRef} position={[erisOrbitRadius, 0, 0]}>
          <sphereGeometry args={[erisRadius, 64, 64]} />
          <meshStandardMaterial
            map={erisTex}
            roughness={0.84}
            metalness={0.18}
          />

          {showLabels && showLabelEris && (
            <Html distanceFactor={15} position={[0, erisRadius + 0.75, 0]}>
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
                Eris
              </div>
            </Html>
          )}
        </mesh>
      </group>
    </group>
  );
}

export default ErisSystem;
