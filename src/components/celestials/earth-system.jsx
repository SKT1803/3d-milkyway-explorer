import { useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function EarthSystem({
  groupRef,
  earthRef,
  cloudsRef,
  moonGroupRef,
  moonRef,
  earthRadius,
  earthOrbitRadius,
  moonRadius,
  moonOrbitRadius,
  earthDay,
  earthClouds,
  moonTex,
  labelScale,
  showLabels,
  focusedPlanetName,
  onPlanetLabelClick,
}) {
  const moonAngleRef = useRef(0);

  const showLabelFor = (name) =>
    showLabels && (!focusedPlanetName || focusedPlanetName !== name);

  const focusBody = (e, name, ref, radius) => {
    e.stopPropagation();
    if (!onPlanetLabelClick || !ref.current) return;

    const wp = new THREE.Vector3();
    ref.current.getWorldPosition(wp);

    onPlanetLabelClick(name, [wp.x, wp.y, wp.z], radius);
  };

  const moonTiltDeg = 95;
  const moonTiltRad = (moonTiltDeg * Math.PI) / 180;

  useFrame((_, delta) => {
    if (!moonRef.current) return;

    const stop = focusedPlanetName === "Moon";
    const speed = stop ? 0 : 1.2; // orbit hızı
    moonAngleRef.current += speed * delta;

    const a = moonAngleRef.current;

    const x = moonOrbitRadius * Math.cos(a);
    const y = moonOrbitRadius * Math.sin(a);
    const z = 0;

    moonRef.current.position.set(x, y, z);
    moonRef.current.rotation.y += 0.25 * delta;
  });

  return (
    <group ref={groupRef}>
      <group position={[earthOrbitRadius, 0, 0]}>
        {/* EARTH */}
        <mesh ref={earthRef}>
          <sphereGeometry args={[earthRadius, 128, 128]} />
          <meshStandardMaterial
            map={earthDay}
            roughness={0.5}
            metalness={0.3}
          />

          {/* Bulut layer */}
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[earthRadius * 1.02, 96, 96]} />
            <meshStandardMaterial
              map={earthClouds}
              transparent
              opacity={0.6}
              depthWrite={false}
            />
          </mesh>

          {showLabelFor("Earth") && (
            <Html distanceFactor={12} position={[0, earthRadius + 1, 0]}>
              <div
                className="px-2 py-1 rounded bg-black/70 text-white border border-white/30"
                style={{
                  fontSize: `${1.0 * labelScale}rem`,
                  cursor: "pointer",
                }}
                onClick={(e) => focusBody(e, "Earth", earthRef, earthRadius)}
              >
                Earth
              </div>
            </Html>
          )}
        </mesh>

        {/* MOON SYSTEM – Earth merkezli, tiltli orbit düzlemi */}
        <group ref={moonGroupRef} rotation={[moonTiltRad, 0, 0]}>
          {/* Ring: XY düzleminde, tilt grubuyla birlikte eğiliyor */}
          <mesh>
            <ringGeometry
              args={[moonOrbitRadius - 0.01, moonOrbitRadius + 0.01, 96]}
            />
            <meshBasicMaterial
              color="#aaaaaa"
              side={THREE.DoubleSide}
              transparent
              opacity={0.5}
            />
          </mesh>

          <mesh ref={moonRef}>
            <sphereGeometry args={[moonRadius, 96, 96]} />
            <meshStandardMaterial
              map={moonTex}
              roughness={0.8}
              metalness={0.1}
            />
            {showLabelFor("Moon") && (
              <Html distanceFactor={12} position={[0, moonRadius + 0.8, 0]}>
                <div
                  className="px-2 py-1 rounded bg-black/70 text-white border border-white/30"
                  style={{
                    fontSize: `${0.8 * labelScale}rem`,
                    cursor: "pointer",
                  }}
                  onClick={(e) => focusBody(e, "Moon", moonRef, moonRadius)}
                >
                  Moon
                </div>
              </Html>
            )}
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default EarthSystem;
