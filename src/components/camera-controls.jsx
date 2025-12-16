import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import * as THREE from "three";

export const CameraControls = forwardRef(function CameraControls(
  { autoRotate, onCameraChange },
  ref
) {
  const controlsRef = useRef(null);
  const { camera } = useThree();
  const animationRef = useRef(null);

  useFrame(() => {
    const anim = animationRef.current;

    if (anim && controlsRef.current) {
      const now = performance.now();
      const tRaw = (now - anim.startTime) / anim.durationMs;
      const t = Math.min(Math.max(tRaw, 0), 1); // 0–1 clamp

      // kamera pozisyonu
      camera.position.lerpVectors(anim.fromPos, anim.toPos, t);

      // hedef (target)
      controlsRef.current.target.lerpVectors(anim.fromTarget, anim.toTarget, t);
      controlsRef.current.update();

      // animasyon bitti
      if (t >= 1) {
        animationRef.current = null;
      }
    }

    // her frame parent'a kamera bilgisini gönderiyoruz
    if (controlsRef.current && onCameraChange) {
      onCameraChange(
        camera.position.clone(),
        controlsRef.current.target.clone()
      );
    }
  });

  // App içinden kamerayı kontrol etmek için API
  useImperativeHandle(ref, () => ({
    // Direkt teleport
    setPositionAndTarget(positionArray, targetArray) {
      animationRef.current = null;
      camera.position.set(positionArray[0], positionArray[1], positionArray[2]);

      if (controlsRef.current) {
        controlsRef.current.target.set(
          targetArray[0],
          targetArray[1],
          targetArray[2]
        );
        controlsRef.current.update();
      }
    },

    animateTo(positionArray, targetArray, durationSeconds = 1.0) {
      if (!controlsRef.current) return;

      const fromPos = camera.position.clone();
      const toPos = new THREE.Vector3(
        positionArray[0],
        positionArray[1],
        positionArray[2]
      );

      const fromTarget = controlsRef.current.target.clone();
      const toTarget = new THREE.Vector3(
        targetArray[0],
        targetArray[1],
        targetArray[2]
      );

      animationRef.current = {
        fromPos,
        toPos,
        fromTarget,
        toTarget,
        startTime: performance.now(),
        durationMs: durationSeconds * 1000,
      };
    },
  }));

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      minDistance={1}
      maxDistance={5500} // far ile aynı aralıkta tut, kamerayı en fazla x uzağa göndermesine izin veriyoruz. fardan < olsun
      autoRotate={autoRotate}
      autoRotateSpeed={0.3}
      enableDamping
      dampingFactor={0.05}
    />
  );
});
