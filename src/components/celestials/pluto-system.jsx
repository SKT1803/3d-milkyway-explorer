import * as THREE from "three";
import { Html } from "@react-three/drei";

export function PlutoSystem({
  groupRef,
  planetRef,
  plutoRadius,
  plutoOrbitRadius,
  plutoTex,
  labelScale,
  showLabelPluto,
  showLabels,
  focusedPlanetName,
  orbitTiltDeg = 17, // Güneş etrafında ~17° eğimli yörünge
  onPlanetLabelClick,
}) {
  const orbitTiltRad = THREE.MathUtils.degToRad(orbitTiltDeg);

  const handlePlanetLabelClick = (e) => {
    e.stopPropagation();
    if (!onPlanetLabelClick || !planetRef?.current) return;
    const wp = new THREE.Vector3();
    planetRef.current.getWorldPosition(wp);
    onPlanetLabelClick("Pluto", [wp.x, wp.y, wp.z], plutoRadius);
  };

  const isFocused = focusedPlanetName === "Pluto";

  return (
    <group ref={groupRef}>
      <group rotation-z={orbitTiltRad}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[plutoOrbitRadius - 0.03, plutoOrbitRadius + 0.03, 128]}
          />
          <meshBasicMaterial
            color="#c6b6ff"
            transparent
            opacity={0.32}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={planetRef} position={[plutoOrbitRadius, 0, 0]}>
          <sphereGeometry args={[plutoRadius, 72, 72]} />
          <meshStandardMaterial
            map={plutoTex}
            roughness={0.8}
            metalness={0.18}
          />

          {showLabels && showLabelPluto && (
            <Html distanceFactor={13} position={[0, plutoRadius + 0.7, 0]}>
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
                Pluto
              </div>
            </Html>
          )}
        </mesh>
      </group>
    </group>
  );
}

export default PlutoSystem;
