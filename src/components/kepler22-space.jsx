import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Kepler22System } from "./kepler22-system";

export function Kepler22Space({
  position = [0, 0, 0],
  exitProgressRef,
  onPlanetLabelClick,
  focusedPlanetName,
  onRegisterPlanetFocusApi,
}) {
  const groupRef = useRef(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = exitProgressRef?.current ?? 0;
    const s = Math.max(0.001, 1 - p);
    groupRef.current.scale.set(s, s, s);
    groupRef.current.visible = p < 0.9;
  });

  return (
    <group ref={groupRef} position={position}>
      <Kepler22System
        showLabels={true}
        focusedPlanetName={focusedPlanetName}
        onPlanetLabelClick={onPlanetLabelClick}
        onRegisterPlanetFocusApi={onRegisterPlanetFocusApi}
      />
    </group>
  );
}
