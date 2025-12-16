import * as THREE from "three";
import { Html } from "@react-three/drei";

export function MakemakeSystem({
  groupRef,
  planetRef,
  makemakeRadius,
  makemakeOrbitRadius,
  makemakeTex,
  labelScale,
  showLabelMakemake,
  showLabels,
  focusedPlanetName,
  orbitTiltDeg = 29,
  onPlanetLabelClick,
}) {
  const orbitTiltRad = THREE.MathUtils.degToRad(orbitTiltDeg);
  const isFocused = focusedPlanetName === "Makemake";

  const handlePlanetLabelClick = (e) => {
    e.stopPropagation();
    if (!onPlanetLabelClick || !planetRef?.current) return;
    const wp = new THREE.Vector3();
    planetRef.current.getWorldPosition(wp);
    onPlanetLabelClick("Makemake", [wp.x, wp.y, wp.z], makemakeRadius);
  };

  return (
    <group ref={groupRef}>
      <group rotation-z={orbitTiltRad}>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[
              makemakeOrbitRadius - 0.035,
              makemakeOrbitRadius + 0.035,
              128,
            ]}
          />
          <meshBasicMaterial
            color="#ffd8b0"
            transparent
            opacity={0.32}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Makemake küresi */}
        <mesh ref={planetRef} position={[makemakeOrbitRadius, 0, 0]}>
          <sphereGeometry args={[makemakeRadius, 64, 64]} />
          <meshStandardMaterial
            map={makemakeTex}
            roughness={0.82}
            metalness={0.16}
          />

          {showLabels && showLabelMakemake && (
            <Html distanceFactor={14} position={[0, makemakeRadius + 0.7, 0]}>
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
                Makemake
              </div>
            </Html>
          )}
        </mesh>
      </group>
    </group>
  );
}

export default MakemakeSystem;
