import { useRef } from "react";
import { Html } from "@react-three/drei";
import { MilkyWay } from "./milky-way";

export function VegaPortal({ label, position }) {
  const ref = useRef();

  return (
    <group ref={ref} position={position}>
      <group scale={0.23} rotation={[0, -0.1, 0.12]}>
        <MilkyWay
          count={2500}
          size={0.015}
          radius={2.18}
          branches={8}
          spin={0.16}
          randomness={2.0}
          randomnessPower={1.55}
          insideColor="#dbeafe"
          outsideColor="#020617"
          visible={true}
        />

        {/* Vega (blue-white A-type look) */}
        <mesh position={[0.06, 0.02, 0]}>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial
            color="#eef6ff"
            emissive="#60a5fa"
            emissiveIntensity={3.2}
            roughness={0.14}
            metalness={0.08}
            toneMapped={false}
          />
        </mesh>

        <mesh position={[0.06, 0.02, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshBasicMaterial
            color="#93c5fd"
            transparent
            opacity={0.28}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0.06, 0.02, 0]}>
          <sphereGeometry args={[0.46, 32, 32]} />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.16}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[0.85, 0.92, 48]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.24}
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
          border: "1px solid rgba(129,140,248,0.9)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Html>
    </group>
  );
}

export default VegaPortal;
