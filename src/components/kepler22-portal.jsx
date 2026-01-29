import { useRef } from "react";
import { Html } from "@react-three/drei";
import { MilkyWay } from "./milky-way";

export function Kepler22Portal({ label, position }) {
  const ref = useRef();

  return (
    <group ref={ref} position={position}>
      <group scale={0.22} rotation={[0, 0.12, 0.08]}>
        <MilkyWay
          count={1500}
          size={0.015}
          radius={2.1}
          branches={7}
          spin={0.12}
          randomness={1.8}
          randomnessPower={1.6}
          insideColor="#fff4c2"
          outsideColor="#1a243a"
          visible
        />
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial
            color="#fff1c1"
            emissive="#ffd27d"
            emissiveIntensity={2.2}
            roughness={0.28}
            metalness={0.22}
            toneMapped={false}
          />
        </mesh>
      </group>

      <Html
        position={[0, 0.7, 0]}
        center
        style={{
          fontSize: "12px",
          color: "white",
          background: "rgba(0,0,0,0.6)",
          padding: "2px 6px",
          borderRadius: "6px",
          border: "1px solid rgba(255,220,160,0.9)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Html>
    </group>
  );
}
