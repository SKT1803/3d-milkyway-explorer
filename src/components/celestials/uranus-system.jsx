import { useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function UranusSystem({
  groupRef,
  planetRef,
  uranusRadius,
  uranusOrbitRadius,
  uranusTex,
  labelScale,
  showLabelUranus,
  showLabels,
  focusedPlanetName,
  moons,
  onPlanetLabelClick,
}) {
  const orbitGroupsRef = useRef([]);

  useFrame((_, delta) => {
    orbitGroupsRef.current.forEach((g, idx) => {
      if (!g) return;
      const moon = moons[idx];
      if (!moon) return;

      const stopOrbit = focusedPlanetName === moon.name;
      const orbitSpeed = stopOrbit ? 0 : moon.orbitSpeed || 1.0;

      // yörünge dönüşü
      g.rotation.y += orbitSpeed * delta;

      // kendi ekseninde dönüş (hep dönsün, Saturn deki gibi)
      if (moon.ref?.current) {
        moon.ref.current.rotation.y += (moon.spinSpeed || 1.0) * delta;
      }
    });
  });

  const handlePlanetLabelClick = (e) => {
    e.stopPropagation();
    if (!onPlanetLabelClick || !planetRef?.current) return;
    const wp = new THREE.Vector3();
    planetRef.current.getWorldPosition(wp);
    onPlanetLabelClick("Uranus", [wp.x, wp.y, wp.z], uranusRadius);
  };

  const handleMoonLabelClick = (e, moon) => {
    e.stopPropagation();
    if (!onPlanetLabelClick || !moon.ref?.current) return;
    const wp = new THREE.Vector3();
    moon.ref.current.getWorldPosition(wp);
    onPlanetLabelClick(moon.name, [wp.x, wp.y, wp.z], moon.radius);
  };

  return (
    <group ref={groupRef}>
      <group position={[uranusOrbitRadius, 0, 0]}>
        <mesh ref={planetRef}>
          <sphereGeometry args={[uranusRadius, 96, 96]} />
          <meshStandardMaterial
            map={uranusTex}
            roughness={0.6}
            metalness={0.25}
          />
        </mesh>

        {showLabels && showLabelUranus && (
          <Html distanceFactor={14} position={[0, uranusRadius + 1.1, 0]}>
            <div
              className="px-2 py-1 rounded bg-black/70 text-white border border-white/30"
              style={{
                fontSize: `${0.9 * labelScale}rem`,
                cursor: "pointer",
              }}
              onClick={handlePlanetLabelClick}
            >
              Uranus
            </div>
          </Html>
        )}

        {moons.map((moon, idx) => {
          const tiltRad =
            moon.plane === "tilted"
              ? THREE.MathUtils.degToRad(moon.tiltDeg || 20)
              : 0;

          return (
            <group
              key={moon.name}
              ref={(el) => {
                orbitGroupsRef.current[idx] = el;
                if (el && moon.plane === "tilted") {
                  // yörünge düzlemini eğ
                  el.rotation.x = tiltRad;
                }
              }}
            >
              <mesh rotation-x={Math.PI / 2}>
                <ringGeometry
                  args={[
                    moon.orbitRadius - (moon.ringWidth || 0.015),
                    moon.orbitRadius + (moon.ringWidth || 0.015),
                    64,
                  ]}
                />
                <meshBasicMaterial
                  color={moon.ringColor || "#aee7ff"}
                  transparent
                  opacity={0.32}
                  side={THREE.DoubleSide}
                />
              </mesh>

              <mesh
                ref={moon.ref}
                position={[moon.orbitRadius, 0, 0]}
                castShadow
                receiveShadow
              >
                <sphereGeometry args={[moon.radius, 64, 64]} />
                <meshStandardMaterial
                  map={moon.texture}
                  roughness={0.8}
                  metalness={0.15}
                />
              </mesh>

              {showLabels && focusedPlanetName !== moon.name && (
                <Html
                  distanceFactor={11}
                  position={[
                    moon.orbitRadius,
                    moon.radius + (moon.labelOffset || 0.45),
                    0,
                  ]}
                >
                  <div
                    className="px-1.5 py-0.5 rounded bg-black/70 text-white border border-white/30"
                    style={{
                      fontSize: `${0.8 * labelScale}rem`,
                      cursor: "pointer",
                    }}
                    onClick={(e) => handleMoonLabelClick(e, moon)}
                  >
                    {moon.name}
                  </div>
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}
