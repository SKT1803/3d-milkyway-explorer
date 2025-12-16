import { useRef } from "react";
import { Html } from "@react-three/drei";
import { MilkyWay } from "./milky-way";

export function SunPortal({ label, position /*, onClick */ }) {
  const ref = useRef();

  return (
    <group ref={ref} position={position}>
      <group scale={0.2} rotation={[0, 0.18, 0.08]}>
        <MilkyWay
          count={2200}
          size={0.016}
          radius={2.0}
          branches={10}
          spin={0.1}
          randomness={2.0}
          randomnessPower={1.7}
          insideColor="#fbe3b0"
          outsideColor="#1b1028"
          visible={true}
        />

        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial
            color="#f7e0a0"
            emissive="#f7e0a0"
            emissiveIntensity={1.8}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>
      </group>

      {/* LABEL */}
      <Html
        position={[0, 0.7, 0]}
        center
        style={{
          fontSize: "12px",
          color: "white",
          background: "rgba(0,0,0,0.45)",
          padding: "2px 6px",
          borderRadius: "6px",
          whiteSpace: "nowrap",
          border: "1px solid rgba(250, 204, 21, 0.9)",
        }}
      >
        {label}
      </Html>
    </group>
  );
}
