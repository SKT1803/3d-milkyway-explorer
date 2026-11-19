import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { CompareBody } from "./compare-body";
import { COMPARE_BODIES } from "../../data/celestial-bodies";
import { CompareSelector } from "./compare-selector";

const DISPLAY_RADIUS = 1.1;

function getRotationPeriodLabel(data) {
  if (data.category === "Spacecraft" || data.category === "Black Hole")
    return null;

  if (data.rotationPeriodStatus)
    return `Rotation period: ${data.rotationPeriodStatus}`;
  const hours = data.rotationPeriodHours;
  if (typeof hours !== "number" || !Number.isFinite(hours) || hours === 0) {
    return data.name === "Sun"
      ? "Rotation period: Varies by latitude"
      : "Rotation period: Not available";
  }

  const magnitude = Math.abs(hours);
  const value = magnitude >= 48 ? magnitude / 24 : magnitude;
  const unit = magnitude >= 48 ? "days" : "hours";
  const formatted = value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  const approximation = data.rotationPeriodApproximate ? "≈" : "";
  return `Rotation period: ${approximation}${formatted} ${unit}${hours < 0 ? " (retrograde)" : ""}`;
}

function getSizeLabel(data) {
  if (data.category === "Spacecraft") {
    return `${data.sizeLabel}: ${data.referenceSpanM.toLocaleString("en-US")} m`;
  }
  const radiusLabel =
    data.radiusKind === "eventHorizon"
      ? "Event horizon radius"
      : data.radiusApproximate || data.approximateRadius
        ? "Approx. radius"
        : "Mean radius";
  return `${radiusLabel}: ${data.radiusKm.toLocaleString("en-US", { maximumFractionDigits: 2 })} km`;
}

// The physical-radius ratio can be enormous (e.g. Jupiter vs Betelgeuse).
// Keep each viewport's clipping plane proportional to its own object so
// independent zoom can reach even very small bodies in True Size Ratio.
function AdaptiveCameraClipping({ displayRadius }) {
  const { camera } = useThree();

  useLayoutEffect(() => {
    const nextNear = Math.min(0.01, Math.max(displayRadius * 0.06, 1e-9));
    if (camera.near !== nextNear) {
      camera.near = nextNear;
      camera.updateProjectionMatrix();
    }
  }, [camera, displayRadius]);

  return null;
}

function CompareViewport({
  body,
  displayRadius,
  scaleMode,
  trueCameraDistance,
  cameraFrameVersion,
  side,
  onChooseBody,
  selectionOpen,
}) {
  const selectedData = COMPARE_BODIES[body];
  const controlsRef = useRef(null);

  // The original 4-unit camera is ideal for a sphere, but crops Haumea's
  // elongated silhouette and Saturn's 2.1-radius rings. Preserve the common
  // 4-unit camera distance in True Size Ratio, which requires common scale.
  const extendedBody =
    selectedData.renderKind === "haumea" ||
    selectedData.renderKind === "saturn";
  const fitCameraDistance =
    scaleMode === "fit" && extendedBody
      ? 4 * Math.max(1, (selectedData.visualExtent ?? 1) / 1.25)
      : 4;

  // True Size uses an equal camera distance in both viewports. In Fit mode
  // each body is framed separately. Neither mode alters physical body radii.
  const cameraDistance =
    scaleMode === "true" ? trueCameraDistance : fitCameraDistance;

  useLayoutEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.reset();

    if (body === "Sagittarius A*") {
      // Preserve the user's 0.6 upward offset without altering the GLTF.
      const y = 0.6;
      controls.object.position.set(
        0,
        y,
        Math.sqrt(cameraDistance ** 2 - y ** 2),
      );
    } else if (body === "Saturn") {
      // In the source, Saturn's ring is flat in its equatorial XZ plane.
      // Raising the CAMERA reveals the ring without tilting the ring mesh.
      const y = cameraDistance * 0.3;
      controls.object.position.set(
        0,
        y,
        Math.sqrt(cameraDistance ** 2 - y ** 2),
      );
    } else {
      controls.object.position.set(0, 0, cameraDistance);
    }
    controls.target.set(0, 0, 0);
    controls.update();
    controls.saveState();
  }, [scaleMode, cameraFrameVersion, body, cameraDistance]);

  return (
    <section className="relative min-h-0 min-w-0 flex-1 overflow-hidden border-b border-white/10 md:border-b-0 md:border-r last:border-r-0">
      <div className="absolute inset-0" style={{ touchAction: "none" }}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 40, near: 0.01, far: 300 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <AdaptiveCameraClipping displayRadius={displayRadius} />
          <color attach="background" args={["#020309"]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 3, 7]} intensity={2.3} />
          <Stars
            radius={65}
            depth={30}
            count={850}
            factor={2}
            saturation={0}
            fade
            speed={0}
          />
          <Suspense fallback={null}>
            <CompareBody body={body} radius={displayRadius} autoRotate />
          </Suspense>
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.65}
            zoomSpeed={scaleMode === "true" ? 2.2 : 0.85}
            minDistance={Math.max(displayRadius * 1.25, 1e-9)}
            maxDistance={35}
          />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute left-5 top-5 z-10 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-gray-400 sm:left-7 sm:top-7">
        {side === "left" ? "01 / LEFT" : "02 / RIGHT"}
      </div>

      <div className="absolute right-5 top-5 z-20 sm:right-7 sm:top-7">
        <button
          type="button"
          onClick={onChooseBody}
          aria-label={`Change ${side} celestial body: ${body}`}
          aria-haspopup="dialog"
          aria-expanded={selectionOpen}
          className="flex items-center gap-3 rounded-md border border-white/20 bg-[#101115] px-3 py-2 text-sm text-white transition-colors hover:border-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
        >
          <span>{body}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-4 w-4 text-white/65"
          >
            <circle cx="10.8" cy="10.8" r="6.7" />
            <path d="m16 16 5 5" />
          </svg>
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-6 z-10 text-center sm:bottom-9">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          {body}
        </h2>
        <p className="mt-2 text-xs tracking-wide text-white/55 sm:text-sm">
          {getSizeLabel(selectedData)}
        </p>
        {getRotationPeriodLabel(selectedData) && (
          <p className="mt-1 text-xs tracking-wide text-white/45">
            {getRotationPeriodLabel(selectedData)}
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * Full-screen comparison view. Each body has its own lightweight WebGL canvas,
 * so rotation and wheel zoom are independent. The Solar System is not duplicated.
 * The parent decides when to mount this component and how to restore its scene.
 */
export function CompareView({ onClose }) {
  const [leftBody, setLeftBody] = useState("Earth");
  const [rightBody, setRightBody] = useState("Jupiter");
  const [scaleMode, setScaleMode] = useState("fit");
  const [cameraFrameVersion, setCameraFrameVersion] = useState(0);
  const [selectingSide, setSelectingSide] = useState(null);
  const [selectorAnchor, setSelectorAnchor] = useState(null);
  const fitButtonRef = useRef(null);

  const openSelector = (side) => {
    const rect = fitButtonRef.current?.getBoundingClientRect();
    setSelectorAnchor(
      rect
        ? {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
          }
        : null,
    );
    setSelectingSide(side);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (selectingSide) setSelectingSide(null);
        else onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, selectingSide]);

  const leftRadiusKm = COMPARE_BODIES[leftBody].radiusKm;
  const rightRadiusKm = COMPARE_BODIES[rightBody].radiusKm;
  const maxRadiusKm = Math.max(leftRadiusKm, rightRadiusKm);
  const leftDisplayRadius =
    scaleMode === "fit"
      ? DISPLAY_RADIUS
      : (DISPLAY_RADIUS * leftRadiusKm) / maxRadiusKm;
  const rightDisplayRadius =
    scaleMode === "fit"
      ? DISPLAY_RADIUS
      : (DISPLAY_RADIUS * rightRadiusKm) / maxRadiusKm;
  // Saturn's ring extends to 2.1x Saturn's mean radius. If the ring
  // occupies the wider side of a True Size comparison, zoom BOTH panels out
  // equally. This fits the ring while keeping the physical size ratio intact.
  const saturnExtent = Math.max(
    leftBody === "Saturn" ? leftDisplayRadius * 2.1 : 0,
    rightBody === "Saturn" ? rightDisplayRadius * 2.1 : 0,
  );
  const trueCameraDistance = Math.max(4, saturnExtent * 3.15);

  const ratio =
    Math.max(leftRadiusKm, rightRadiusKm) /
    Math.min(leftRadiusKm, rightRadiusKm);
  const biggerBody = leftRadiusKm >= rightRadiusKm ? leftBody : rightBody;
  const smallerBody = leftRadiusKm < rightRadiusKm ? leftBody : rightBody;
  const includesSpacecraft =
    COMPARE_BODIES[leftBody].category === "Spacecraft" ||
    COMPARE_BODIES[rightBody].category === "Spacecraft";

  const buttonClass = (active) =>
    `rounded-md border px-3 py-2 text-xs transition-colors sm:text-sm ${
      active
        ? "border-white/50 bg-white/15 text-white"
        : "border-white/15 bg-transparent text-white/65 hover:border-white/35 hover:text-white"
    }`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compare celestial bodies"
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#020309] font-serif text-white"
    >
      <header className="z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 bg-black px-5 py-4 sm:px-8">
        <div className="flex items-baseline gap-3">
          <span className="text-[0.9rem] font-semibold uppercase tracking-[0.16em] text-gray-400">
            Galaxy Explorer
          </span>
          <span className="text-white/25">/</span>
          <h1 className="text-base font-semibold sm:text-lg">Compare Size</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            ref={fitButtonRef}
            type="button"
            onClick={() => {
              setScaleMode("fit");
              setCameraFrameVersion((n) => n + 1);
            }}
            className={buttonClass(scaleMode === "fit")}
          >
            Fit to View
          </button>
          <button
            type="button"
            onClick={() => {
              setScaleMode("true");
              setCameraFrameVersion((n) => n + 1);
            }}
            className={buttonClass(scaleMode === "true")}
          >
            True Size Ratio
          </button>
          <button
            type="button"
            onClick={() => {
              setLeftBody(rightBody);
              setRightBody(leftBody);
              setCameraFrameVersion((n) => n + 1);
            }}
            className={buttonClass(false)}
            title="Swap bodies"
          >
            Swap
          </button>
          <button
            type="button"
            onClick={() => setCameraFrameVersion((n) => n + 1)}
            className={buttonClass(false)}
            title="Reset both cameras"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-1 rounded-md border border-white/20 px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Exit Compare Mode"
          >
            ✕ Exit
          </button>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col md:flex-row">
        <CompareViewport
          body={leftBody}
          displayRadius={leftDisplayRadius}
          scaleMode={scaleMode}
          trueCameraDistance={trueCameraDistance}
          cameraFrameVersion={cameraFrameVersion}
          side="left"
          onChooseBody={() => openSelector("left")}
          selectionOpen={selectingSide === "left"}
        />
        <CompareViewport
          body={rightBody}
          displayRadius={rightDisplayRadius}
          scaleMode={scaleMode}
          trueCameraDistance={trueCameraDistance}
          cameraFrameVersion={cameraFrameVersion}
          side="right"
          onChooseBody={() => openSelector("right")}
          selectionOpen={selectingSide === "right"}
        />
      </main>

      <footer className="z-20 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 bg-black px-5 py-3 text-xs text-white/55 sm:px-8">
        <span>
          Drag to rotate · Scroll to zoom · Double-click is not required
        </span>
        <span>
          {scaleMode === "true"
            ? `${biggerBody} is ${ratio.toFixed(2)}× the ${includesSpacecraft ? "reference span/diameter" : "radius"} of ${smallerBody}`
            : "Fit to View enlarges smaller bodies; proportions are not preserved"}
        </span>
      </footer>

      {selectingSide && (
        <CompareSelector
          side={selectingSide}
          anchorRect={selectorAnchor}
          currentBody={selectingSide === "left" ? leftBody : rightBody}
          onSelect={(name) => {
            if (selectingSide === "left") setLeftBody(name);
            else setRightBody(name);
            setSelectingSide(null);
          }}
          onClose={() => setSelectingSide(null)}
        />
      )}
    </div>
  );
}

export default CompareView;
