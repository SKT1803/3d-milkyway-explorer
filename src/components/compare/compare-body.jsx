import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

import { COMPARE_BODIES } from "../../data/celestial-bodies";
import {
  SOURCE_STAR_PRESETS,
  SOURCE_STAR_HALO_STOPS,
} from "./star-source-presets";

export { COMPARE_BODIES } from "../../data/celestial-bodies";

// ONE common time scale for all bodies with measured sidereal rotation periods:
// 1 real second = 1 simulated hour. This preserves physical relative spin rates
// without forcing a real-time astronomical simulation (which would look static).
const SIMULATED_HOURS_PER_SECOND = 1;

function getVisualAngularSpeed(data) {
  // Negative sidereal periods turn retrograde automatically.
  const hours = data.rotationPeriodHours;
  if (
    typeof hours === "number" &&
    Number.isFinite(hours) &&
    hours !== 0 &&
    !data.rotationPeriodStatus
  ) {
    return (2 * Math.PI * SIMULATED_HOURS_PER_SECOND) / hours;
  }

  // For stars with no established rotation period, the Sun with differential
  // rotation, and spacecraft/GLTF display models: visual motion ONLY.
  // This fallback is not a scientific measurement or a physical speed ratio.
  return data.previewSpinSpeed ?? 0;
}

function SurfaceSphere({ data }) {
  const tex = useTexture(data.texture);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  }, [tex]);

  return (
    <mesh scale={data.ellipsoidScale ?? [1, 1, 1]}>
      <sphereGeometry
        args={[1, data.surfaceSegments ?? 96, data.surfaceSegments ?? 96]}
      />
      <meshStandardMaterial
        map={tex}
        roughness={data.roughness ?? 0.8}
        metalness={data.metalness ?? 0.1}
      />
    </mesh>
  );
}

function CloudShell({ data, autoRotate }) {
  const ref = useRef(null);
  const tex = useTexture(data.cloudTexture);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  }, [tex]);

  useFrame((_, delta) => {
    if (autoRotate && ref.current) {
      const relativeSpeed =
        (data.cloudSpinSpeed ?? 0.14) - (data.previewSpinSpeed ?? 0.12);
      ref.current.rotation.y += relativeSpeed * delta;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry
        args={[
          data.cloudScale ?? 1.02,
          data.cloudSegments ?? 96,
          data.cloudSegments ?? 96,
        ]}
      />
      <meshStandardMaterial
        map={tex}
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  );
}

// Saturn: preserve the source scene's equatorial ring orientation, but keep
// ring orientation independent from the spinning planet texture.  The source
// nests the ring under Saturn's mesh; here we separate those transforms to
// prevent the ring plane from tilting as the planet turns.  The internal ring
// texture still spins in its own plane (0.25 rad/s) as in solar-system.jsx.
function SaturnVisual({ data, autoRotate }) {
  const planetRef = useRef(null);
  const ringRef = useRef(null);
  const planetMap = useTexture(data.texture);
  const ringMap = useTexture(data.ringTexture);

  useEffect(() => {
    planetMap.colorSpace = THREE.SRGBColorSpace;
    planetMap.needsUpdate = true;
    ringMap.colorSpace = THREE.SRGBColorSpace;
    ringMap.needsUpdate = true;
  }, [planetMap, ringMap]);

  useFrame((_, delta) => {
    if (!autoRotate) return;
    if (planetRef.current) {
      planetRef.current.rotation.y += getVisualAngularSpeed(data) * delta;
    }
    // This rotates the ring's texture around the ring's OWN normal;
    // the outer group keeps the XZ plane fixed throughout the animation.
    if (ringRef.current) ringRef.current.rotation.z += 0.25 * delta;
  });

  return (
    <group>
      <mesh ref={planetRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          map={planetMap}
          roughness={data.roughness ?? 0.7}
          metalness={data.metalness ?? 0.25}
        />
      </mesh>
      {/* Ring geometry begins in XY; tilt its non-animated parent into XZ. */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh ref={ringRef}>
          <ringGeometry args={[1.3, 2.1, 128]} />
          <meshStandardMaterial
            map={ringMap}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>
    </group>
  );
}

function SunVisual({ data }) {
  const sunMap = useTexture(data.texture);
  useEffect(() => {
    sunMap.colorSpace = THREE.SRGBColorSpace;
    sunMap.needsUpdate = true;
  }, [sunMap]);
  return (
    <mesh>
      <sphereGeometry args={[1, 128, 128]} />
      <meshBasicMaterial map={sunMap} />
    </mesh>
  );
}

// Compare-only presentation decision: leave each star's source material and
// animated emissive surface unchanged, but turn OFF billboard halo sprites.
// 0 = no external glow / no canvas gradient allocation; 1 = original halo size.
const STAR_HALO_SIZE_MULTIPLIER = 0;

// Same visual materials, gradients and animated emission as original star systems.
// Compare still isolates one celestial body, so source orbital groups and labels
// are intentionally excluded. We do NOT synthesize a single generic star shader.
function createSourceHalo(stops) {
  if (typeof document === "undefined" || !stops) return null;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [position, color] of stops) gradient.addColorStop(position, color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function SourceStarVisual({ data }) {
  const visual = SOURCE_STAR_PRESETS[data.name];
  const tex = useTexture(data.texture);
  const matRef = useRef(null);
  const haloRef = useRef(null);
  const haloStops = visual?.halo ? SOURCE_STAR_HALO_STOPS[visual.halo] : null;
  const haloSize = (visual?.haloSize ?? 0) * STAR_HALO_SIZE_MULTIPLIER;
  const haloTexture = useMemo(
    () => (haloSize > 0 ? createSourceHalo(haloStops) : null),
    [haloStops, haloSize],
  );

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  }, [tex]);
  useEffect(() => () => haloTexture?.dispose(), [haloTexture]);

  useFrame(({ clock }) => {
    if (!visual) return;
    const rate = visual.pulse?.[0] ?? 0.9;
    const phase = visual.pulse?.[1] ?? 0;
    const pulse = 0.55 + 0.45 * Math.sin(clock.elapsedTime * rate + phase);
    if (visual.pulse && matRef.current) {
      matRef.current.emissiveIntensity =
        visual.pulse[2] + pulse * visual.pulse[3];
    }
    if (haloRef.current) {
      const base = haloSize;
      const scale = base * (1 + pulse * (visual.haloScalePulse ?? 0.14));
      haloRef.current.scale.set(scale, scale, 1);
      haloRef.current.material.opacity =
        visual.haloOpacity + pulse * visual.haloOpacityAmp;
    }
  });

  return (
    <>
      <mesh scale={data.ellipsoidScale ?? [1, 1, 1]}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          ref={matRef}
          map={tex}
          emissiveMap={tex}
          roughness={visual?.roughness ?? 1}
          metalness={visual?.metalness ?? 0}
          emissive={visual?.emissive ?? "#ffffff"}
          emissiveIntensity={visual?.emissiveIntensity ?? 0.5}
          toneMapped={false}
        />
      </mesh>
      {haloTexture && haloSize > 0 && (
        <sprite ref={haloRef} scale={[haloSize, haloSize, 1]}>
          <spriteMaterial
            map={haloTexture}
            transparent
            opacity={visual.haloOpacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      )}
    </>
  );
}

// Sagittarius A*: use the EXACT same GLTF asset as SagittariusSystem.
// Only its placement and overall size are normalized for an isolated viewport.
// This is a 3D model, NOT a procedurally invented black hole/ring visualization.
const BLACK_HOLE_MODEL_URL = "/models/blackhole/scene.gltf";

function SagittariusBlackHoleVisual({ data }) {
  const gltf = useGLTF(BLACK_HOLE_MODEL_URL);

  // Clone the original scene so the main Galaxy scene and both Compare panels
  // can use the cached GLTF without sharing mutable object transforms.
  // Geometry/materials/textures stay those of the original imported model.
  const { clone, normalizedScale } = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clonedScene);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const halfMax = Math.max(size.x, size.y, size.z) / 2;

    if (!bounds.isEmpty() && Number.isFinite(halfMax) && halfMax > 1e-6) {
      clonedScene.position.sub(center);
    }

    return {
      clone: clonedScene,
      normalizedScale:
        Number.isFinite(halfMax) && halfMax > 1e-6
          ? (data.visualExtent ?? 2.2) / halfMax
          : 1,
    };
  }, [gltf.scene, data.visualExtent]);

  return (
    <group scale={normalizedScale}>
      <primitive object={clone} />
    </group>
  );
}

// Galaxy's original, actively used GLB models. Individual models are centered
// and normalized by their longest visible dimension (rather than the world's
// arbitrary scene scale) before the common Compare size factor is applied.
function SpacecraftVisual({ data }) {
  const gltf = useGLTF(data.modelUrl);
  const { clone, normalization } = useMemo(() => {
    const object = gltf.scene.clone(true);
    const [rx, ry, rz] = data.modelRotation ?? [0, 0, 0];
    object.rotation.set(rx, ry, rz);
    object.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const largest = Math.max(size.x, size.y, size.z);

    if (!box.isEmpty() && Number.isFinite(largest) && largest > 1e-8) {
      object.position.sub(center);
    }
    return {
      clone: object,
      normalization:
        Number.isFinite(largest) && largest > 1e-8 ? 2 / largest : 1,
    };
  }, [gltf.scene, data.modelRotation]);

  return (
    <group scale={normalization}>
      <primitive object={clone} />
    </group>
  );
}

function BodyVisual({ data, radius, autoRotate }) {
  const spinRef = useRef(null);

  useFrame((_, delta) => {
    if (autoRotate && spinRef.current && data.renderKind !== "saturn") {
      spinRef.current.rotation.y += getVisualAngularSpeed(data) * delta;
    }
  });

  return (
    <group scale={radius}>
      <group ref={spinRef}>
        {data.renderKind === "sun" ? (
          <SunVisual data={data} />
        ) : data.renderKind === "betelgeuse" ? (
          <SourceStarVisual data={data} />
        ) : data.renderKind === "star" ? (
          <SourceStarVisual data={data} />
        ) : data.renderKind === "blackholeModel" ? (
          <SagittariusBlackHoleVisual data={data} />
        ) : data.renderKind === "spacecraft" ? (
          <SpacecraftVisual data={data} />
        ) : data.renderKind === "saturn" ? (
          <SaturnVisual data={data} autoRotate={autoRotate} />
        ) : (
          <SurfaceSphere data={data} />
        )}
        {data.cloudTexture && (
          <CloudShell data={data} autoRotate={autoRotate} />
        )}
      </group>
    </group>
  );
}

/**
 * One selected object, without parent system orbital paths/labels/satellites.
 * Scene radius is calculated by CompareView from physical catalog radiusKm.
 */
export function CompareBody({ body, radius = 1, autoRotate = true }) {
  const data = COMPARE_BODIES[body];
  if (!data) return null;
  // Model keyed, Canvas intentionally NOT keyed; independent zooms survive.
  return (
    <BodyVisual
      key={body}
      data={data}
      radius={radius}
      autoRotate={autoRotate}
    />
  );
}
