import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import * as THREE from "three";

export const CameraControls = forwardRef(function CameraControls(
  { autoRotate, onCameraChange, tourLocked = false },
  ref,
) {
  const controlsRef = useRef(null);
  const { camera } = useThree();
  const animationRef = useRef(null);
  const orbitOffsetRef = useRef(new THREE.Vector3());
  const yAxisRef = useRef(new THREE.Vector3(0, 1, 0));

  useFrame(() => {
    const anim = animationRef.current;

    if (anim && !anim.paused && controlsRef.current) {
      const now = performance.now();
      const tRaw = (now - anim.startTime) / anim.durationMs;
      const t = Math.min(Math.max(tRaw, 0), 1); // 0–1 clamp

      const progress = anim.easing === "smooth" ? t * t * (3 - 2 * t) : t;

      if (anim.type === "orbit") {
        orbitOffsetRef.current
          .copy(anim.fromOffset)
          .applyAxisAngle(yAxisRef.current, anim.angle * progress);
        camera.position.copy(anim.fromTarget).add(orbitOffsetRef.current);
        controlsRef.current.target.copy(anim.fromTarget);
      } else {
        camera.position.lerpVectors(anim.fromPos, anim.toPos, progress);
        controlsRef.current.target.lerpVectors(
          anim.fromTarget,
          anim.toTarget,
          progress,
        );
      }
      controlsRef.current.update();

      // animasyon bitti
      if (t >= 1) {
        animationRef.current = null;
        anim.onComplete?.();
      }
    }

    // her frame parent'a kamera bilgisini gönderiyoruz
    if (controlsRef.current && onCameraChange) {
      onCameraChange(
        camera.position.clone(),
        controlsRef.current.target.clone(),
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
          targetArray[2],
        );
        controlsRef.current.update();
      }
    },

    // Existing three-argument calls keep their previous behavior.
    // The tour additionally passes an onComplete callback and smooth easing.
    animateTo(
      positionArray,
      targetArray,
      durationSeconds = 1.0,
      onComplete = null,
      easing = "linear",
    ) {
      if (!controlsRef.current) return;

      const fromPos = camera.position.clone();
      const toPos = new THREE.Vector3(
        positionArray[0],
        positionArray[1],
        positionArray[2],
      );

      const fromTarget = controlsRef.current.target.clone();
      const toTarget = new THREE.Vector3(
        targetArray[0],
        targetArray[1],
        targetArray[2],
      );

      animationRef.current = {
        type: "fly",
        fromPos,
        toPos,
        fromTarget,
        toTarget,
        startTime: performance.now(),
        durationMs: Math.max(durationSeconds * 1000, 1),
        easing,
        onComplete,
        paused: false,
        pausedAt: null,
      };
    },

    orbitAroundTarget(durationSeconds = 6.5, angle = 0.78, onComplete = null) {
      if (!controlsRef.current) return;
      animationRef.current = {
        type: "orbit",
        fromTarget: controlsRef.current.target.clone(),
        fromOffset: camera.position.clone().sub(controlsRef.current.target),
        angle,
        startTime: performance.now(),
        durationMs: Math.max(durationSeconds * 1000, 1),
        easing: "smooth",
        onComplete,
        paused: false,
        pausedAt: null,
      };
    },

    pauseAnimation() {
      const anim = animationRef.current;
      if (!anim || anim.paused) return;
      anim.paused = true;
      anim.pausedAt = performance.now();
    },

    resumeAnimation() {
      const anim = animationRef.current;
      if (!anim || !anim.paused) return;
      anim.startTime += performance.now() - anim.pausedAt;
      anim.paused = false;
      anim.pausedAt = null;
    },

    cancelAnimation() {
      animationRef.current = null;
    },
  }));

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enablePan={!tourLocked}
      enableZoom={!tourLocked}
      enableRotate={!tourLocked}
      minDistance={0.2}
      maxDistance={5500} // far ile aynı aralıkta tut, kamerayı en fazla x uzağa göndermesine izin veriyoruz. fardan < olsun
      autoRotate={autoRotate}
      autoRotateSpeed={0.3}
      enableDamping
      dampingFactor={0.05}
    />
  );
});
