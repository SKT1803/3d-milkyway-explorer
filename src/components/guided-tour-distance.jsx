import { useEffect, useRef, useState } from "react";

const AU_KM = 149_597_870.7;
const LY_KM = 9_460_730_472_580.8;

// Fixed, approximate Earth-to-body distances for every Solar System tour stop.
// Planet distances vary with orbital positions; these are illustrative values.
const SOLAR_AU = {
  sun: 1,
  mercury: 0.7,
  venus: 0.4,
  earth: 0,
  moon: 0.00257,
  mars: 1.5,
  jupiter: 4.2,
  saturn: 8.5,
  uranus: 18.2,
  neptune: 29,
};

// Every individual star/planet stop is explicitly included. Companions in
// distant systems share the same rounded Earth distance where their actual
// separation is insignificant at the displayed light-year precision.
const STELLAR_LY = {
  siriusA: 8.6,
  siriusB: 8.6,
  alphaA: 4.37,
  alphaB: 4.37,
  alphaProxima: 4.25,
  keplerStar: 620,
  keplerPlanet: 620,
  vega: 25,
  betelgeuse: 500,
  naos: 1080,
  antaresA: 550,
  antaresB: 550,
  capellaAa: 42.9,
  capellaAb: 42.9,
  capellaH: 42.9,
  capellaL: 42.9,
  castorAa: 51,
  castorAb: 51,
  castorBa: 51,
  castorBb: 51,
  castorCa: 51,
  castorCb: 51,
  sagittariusCore: 26000,
};

// Use the same destination distance throughout each interstellar transit.
const TRANSIT_LY = {
  toSirius: STELLAR_LY.siriusA,
  toAlpha: STELLAR_LY.alphaA,
  toKepler: STELLAR_LY.keplerStar,
  toVega: STELLAR_LY.vega,
  toBetelgeuse: STELLAR_LY.betelgeuse,
  toNaos: STELLAR_LY.naos,
  toAntares: STELLAR_LY.antaresA,
  toCapella: STELLAR_LY.capellaAa,
  toCastor: STELLAR_LY.castorAa,
  toSagittarius: STELLAR_LY.sagittariusCore,
};

const STOP_NAMES = {
  galaxy: "Milky Way",
  approach: "Solar System",
  transit: "Solar System",
  solar: "Solar System",
  sun: "Sun",
  mercury: "Mercury",
  venus: "Venus",
  earth: "Earth",
  moon: "Moon",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  siriusA: "Sirius A",
  siriusB: "Sirius B",
  alphaA: "Rigil Kentaurus",
  alphaB: "Toliman",
  alphaProxima: "Proxima Centauri",
  keplerStar: "Kepler-22",
  keplerPlanet: "Kepler-22b",
  vega: "Vega",
  betelgeuse: "Betelgeuse",
  naos: "Naos",
  antaresA: "Antares A",
  antaresB: "Antares B",
  capellaAa: "Capella Aa",
  capellaAb: "Capella Ab",
  capellaH: "Capella H",
  capellaL: "Capella L",
  castorAa: "Castor Aa",
  castorAb: "Castor Ab",
  castorBa: "Castor Ba",
  castorBb: "Castor Bb",
  castorCa: "YY Gem A (Ca)",
  castorCb: "YY Gem B (Cb)",
  sagittariusCore: "Sagittarius A*",
  toSirius: "To Sirius",
  toAlpha: "To Alpha Centauri",
  toKepler: "To Kepler-22",
  toVega: "To Vega",
  toBetelgeuse: "To Betelgeuse",
  toNaos: "To Naos",
  toAntares: "To Antares",
  toCapella: "To Capella",
  toCastor: "To Castor",
  toSagittarius: "To Sagittarius A*",
};

function getTargetKm(phase) {
  if (phase === "galaxy") return 50_000 * LY_KM; // Simulated overview camera position.
  if (["approach", "transit", "solar"].includes(phase)) return AU_KM;
  if (Object.hasOwn(SOLAR_AU, phase)) return SOLAR_AU[phase] * AU_KM;
  if (Object.hasOwn(STELLAR_LY, phase)) return STELLAR_LY[phase] * LY_KM;
  if (Object.hasOwn(TRANSIT_LY, phase)) return TRANSIT_LY[phase] * LY_KM;
  return null;
}

function formatDistance(km) {
  const format = (value, digits = 2) =>
    value.toLocaleString("en-US", { maximumFractionDigits: digits });

  if (km < 2_000_000) return [format(km, 0), "km"];
  if (km < LY_KM * 0.1) return [format(km / AU_KM), "AU"];
  return [format(km / LY_KM, km < 100 * LY_KM ? 2 : 0), "ly"];
}

export function GuidedTourDistance({ phase, paused }) {
  const targetKm = getTargetKm(phase);
  const distanceRef = useRef(targetKm ?? 0);
  const pausedRef = useRef(paused);
  const [distanceKm, setDistanceKm] = useState(targetKm ?? 0);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (targetKm === null) return;

    const from = distanceRef.current;
    const duration = phase.startsWith("to")
      ? 8400
      : phase === "approach"
        ? 5500
        : phase === "solar"
          ? 6000
          : 3800;

    let elapsed = 0;
    let lastTime = null;
    let frameId;

    const tick = (now) => {
      if (lastTime !== null && !pausedRef.current) elapsed += now - lastTime;
      lastTime = now;

      const t = Math.min(elapsed / duration, 1);
      const smooth = t * t * (3 - 2 * t);
      // Smooth even when traveling between km, AU, and light-year scales.
      const km = Math.expm1(
        Math.log1p(from) * (1 - smooth) + Math.log1p(targetKm) * smooth,
      );
      distanceRef.current = km;
      setDistanceKm(km);

      if (t < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [phase, targetKm]);

  if (targetKm === null) return null;

  const [value, unit] = formatDistance(distanceKm);
  const isGalaxy = phase === "galaxy";

  return (
    <div
      className="pointer-events-none absolute right-4 top-4 z-40 w-[260px] rounded-xl border border-white/20 bg-black/70 p-3 text-white shadow-xl backdrop-blur-sm"
      style={{ left: "auto", right: 16, top: 16 }}
    >
      <div className="text-[0.9rem] uppercase tracking-[0.16em] text-gray-300">
        Distance from Earth
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold leading-snug tabular-nums">
          {value}
        </span>
        <span className="text-[0.9rem] text-sky-300">{unit}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-[0.9rem] text-gray-400">
        <span className="min-w-0 truncate">{STOP_NAMES[phase] ?? phase}</span>
        <span className="shrink-0 text-right">
          {isGalaxy ? "Simulated viewpoint" : "Approximate"}
        </span>
      </div>
    </div>
  );
}
