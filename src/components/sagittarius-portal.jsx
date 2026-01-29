import { useRef } from "react";
import { Html } from "@react-three/drei";
import { MilkyWay } from "./milky-way";

export function SagittariusPortal({ label, position }) {
  const ref = useRef();

  return (
    <group ref={ref} position={position}>
      <group scale={0.23} rotation={[0, -0.12, 0.12]}>
        <MilkyWay
          count={2500}
          size={0.015}
          radius={2.2}
          branches={8}
          spin={0.14}
          randomness={2.1}
          randomnessPower={1.6}
          insideColor="#e0d7ff"
          outsideColor="#020617"
          visible={true}
        />
        <mesh position={[0.05, 0.02, 0]}>
          <sphereGeometry args={[0.25, 48, 48]} />
          <meshBasicMaterial color="#000000" toneMapped={false} />
        </mesh>

        <mesh position={[0.05, 0.02, 0]}>
          <sphereGeometry args={[0.3, 48, 48]} />
          <meshBasicMaterial
            color="#a78bfa"
            transparent
            opacity={0.12}
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
          border: "1px solid rgba(167,139,250,0.9)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Html>
    </group>
  );
}

export default SagittariusPortal;
