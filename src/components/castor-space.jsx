import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CastorSystem } from "./castor-system";

export function CastorSpace({
  position = [0, 0, 0],
  exitProgressRef,
  onPlanetLabelClick,
  focusedPlanetName,
  onRegisterPlanetFocusApi,
}) {
  const groupRef = useRef(null);

  useFrame(() => {
    if (!groupRef.current) return;

    const exitProgress = exitProgressRef?.current ?? 0;
    const s = Math.max(0.001, 1 - exitProgress);

    groupRef.current.scale.set(s, s, s);
    groupRef.current.visible = exitProgress < 0.9;
  });

  return (
    <group ref={groupRef} position={position}>
      <CastorSystem
        showLabels={true}
        onPlanetLabelClick={onPlanetLabelClick}
        focusedPlanetName={focusedPlanetName}
        onRegisterPlanetFocusApi={onRegisterPlanetFocusApi}
      />
    </group>
  );
}

export default CastorSpace;
