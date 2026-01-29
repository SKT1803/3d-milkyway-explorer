import React, { useMemo } from "react";
import FreeSpaceModel from "./free-space-model";
import OrbitingModel from "./orbiting-model";
import { CUSTOM_MODELS } from "./model-registry";

/**
 * anchors: {
 *   Earth: <group> içine render edilecek şeyler,
 *   Mars: ...,
 * }
 */
export default function CustomModels({
  focusedName,
  onFocusRequest, // (name) => focusPlanetByName(name) gibi
  labelScale = 1,
  anchors = {}, // { Earth: true, Mars: true ... } sadece hangi anchor’ı render edeceğimizi söyleyeceğiz
  renderFree = true,
  modelRefs = {},
}) {
  const freeModels = useMemo(
    () => CUSTOM_MODELS.filter((m) => m.type === "free"),
    [],
  );

  const orbitModelsByParent = useMemo(() => {
    const map = {};
    for (const m of CUSTOM_MODELS) {
      if (m.type !== "orbit") continue;
      if (!m.parent) continue;
      if (!map[m.parent]) map[m.parent] = [];
      map[m.parent].push(m);
    }
    return map;
  }, []);

  return (
    <>
      {renderFree &&
        freeModels.map((m) => (
          <FreeSpaceModel
            key={m.id}
            name={m.name}
            ref={modelRefs[m.name]}
            url={m.url}
            position={m.position}
            rotation={m.rotation}
            scale={m.scale}
            showLabel={m.showLabel}
            focusedName={focusedName}
            labelScale={m.labelScale ?? labelScale}
            labelOffset={m.labelOffset}
            onLabelClick={(name) => onFocusRequest?.(name)}
            onClickModel={() => onFocusRequest?.(m.name)}
          />
        ))}
      {Object.keys(anchors).map((parentName) => {
        const list = orbitModelsByParent[parentName] || [];
        if (list.length === 0) return null;

        return (
          <group key={`orbit-${parentName}`}>
            {list.map((m) => (
              <OrbitingModel
                key={m.id}
                name={m.name}
                externalOrbitRef={modelRefs[m.name]}
                url={m.url}
                orbitRadius={m.orbit?.radius ?? 2}
                orbitSpeed={m.orbit?.speed ?? 1}
                plane={m.orbit?.plane ?? "equatorial"}
                tiltDeg={m.orbit?.tiltDeg ?? 0}
                initialPhase={m.orbit?.initialPhase ?? 0}
                showRing={m.orbit?.showRing ?? true}
                ringWidth={m.orbit?.ringWidth ?? 0.02}
                ringOpacity={m.orbit?.ringOpacity ?? 0.35}
                ringColor={m.orbit?.ringColor ?? "#ffffff"}
                rotation={m.rotation ?? [0, 0, 0]}
                scale={m.scale ?? 1}
                spinEnabled={m.spin?.enabled ?? true}
                spinSpeed={m.spin?.speed ?? 0.2}
                spinAxis={m.spin?.axis ?? "y"}
                showLabel={m.showLabel}
                labelScale={m.labelScale ?? labelScale}
                labelOffset={m.labelOffset ?? [0, 0.6, 0]}
                onLabelClick={(name) => onFocusRequest?.(name)}
                focusedName={focusedName}
                onClickModel={() => onFocusRequest?.(m.name)}
                paused={focusedName === m.name}
              />
            ))}
          </group>
        );
      })}
    </>
  );
}
