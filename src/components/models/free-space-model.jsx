import React, { forwardRef } from "react";
import { Html } from "@react-three/drei";
import ModelAsset from "./model-asset";

const FreeSpaceModel = forwardRef(function FreeSpaceModel(
  {
    name,
    url,
    position,
    rotation,
    scale,
    showLabel = true,
    labelScale = 1,
    labelOffset = [0, 6, 0],
    onLabelClick,
    focusedName,
    onClickModel,
  },
  ref,
) {
  const showLabelFor = (n) => showLabel && (!focusedName || focusedName !== n);

  return (
    <group ref={ref} position={position}>
      <ModelAsset
        url={url}
        position={[0, 0, 0]}
        rotation={rotation}
        scale={scale}
        center
        name={name}
      />

      {showLabelFor(name) && (
        <Html distanceFactor={12} position={labelOffset}>
          <div
            className="px-2 py-1 rounded bg-black/70 text-white border border-white/30"
            style={{ fontSize: `${0.9 * labelScale}rem`, cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onLabelClick?.(name);
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </group>
  );
});

export default FreeSpaceModel;
