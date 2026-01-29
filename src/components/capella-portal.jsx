import { useRef } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { MilkyWay } from "./milky-way";

export function CapellaPortal({ label, position }) {
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
          insideColor="#ffd2a6"
          outsideColor="#020617"
          visible={true}
        />

        <group position={[-0.55, 0.02, 0.05]}>
          <mesh rotation-x={Math.PI / 2}>
            <ringGeometry args={[0.38, 0.41, 64]} />
            <meshBasicMaterial
              color="#f59e0b"
              transparent
              opacity={0.22}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Aa */}
          <mesh position={[0.38, 0.02, -0.5]}>
            <sphereGeometry args={[0.34, 32, 32]} />
            <meshStandardMaterial
              color="#ffe4c8"
              emissive="#ff8a2a"
              emissiveIntensity={2.8}
              roughness={0.22}
              metalness={0.12}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0.38, 0.02, -0.5]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial
              color="#ff8a2a"
              transparent
              opacity={0.22}
              depthWrite={false}
            />
          </mesh>

          {/* Ab */}
          <mesh position={[0.38, 0.02, 0.3]}>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial
              color="#fff3cd"
              emissive="#ffd166"
              emissiveIntensity={2.2}
              roughness={0.24}
              metalness={0.12}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0.38, 0.02, 0.3]}>
            <sphereGeometry args={[0.42, 32, 32]} />
            <meshBasicMaterial
              color="#ffd166"
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
        </group>
        <group position={[0.75, -0.02, -0.05]}>
          <mesh rotation-x={Math.PI / 2}>
            <ringGeometry args={[0.22, 0.24, 64]} />
            <meshBasicMaterial
              color="#fb7185"
              transparent
              opacity={0.14}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* H */}
          <mesh position={[-0.22, 0.01, 0]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial
              color="#ffb7a2"
              emissive="#ff5a3a"
              emissiveIntensity={1.0}
              roughness={0.3}
              metalness={0.1}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[-0.22, 0.01, 0]}>
            <sphereGeometry args={[0.18, 32, 32]} />
            <meshBasicMaterial
              color="#ff5a3a"
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>

          {/* L */}
          <mesh position={[0.22, 0.01, 0.2]}>
            <sphereGeometry args={[0.11, 32, 32]} />
            <meshStandardMaterial
              color="#ffd0bf"
              emissive="#ff6b4a"
              emissiveIntensity={1.05}
              roughness={0.3}
              metalness={0.1}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0.22, 0.01, 0.2]}>
            <sphereGeometry args={[0.17, 32, 32]} />
            <meshBasicMaterial
              color="#ff6b4a"
              transparent
              opacity={0.2}
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
          border: "1px solid rgba(245,158,11,0.85)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Html>
    </group>
  );
}

export default CapellaPortal;
