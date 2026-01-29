import React, { forwardRef, useMemo } from "react";
import { useGLTF, Center } from "@react-three/drei";

const ModelAsset = forwardRef(function ModelAsset(
  {
    url,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    center = true,
    normalize = false,
    castShadow = false,
    receiveShadow = false,
    name,
    onClick,
  },
  ref,
) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  cloned.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = castShadow;
      obj.receiveShadow = receiveShadow;
    }
  });

  const node = (
    <primitive
      ref={ref}
      object={cloned}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      name={name}
    />
  );

  if (!center && !normalize) return node;

  return <Center normalize={normalize}>{node}</Center>;
});

export default ModelAsset;
