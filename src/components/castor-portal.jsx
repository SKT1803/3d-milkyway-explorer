import { useRef } from "react";
import { Html } from "@react-three/drei";
import { MilkyWay } from "./milky-way";

export function CastorPortal({ label, position }) {
  const ref = useRef();

  return (
    <group ref={ref} position={position}>
      <group scale={0.23} rotation={[0, -0.12, 0.12]}>
        <MilkyWay
          count={2500}
          size={0.015}
          radius={2.22}
          branches={8}
          spin={0.14}
          randomness={2.0}
          randomnessPower={1.6}
          insideColor="#a5d8ff"
          outsideColor="#020617"
          visible={true}
        />

        {/* =========================
            A pair (Aa blue / Ab red dwarf)
        ========================= */}
        <group position={[-0.28, 0.05, 0.06]}>
          {/* Aa (blue-white, hot) */}
          <mesh position={[-0.19, 0.0, 0]}>
            <sphereGeometry args={[0.15, 24, 24]} />
            <meshStandardMaterial
              color="#f0f7ff"
              emissive="#bfe7ff"
              emissiveIntensity={2.25}
              roughness={0.26}
              metalness={0.16}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[-0.19, 0.0, 0]}>
            <sphereGeometry args={[0.3, 24, 24]} />
            <meshBasicMaterial
              color="#8fd8ff"
              transparent
              opacity={0.18}
              depthWrite={false}
            />
          </mesh>

          {/* Ab (orange-red dwarf) */}
          <mesh position={[0.09, 0.0, 0]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial
              color="#ff8a4c"
              emissive="#ff4a2a"
              emissiveIntensity={1.35}
              roughness={0.34}
              metalness={0.08}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0.09, 0.0, 0]}>
            <sphereGeometry args={[0.18, 24, 24]} />
            <meshBasicMaterial
              color="#ff4a2a"
              transparent
              opacity={0.16}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* =========================
            B pair (Ba blue / Bb red dwarf)
        ========================= */}
        <group position={[0.2, 0.02, -0.05]}>
          <mesh position={[-0.08, 0.0, 0.1]}>
            <sphereGeometry args={[0.152, 24, 24]} />
            <meshStandardMaterial
              color="#f2fbff"
              emissive="#c9e0ff"
              emissiveIntensity={2.05}
              roughness={0.26}
              metalness={0.14}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[-0.08, 0.0, 0.1]}>
            <sphereGeometry args={[0.205, 24, 24]} />
            <meshBasicMaterial
              color="#7fd1ff"
              transparent
              opacity={0.17}
              depthWrite={false}
            />
          </mesh>

          {/* Bb (orange-red dwarf) */}
          <mesh position={[-0.08, 0.0, -0.2]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial
              color="#ff7b4a"
              emissive="#ff3b2a"
              emissiveIntensity={1.28}
              roughness={0.35}
              metalness={0.08}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[-0.08, 0.0, -0.2]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshBasicMaterial
              color="#ff3b2a"
              transparent
              opacity={0.14}
              depthWrite={false}
            />
          </mesh>
        </group>
        <group position={[0.02, 0.26, 0.35]}>
          {/* Ca */}
          <mesh position={[-0.165, 0.0, 0]}>
            <sphereGeometry args={[0.1, 24, 24]} />
            <meshStandardMaterial
              color="#ff6a5a"
              emissive="#ff2e2e"
              emissiveIntensity={1.2}
              roughness={0.38}
              metalness={0.06}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[-0.165, 0.0, 0]}>
            <sphereGeometry args={[0.19, 24, 24]} />
            <meshBasicMaterial
              color="#ff2e2e"
              transparent
              opacity={0.15}
              depthWrite={false}
            />
          </mesh>

          {/* Cb */}
          <mesh position={[0.165, 0.0, 0]}>
            <sphereGeometry args={[0.1, 24, 24]} />
            <meshStandardMaterial
              color="#ff5a45"
              emissive="#ff1f1f"
              emissiveIntensity={1.15}
              roughness={0.4}
              metalness={0.06}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0.165, 0.0, 0]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshBasicMaterial
              color="#ff1f1f"
              transparent
              opacity={0.14}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>

      <Html
        position={[0, 0.7, 0]}
        center
        style={{
          fontSize: "12px",
          color: "white",
          background: "rgba(0,0,15,0.7)",
          padding: "2px 6px",
          borderRadius: "6px",
          border: "1px solid rgba(96,165,250,0.85)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Html>
    </group>
  );
}

export default CastorPortal;
