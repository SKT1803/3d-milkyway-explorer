import { useRef } from "react";
import { Html } from "@react-three/drei";
import { MilkyWay } from "./milky-way";

export function NaosPortal({ label, position }) {
  const ref = useRef();

  return (
    <group ref={ref} position={position}>
      <group scale={0.23} rotation={[0, -0.1, 0.12]}>
        <MilkyWay
          count={2500}
          size={0.015}
          radius={2.2}
          branches={8}
          spin={0.16}
          randomness={2.15}
          randomnessPower={1.55}
          insideColor="#cfefff"
          outsideColor="#020617"
          visible={true}
        />
        <mesh position={[0.06, 0.02, 0]}>
          <sphereGeometry args={[0.36, 32, 32]} />
          <meshStandardMaterial
            color="#bfe9ff"
            emissive="#1ea7ff"
            emissiveIntensity={3.4}
            roughness={0.14}
            metalness={0.08}
            toneMapped={false}
          />
        </mesh>

        <mesh position={[0.06, 0.02, 0]}>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshBasicMaterial
            color="#7dd3fc"
            transparent
            opacity={0.34}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0.06, 0.02, 0]}>
          <sphereGeometry args={[0.44, 32, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.18}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[0.85, 0.92, 48]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.32}
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
          border: "1px solid rgba(56,189,248,0.9)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Html>
    </group>
  );
}

export default NaosPortal;
