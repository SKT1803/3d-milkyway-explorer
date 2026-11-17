// Progress groups: Milky Way + 11 destination systems.
const PHASE_LABELS = {
  galaxy: "Milky Way Galaxy",
  approach: "Approaching the Solar System",
  transit: "Entering the Solar System",
  solar: "Solar System Overview",
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
  toSirius: "Traveling to Sirius",
  toAlpha: "Traveling to Alpha Centauri",
  toKepler: "Traveling to Kepler-22",
  toVega: "Traveling to Vega",
  toBetelgeuse: "Traveling to Betelgeuse",
  toNaos: "Traveling to Naos",
  toAntares: "Traveling to Antares",
  toCapella: "Traveling to Capella",
  toCastor: "Traveling to Castor",
  toSagittarius: "Traveling to Sagittarius A*",
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
  complete: "Tour complete",
};

const GROUPS = {
  galaxy: 1,
  approach: 2,
  transit: 2,
  solar: 2,
  sun: 2,
  mercury: 2,
  venus: 2,
  earth: 2,
  moon: 2,
  mars: 2,
  jupiter: 2,
  saturn: 2,
  uranus: 2,
  neptune: 2,
  siriusA: 3,
  siriusB: 3,
  alphaA: 4,
  alphaB: 4,
  alphaProxima: 4,
  keplerStar: 5,
  keplerPlanet: 5,
  vega: 6,
  betelgeuse: 7,
  naos: 8,
  antaresA: 9,
  antaresB: 9,
  capellaAa: 10,
  capellaAb: 10,
  capellaH: 10,
  capellaL: 10,
  castorAa: 11,
  castorAb: 11,
  castorBa: 11,
  castorBb: 11,
  castorCa: 11,
  castorCb: 11,
  sagittariusCore: 12,
  toSirius: 3,
  toAlpha: 4,
  toKepler: 5,
  toVega: 6,
  toBetelgeuse: 7,
  toNaos: 8,
  toAntares: 9,
  toCapella: 10,
  toCastor: 11,
  toSagittarius: 12,
  complete: 12,
};
export function GuidedTourControls({
  phase,
  paused,
  onPauseResume,
  onSkip,
  onExit,
}) {
  const complete = phase === "complete";
  const travelPhases = new Set([
    "toSirius",
    "toAlpha",
    "toKepler",
    "toVega",
    "toBetelgeuse",
    "toNaos",
    "toAntares",
    "toCapella",
    "toCastor",
    "toSagittarius",
  ]);
  const bodyPhases = new Set([
    "sun",
    "mercury",
    "venus",
    "earth",
    "moon",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "siriusA",
    "siriusB",
    "alphaA",
    "alphaB",
    "alphaProxima",
    "keplerStar",
    "keplerPlanet",
    "vega",
    "betelgeuse",
    "naos",
    "antaresA",
    "antaresB",
    "capellaAa",
    "capellaAb",
    "capellaH",
    "capellaL",
    "castorAa",
    "castorAb",
    "castorBa",
    "castorBb",
    "castorCa",
    "castorCb",
    "sagittariusCore",
  ]);
  const canPause = !complete && phase !== "transit" && !travelPhases.has(phase);
  const canSkip =
    ["galaxy", "approach", "solar"].includes(phase) || bodyPhases.has(phase);
  const progressIndex = GROUPS[phase] ?? 1;

  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-40 w-[min(420px,calc(100vw-24px))] -translate-x-1/2">
      <div className="pointer-events-auto rounded-xl border border-white/20 bg-black/85 px-4 py-3 text-white shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
              Guided Space Tour
            </div>
            <div className="mt-1 text-sm font-semibold">
              {PHASE_LABELS[phase] ?? "Exploring"}
            </div>
          </div>
          <span className="shrink-0 text-xs text-gray-400">
            {progressIndex} / 12
          </span>
        </div>
        <div className="mt-3 flex gap-1.5" aria-label="Tour progress">
          {Array.from({ length: 12 }, (_, index) => index + 1).map((step) => (
            <span
              key={step}
              className={`h-1 flex-1 rounded-full ${step <= progressIndex ? "bg-blue-400" : "bg-white/20"}`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {!complete && (
            <button
              type="button"
              className="rounded-md border border-white/30 px-3 py-1.5 text-xs text-white hover:bg-white/10 disabled:opacity-40"
              onClick={onPauseResume}
              disabled={!canPause}
            >
              {paused ? "▶ Resume" : "Ⅱ Pause"}
            </button>
          )}
          {canSkip && (
            <button
              type="button"
              className="rounded-md border border-white/30 px-3 py-1.5 text-xs text-white hover:bg-white/10"
              onClick={onSkip}
            >
              {["galaxy", "approach"].includes(phase)
                ? "Skip to Solar System"
                : "Next stop"}
            </button>
          )}
          <button
            type="button"
            className="ml-auto rounded-md border border-white/30 px-3 py-1.5 text-xs text-white hover:bg-white/10"
            onClick={onExit}
          >
            {complete ? "Finish" : "Exit Tour"}
          </button>
        </div>
      </div>
    </div>
  );
}
