import { useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function JupiterSystem({
  groupRef,
  planetRef,
  jupiterRadius,
  jupiterOrbitRadius,
  jupiterTex,
  labelScale,
  showLabelJupiter,
  showLabels,
  focusedPlanetName,
  moons = [],
  onPlanetLabelClick,
}) {
  const jupiterLocalGroupRef = useRef(null);

  const anglesRef = useRef({});

  useFrame((_, delta) => {
    moons.forEach((moon) => {
      const {
        name,
        ref,
        orbitRadius,
        orbitSpeed = 1.0,
        spinSpeed = 1.0,
        plane = "equatorial", // "equatorial" (XZ) | "tilted" (XY)
      } = moon;

      if (!ref?.current || !orbitRadius) return;

      const stop = focusedPlanetName === name;
      const speed = stop ? 0 : orbitSpeed;

      if (anglesRef.current[name] === undefined) {
        anglesRef.current[name] = Math.random() * Math.PI * 2;
      }
      anglesRef.current[name] += speed * delta;

      const a = anglesRef.current[name];

      let x = 0,
        y = 0,
        z = 0;

      if (plane === "equatorial") {
        x = orbitRadius * Math.cos(a);
        z = orbitRadius * Math.sin(a);
        y = 0;
      } else {
        x = orbitRadius * Math.cos(a);
        y = orbitRadius * Math.sin(a);
        z = 0;
      }

      ref.current.position.set(x, y, z);
      ref.current.rotation.y += spinSpeed * delta;
    });
  });

  const showLabelForMoon = (name) =>
    showLabels && (!focusedPlanetName || focusedPlanetName !== name);

  const focusBody = (e, name, ref, radius) => {
    e.stopPropagation();
    if (!onPlanetLabelClick || !ref.current) return;

    const wp = new THREE.Vector3();
    ref.current.getWorldPosition(wp);

    onPlanetLabelClick(name, [wp.x, wp.y, wp.z], radius);
  };

  return (
    <group ref={groupRef}>
      <group ref={jupiterLocalGroupRef} position={[jupiterOrbitRadius, 0, 0]}>
        {/* JUPITER */}
        <mesh ref={planetRef}>
          <sphereGeometry args={[jupiterRadius, 128, 128]} />
          <meshStandardMaterial
            map={jupiterTex}
            roughness={0.6}
            metalness={0.3}
          />

          {showLabelJupiter && (
            <Html distanceFactor={14} position={[0, jupiterRadius + 1, 0]}>
              <div
                className="px-2 py-1 rounded bg-black/70 text-white border border-white/30"
                style={{
                  fontSize: `${1.0 * labelScale}rem`,
                  cursor: "pointer",
                }}
                onClick={(e) =>
                  focusBody(e, "Jupiter", planetRef, jupiterRadius)
                }
              >
                Jupiter
              </div>
            </Html>
          )}
        </mesh>

        {moons
          .filter((m) => m.plane === "equatorial")
          .map((moon) => (
            <group key={moon.name}>
              {/* orbit halkası */}
              <mesh rotation-x={Math.PI / 2}>
                <ringGeometry
                  args={[
                    moon.orbitRadius - (moon.ringWidth ?? 0.02),
                    moon.orbitRadius + (moon.ringWidth ?? 0.02),
                    96,
                  ]}
                />
                <meshBasicMaterial
                  color={moon.ringColor ?? "#cccccc"}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={moon.ringOpacity ?? 0.45}
                />
              </mesh>

              {/* uydu küresi */}
              <mesh ref={moon.ref}>
                <sphereGeometry args={[moon.radius, 64, 64]} />
                <meshStandardMaterial
                  map={moon.texture}
                  roughness={0.8}
                  metalness={0.15}
                />
                {showLabelForMoon(moon.name) && (
                  <Html
                    distanceFactor={moon.htmlDistanceFactor ?? 12}
                    position={[0, moon.radius + (moon.labelOffset ?? 0.6), 0]}
                  >
                    <div
                      className="px-2 py-1 rounded bg-black/70 text-white border border-white/30"
                      style={{
                        fontSize: `${0.8 * labelScale}rem`,
                        cursor: "pointer",
                      }}
                      onClick={(e) =>
                        focusBody(e, moon.name, moon.ref, moon.radius)
                      }
                    >
                      {moon.name}
                    </div>
                  </Html>
                )}
              </mesh>
            </group>
          ))}

        {/* Tiltli orbital düzlemdeki uydular (Himalia, Elara, Pasiphae vb.) */}
        {moons
          .filter((m) => m.plane === "tilted")
          .map((moon) => {
            const tiltRad = ((moon.tiltDeg ?? 20) * Math.PI) / 180;
            return (
              <group key={moon.name} rotation={[tiltRad, 0, 0]}>
                {/* orbit halkası (tilt grubu ile birlikte eğik duruyor) */}
                <mesh>
                  <ringGeometry
                    args={[
                      moon.orbitRadius - (moon.ringWidth ?? 0.025),
                      moon.orbitRadius + (moon.ringWidth ?? 0.025),
                      96,
                    ]}
                  />
                  <meshBasicMaterial
                    color={moon.ringColor ?? "#ffddaa"}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={moon.ringOpacity ?? 0.4}
                  />
                </mesh>
                <mesh ref={moon.ref}>
                  <sphereGeometry args={[moon.radius, 64, 64]} />
                  <meshStandardMaterial
                    map={moon.texture}
                    roughness={0.8}
                    metalness={0.15}
                  />
                  {showLabelForMoon(moon.name) && (
                    <Html
                      distanceFactor={moon.htmlDistanceFactor ?? 13}
                      position={[0, moon.radius + (moon.labelOffset ?? 0.6), 0]}
                    >
                      <div
                        className="px-2 py-1 rounded bg-black/70 text-white border border-white/30"
                        style={{
                          fontSize: `${0.8 * labelScale}rem`,
                          cursor: "pointer",
                        }}
                        onClick={(e) =>
                          focusBody(e, moon.name, moon.ref, moon.radius)
                        }
                      >
                        {moon.name}
                      </div>
                    </Html>
                  )}
                </mesh>
              </group>
            );
          })}
      </group>
    </group>
  );
}

export default JupiterSystem;
