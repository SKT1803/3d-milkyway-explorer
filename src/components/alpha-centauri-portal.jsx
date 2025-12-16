import { useRef } from "react";
import { Html } from "@react-three/drei";
import { MilkyWay } from "./milky-way";

export function AlphaCentauriPortal({ label, position /*, onClick */ }) {
  const ref = useRef();

  return (
    <group
      ref={ref}
      position={position}
      // tıklanabilir yapmak icin:
      // onClick={onClick}
      // onPointerOver={() => (document.body.style.cursor = "pointer")}
      // onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <group scale={0.24} rotation={[0, -0.15, 0.1]}>
        <MilkyWay
          count={2600}
          size={0.015}
          radius={2.2}
          branches={8}
          spin={0.16}
          randomness={2.0}
          randomnessPower={1.6}
          insideColor="#d4f0ff"
          outsideColor="#020617"
          visible={true}
        />

        {/* Rigil Kentaurus */}
        <mesh position={[-0.2, 0.03, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color="#ffe4b8"
            emissive="#ffb74d"
            emissiveIntensity={1.9}
            roughness={0.26}
            metalness={0.35}
          />
        </mesh>
        <mesh position={[-0.2, 0.03, 0]}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshBasicMaterial
            color="#ffb74d"
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </mesh>

        {/* Toliman */}
        <mesh position={[0.28, 0.02, 0.04]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color="#ffe9c5"
            emissive="#ffcc80"
            emissiveIntensity={1.7}
            roughness={0.26}
            metalness={0.32}
          />
        </mesh>
        <mesh position={[0.08, 0.02, 0.04]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial
            color="#ffcc80"
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>

        {/* Proxima Centauri – uzakta küçük kırmızımsı */}
        <mesh position={[0.8, -0.03, -0.4]}>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshStandardMaterial
            color="#ffab91"
            emissive="#ff7043"
            emissiveIntensity={1.4}
            roughness={0.3}
            metalness={0.28}
          />
        </mesh>
        <mesh position={[0.8, -0.03, -0.4]}>
          <sphereGeometry args={[0.17, 32, 32]} />
          <meshBasicMaterial
            color="#ff7043"
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[0.85, 0.92, 48]} />
          <meshBasicMaterial
            color="#26c6da"
            transparent
            opacity={0.36}
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
          border: "1px solid rgba(129,212,250,0.85)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Html>
    </group>
  );
}

export default AlphaCentauriPortal;
