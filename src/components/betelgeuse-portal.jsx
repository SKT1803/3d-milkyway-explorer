import { useRef } from "react";
import { Html } from "@react-three/drei";
import { MilkyWay } from "./milky-way";

export function BetelgeusePortal({ label, position }) {
  const ref = useRef();

  return (
    <group ref={ref} position={position}>
      <group scale={0.23} rotation={[0, -0.08, 0.12]}>
        <MilkyWay
          count={2400}
          size={0.015}
          radius={2.15}
          branches={8}
          spin={0.14}
          randomness={2.1}
          randomnessPower={1.6}
          insideColor="#ffb199"
          outsideColor="#020617"
          visible={true}
        />

        <mesh position={[0.05, 0.02, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#ffd3c6"
            emissive="#ff7043"
            emissiveIntensity={2.2}
            roughness={0.28}
            metalness={0.25}
          />
        </mesh>
        <mesh position={[0.05, 0.02, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshBasicMaterial
            color="#ff7043"
            transparent
            opacity={0.28}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[0.85, 0.92, 48]} />
          <meshBasicMaterial
            color="#fb7185"
            transparent
            opacity={0.28}
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
          border: "1px solid rgba(251,113,133,0.85)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Html>
    </group>
  );
}

export default BetelgeusePortal;
