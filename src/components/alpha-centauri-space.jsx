import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AlphaCentauriSystem } from "./alpha-centauri-system";

export function AlphaCentauriSpace({
  visible = true,
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
    const actuallyVisible = visible && exitProgress < 0.9;

    groupRef.current.visible = actuallyVisible;
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} position={position}>
      <AlphaCentauriSystem
        showLabels={visible}
        onPlanetLabelClick={onPlanetLabelClick}
        focusedPlanetName={focusedPlanetName}
        onRegisterPlanetFocusApi={
          visible ? onRegisterPlanetFocusApi : undefined
        }
      />
    </group>
  );
}

export default AlphaCentauriSpace;
