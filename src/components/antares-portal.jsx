import { useRef } from "react";
import { Html } from "@react-three/drei";
import { MilkyWay } from "./milky-way";

export function AntaresPortal({ label, position }) {
  const ref = useRef();

  return (
    <group ref={ref} position={position}>
      <group scale={0.23} rotation={[0, -0.1, 0.12]}>
        <MilkyWay
          count={2500}
          size={0.015}
          radius={2.18}
          branches={8}
          spin={0.14}
          randomness={2.0}
          randomnessPower={1.6}
          insideColor="#ff9a6a"
          outsideColor="#020617"
          visible={true}
        />

        {/* Antares A */}
        <mesh position={[-0.18, 0.03, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial
            color="#ffd2c6"
            emissive="#ff4a1a"
            emissiveIntensity={3.2}
            roughness={0.22}
            metalness={0.12}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[-0.18, 0.03, 0]}>
          <sphereGeometry args={[0.58, 32, 32]} />
          <meshBasicMaterial
            color="#ff4a1a"
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>

        {/* Antares B */}
        <mesh position={[0.62, 0.07, 0.06]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial
            color="#cfefff"
            emissive="#1ea7ff"
            emissiveIntensity={2.1}
            roughness={0.14}
            metalness={0.08}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0.62, 0.07, 0.06]}>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshBasicMaterial
            color="#1ea7ff"
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[0.85, 0.92, 48]} />
          <meshBasicMaterial
            color="#fb923c"
            transparent
            opacity={0.26}
            depthWrite={false}
          />
        </mesh>
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
          border: "1px solid rgba(251,146,60,0.85)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Html>
    </group>
  );
}

export default AntaresPortal;
