import { useRef } from "react";
import { Html } from "@react-three/drei";
import { MilkyWay } from "./milky-way";

export function SiriusPortal({ label, position /*, onClick */ }) {
  const ref = useRef();

  return (
    <group
      ref={ref}
      position={position}
      // Tıklama yok – sadece görsel portal:
      // onClick={onClick}
      // onPointerOver={() => (document.body.style.cursor = "pointer")}
      // onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <group scale={0.22} rotation={[0, 0.18, 0.08]}>
        <MilkyWay
          count={2300}
          size={0.015}
          radius={2.1}
          branches={9}
          spin={0.12}
          randomness={2.2}
          randomnessPower={1.6}
          insideColor="#c9f3ff"
          outsideColor="#020617"
          visible={true}
        />

        <mesh position={[-0.16, 0.02, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color="#e5f0ff"
            emissive="#60a5fa"
            emissiveIntensity={2.1}
            roughness={0.22}
            metalness={0.32}
          />
        </mesh>

        <mesh position={[-0.16, 0.02, 0]}>
          <sphereGeometry args={[0.23, 32, 32]} />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0.5, 0.01, 0.3]}>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshStandardMaterial
            color="#e5f0ff"
            emissive="#60a5fa"
            emissiveIntensity={2.1}
            roughness={0.22}
            metalness={0.32}
          />
        </mesh>

        <mesh position={[0.5, 0.01, 0.3]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.34}
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
          border: "1px solid rgba(125,211,252,0.8)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Html>
    </group>
  );
}
