export function SpaceInfoPanel({
  mode,
  focus,
  activeInnerSpace,
  isWarping,
  isBackAnimating,
  focusedPlanet,
  planetButtonNames = [],
  onSetFocusMilkyWay,
  onSetFocusSun,
  onSetFocusSirius,
  onSetFocusAlpha,
  onBackToMilkyWay,
  onPlanetButtonClick,
  onResetSolarSystemView,
  onResetSiriusView,
  onResetAlphaView,
}) {
  const inGalaxy = mode === "galaxy";
  const inSolarSystem = mode === "inner" && activeInnerSpace === "sun";
  const inSiriusSystem = mode === "inner" && activeInnerSpace === "sirius";
  const inAlphaSystem =
    mode === "inner" && activeInnerSpace === "alphaCentauri";

  const inEarthSystem = focusedPlanet === "Earth" || focusedPlanet === "Moon";

  const inMarsSystem =
    focusedPlanet === "Mars" ||
    focusedPlanet === "Phobos" ||
    focusedPlanet === "Deimos";

  const inJupiterSystem =
    focusedPlanet === "Jupiter" ||
    focusedPlanet === "Io" ||
    focusedPlanet === "Europa" ||
    focusedPlanet === "Ganymede" ||
    focusedPlanet === "Callisto" ||
    focusedPlanet === "Amalthea" ||
    focusedPlanet === "Himalia" ||
    focusedPlanet === "Pasiphae" ||
    focusedPlanet === "Elara" ||
    focusedPlanet === "Thebe";

  const inSaturnSystem =
    focusedPlanet === "Saturn" ||
    focusedPlanet === "Titan" ||
    focusedPlanet === "Rhea" ||
    focusedPlanet === "Dione" ||
    focusedPlanet === "Tethys" ||
    focusedPlanet === "Enceladus" ||
    focusedPlanet === "Mimas" ||
    focusedPlanet === "Iapetus";

  const inUranusSystem =
    focusedPlanet === "Uranus" ||
    focusedPlanet === "Miranda" ||
    focusedPlanet === "Ariel" ||
    focusedPlanet === "Umbriel" ||
    focusedPlanet === "Titania" ||
    focusedPlanet === "Oberon";

  const inNeptuneSystem =
    focusedPlanet === "Neptune" ||
    focusedPlanet === "Proteus" ||
    focusedPlanet === "Triton";

  const starAndPlanets = [
    "Sun",
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
  ];

  const dwarfPlanets = ["Pluto", "Haumea", "Makemake", "Eris"];
  const beltRegions = ["Asteroid Belt", "Kuiper Belt"];
  const siriusBodies = ["Sirius A", "Sirius B"];
  const alphaBodies = ["Rigil Kentaurus", "Toliman", "Proxima Centauri"];

  const renderBodyButton = (name) => (
    <button
      key={name}
      className={`px-2 py-1.5 rounded text-base border transition-all
        ${
          focusedPlanet === name
            ? "bg-white text-black border-white"
            : "bg-black/40 border-white/30 text-gray-300"
        }`}
      onClick={() => onPlanetButtonClick(name)}
      disabled={isWarping || isBackAnimating}
    >
      {name}
    </button>
  );

  return (
    <div className="absolute top-4 left-4 z-30 pointer-events-none">
      <div className="flex gap-3 items-start">
        <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-xl p-3 shadow-xl pointer-events-auto w-[260px] sm:w-[300px] text-[1rem]">
          {/* Location */}
          <div className="text-white text-2xl font-semibold mb-1 leading-snug">
            <span className="block text-[0.9rem] uppercase tracking-[0.16em] text-gray-400">
              Current location
            </span>
            <span className="block mt-0.5">
              {inGalaxy
                ? "Milky Way Galaxy"
                : inSolarSystem
                ? "Solar System"
                : inSiriusSystem
                ? "Sirius System"
                : inAlphaSystem
                ? "Alpha Centauri System"
                : "Interstellar Space"}
            </span>
          </div>

          {/* Distance / info */}
          <div className="text-gray-300 text-base mb-3 leading-snug min-h-[72px]">
            {inGalaxy && (
              <>
                <div className="font-medium text-lg">Distance</div>
                <div className="mt-0.5">~26,000 light-years from Earth</div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Select a destination below, then zoom in to enter that region.
                </div>
              </>
            )}

            {(inSolarSystem || inSiriusSystem || inAlphaSystem) &&
              focusedPlanet && (
                <>
                  <div className="font-medium text-lg">Distance</div>
                  <div className="mt-0.5">
                    {/* Solar System */}
                    {inSolarSystem && (
                      <>
                        {focusedPlanet === "Sun" &&
                          "Center of the Solar System"}
                        {focusedPlanet === "Mercury" && "0.39 AU from the Sun"}
                        {focusedPlanet === "Venus" && "0.72 AU from the Sun"}
                        {focusedPlanet === "Earth" && "1 AU from the Sun"}
                        {focusedPlanet === "Moon" && "384,400 km from Earth"}
                        {focusedPlanet === "Mars" && "1.52 AU from the Sun"}
                        {focusedPlanet === "Jupiter" && "5.2 AU from the Sun"}
                        {focusedPlanet === "Saturn" && "9.54 AU from the Sun"}
                        {focusedPlanet === "Uranus" && "19.2 AU from the Sun"}
                        {focusedPlanet === "Neptune" && "30.06 AU from the Sun"}
                        {focusedPlanet === "Pluto" &&
                          "≈39.5 AU from the Sun (dwarf planet)"}
                        {focusedPlanet === "Haumea" &&
                          "≈43 AU from the Sun (dwarf planet)"}
                        {focusedPlanet === "Makemake" &&
                          "≈45.8 AU from the Sun (dwarf planet)"}
                        {focusedPlanet === "Eris" &&
                          "≈67.7 AU from the Sun (dwarf planet)"}
                        {focusedPlanet === "Phobos" &&
                          "Inner moon of Mars (~9,400 km from Mars)"}
                        {focusedPlanet === "Deimos" &&
                          "Outer moon of Mars (~23,500 km from Mars)"}
                        {focusedPlanet === "Europa" &&
                          "Orbits Jupiter (~671,000 km from Jupiter)"}
                        {focusedPlanet === "Elara" &&
                          "Orbits Jupiter (~11.7 million km from Jupiter)"}
                        {focusedPlanet === "Io" &&
                          "Orbits Jupiter (~421,700 km from Jupiter)"}
                        {focusedPlanet === "Ganymede" &&
                          "Orbits Jupiter (~1,070,000 km from Jupiter)"}
                        {focusedPlanet === "Callisto" &&
                          "Orbits Jupiter (~1,883,000 km from Jupiter)"}
                        {focusedPlanet === "Amalthea" &&
                          "Inner moon of Jupiter (~181,000 km from Jupiter)"}
                        {focusedPlanet === "Himalia" &&
                          "Outer irregular moon (~11.5 million km from Jupiter)"}
                        {focusedPlanet === "Pasiphae" &&
                          "Retrograde irregular moon (~23 million km from Jupiter)"}
                        {focusedPlanet === "Thebe" &&
                          "Inner moon of Jupiter (~222,000 km from Jupiter)"}
                        {focusedPlanet === "Titan" &&
                          "Largest moon of Saturn (~1.2 million km from Saturn)"}
                        {focusedPlanet === "Rhea" &&
                          "Orbits Saturn (~527,000 km from Saturn)"}
                        {focusedPlanet === "Dione" &&
                          "Orbits Saturn (~377,000 km from Saturn)"}
                        {focusedPlanet === "Tethys" &&
                          "Orbits Saturn (~295,000 km from Saturn)"}
                        {focusedPlanet === "Enceladus" &&
                          "Ice-rich moon (~238,000 km from Saturn)"}
                        {focusedPlanet === "Mimas" &&
                          "Cratered moon (~186,000 km from Saturn)"}
                        {focusedPlanet === "Iapetus" &&
                          "Distant moon (~3.5 million km from Saturn)"}
                        {focusedPlanet === "Miranda" &&
                          "Innermost major moon of Uranus (~130,000 km from Uranus)"}
                        {focusedPlanet === "Ariel" &&
                          "Icy moon of Uranus (~191,000 km from Uranus)"}
                        {focusedPlanet === "Umbriel" &&
                          "Dark moon of Uranus (~266,000 km from Uranus)"}
                        {focusedPlanet === "Titania" &&
                          "Largest moon of Uranus (~436,000 km from Uranus)"}
                        {focusedPlanet === "Oberon" &&
                          "Outer large moon of Uranus (~583,000 km from Uranus)"}
                        {focusedPlanet === "Proteus" &&
                          "Inner irregular moon of Neptune (~117,600 km from Neptune)"}
                        {focusedPlanet === "Triton" &&
                          "Largest moon of Neptune (~354,800 km from Neptune)"}
                        {focusedPlanet === "Asteroid Belt" &&
                          "Region of rocky bodies between Mars and Jupiter (~2–3.5 AU from the Sun)"}
                        {focusedPlanet === "Kuiper Belt" &&
                          "Icy debris region beyond Neptune (~30–50 AU from the Sun)"}
                      </>
                    )}

                    {/* Sirius System */}
                    {inSiriusSystem && (
                      <>
                        {focusedPlanet === "Sirius A" &&
                          "Main-sequence star ~8.6 light-years from Earth"}
                        {focusedPlanet === "Sirius B" &&
                          "White dwarf companion orbiting Sirius A (~50-year period)"}
                      </>
                    )}

                    {/* Alpha Centauri System */}
                    {inAlphaSystem && (
                      <>
                        {focusedPlanet === "Rigil Kentaurus" &&
                          "Sun-like star (Alpha Centauri A), ~4.37 light-years from Earth"}
                        {focusedPlanet === "Toliman" &&
                          "Slightly smaller companion star (Alpha Centauri B)"}
                        {focusedPlanet === "Proxima Centauri" &&
                          "Red dwarf third component, closest known star to the Sun (~4.24 ly)"}
                      </>
                    )}
                  </div>
                  <div className="text-gray-400 text-[0.9rem] mt-1">
                    Values are approximate average orbital / stellar distances.
                  </div>
                </>
              )}

            {inSolarSystem && !focusedPlanet && (
              <>
                <div className="font-medium text-lg">Overview</div>
                <div className="mt-0.5">You are inside our Solar System.</div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Click on planets in the scene, or use the shortcuts below to
                  jump to a specific body.
                </div>
              </>
            )}

            {inSiriusSystem && !focusedPlanet && (
              <>
                <div className="font-medium text-lg">Overview</div>
                <div className="mt-0.5">
                  You are inside the Sirius binary star system.
                </div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Use the buttons below or click directly on the stars to focus
                  on Sirius A or Sirius B.
                </div>
              </>
            )}

            {inAlphaSystem && !focusedPlanet && (
              <>
                <div className="font-medium text-lg">Overview</div>
                <div className="mt-0.5">
                  You are inside the Alpha Centauri triple star system.
                </div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Focus on Rigil Kentaurus, Toliman, or the distant Proxima
                  Centauri using the buttons below or by clicking the stars.
                </div>
              </>
            )}

            {!inGalaxy &&
              !inSolarSystem &&
              !inSiriusSystem &&
              !inAlphaSystem && (
                <>
                  <div className="font-medium text-lg">Overview</div>
                  <div className="mt-0.5">
                    Navigating through interstellar space between stars.
                  </div>
                  <div className="text-gray-400 text-[0.9rem] mt-1">
                    This region can host additional inner scenes in the future.
                  </div>
                </>
              )}
          </div>

          <div className="space-y-2">
            {inGalaxy && (
              <>
                <div className="text-gray-400 text-[0.9rem] mb-1">
                  Select destination:
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Galaxy */}
                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
          ${
            focus === "milkyWay"
              ? "bg-blue-500/30 border-blue-400 text-white"
              : "bg-black/40 border-white/20 text-gray-300"
          }`}
                    onClick={onSetFocusMilkyWay}
                    disabled={isWarping}
                  >
                    Galaxy
                  </button>

                  {/* Solar */}
                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
          ${
            focus === "sun"
              ? "bg-yellow-500/30 border-yellow-400 text-white"
              : "bg-black/40 border-white/20 text-gray-300"
          }`}
                    onClick={onSetFocusSun}
                    disabled={isWarping}
                  >
                    Solar System
                  </button>

                  {/* Sirius */}
                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
          ${
            focus === "sirius"
              ? "bg-sky-500/30 border-sky-400 text-white"
              : "bg-black/40 border-white/20 text-gray-300"
          }`}
                    onClick={onSetFocusSirius}
                    disabled={isWarping}
                  >
                    Sirius System
                  </button>

                  {/* Alpha Centauri */}
                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
          ${
            focus === "alphaCentauri"
              ? "bg-emerald-500/30 border-emerald-400 text-white"
              : "bg-black/40 border-white/20 text-gray-300"
          }`}
                    onClick={onSetFocusAlpha}
                    disabled={isWarping}
                  >
                    Alpha Centauri
                  </button>
                </div>
              </>
            )}

            {mode === "inner" && (
              <>
                <button
                  className="w-full px-3 py-1.5 rounded text-base border border-blue-400/50 bg-blue-500/20 text-blue-200"
                  onClick={onBackToMilkyWay}
                  disabled={isWarping || isBackAnimating}
                >
                  ← Back to Milky Way
                </button>

                {inSolarSystem && (
                  <>
                    <div className="text-gray-400 text-[0.9rem] mb-1">
                      Select celestial body:
                    </div>

                    <div className="mb-2">
                      <div className="text-gray-400 text-[0.8rem] uppercase tracking-wide mb-1">
                        Star & planets
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {starAndPlanets.map(renderBodyButton)}
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="text-gray-400 text-[0.8rem] uppercase tracking-wide mb-1">
                        Dwarf planets
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {dwarfPlanets.map(renderBodyButton)}
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="text-gray-400 text-[0.8rem] uppercase tracking-wide mb-1">
                        Belts & regions
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {beltRegions.map(renderBodyButton)}
                      </div>
                    </div>

                    <button
                      className="w-full px-3 py-1.5 rounded text-base border border-gray-500/50 bg-black/60 text-gray-300 mt-1"
                      onClick={onResetSolarSystemView}
                      disabled={isWarping || isBackAnimating}
                    >
                      Reset View
                    </button>
                  </>
                )}

                {inSiriusSystem && (
                  <>
                    <div className="text-gray-400 text-[0.9rem] mb-1">
                      Select star:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      {siriusBodies.map(renderBodyButton)}
                    </div>

                    <button
                      className="w-full px-3 py-1.5 rounded text-base border border-gray-500/50 bg-black/60 text-gray-300 mt-1"
                      onClick={onResetSiriusView}
                      disabled={isWarping || isBackAnimating}
                    >
                      Reset View
                    </button>
                  </>
                )}

                {inAlphaSystem && (
                  <>
                    <div className="text-gray-400 text-[0.9rem] mb-1">
                      Select star:
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      {alphaBodies.map(renderBodyButton)}
                      <div
                        className="opacity-0 pointer-events-none"
                        aria-hidden="true"
                      >
                        placeholder
                      </div>
                    </div>

                    <button
                      className="w-full px-3 py-1.5 rounded text-base border border-gray-500/50 bg-black/60 text-gray-300 mt-1"
                      onClick={onResetAlphaView}
                      disabled={isWarping || isBackAnimating}
                    >
                      Reset View
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {inSolarSystem &&
          (inEarthSystem ||
            inMarsSystem ||
            inJupiterSystem ||
            inSaturnSystem ||
            inUranusSystem ||
            inNeptuneSystem) && (
            <div className="flex flex-col gap-2 pointer-events-auto">
              {/* Earth system */}
              {inEarthSystem && (
                <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-xl p-2.5 shadow-xl min-w-[120px] max-w-[150px]">
                  <div className="text-gray-300 text-sm font-medium mb-1">
                    Around{" "}
                    <span className="text-gray-100 font-semibold">Earth</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      className={`w-full px-2 py-1 rounded text-[0.85rem] border transition-all
                      ${
                        focusedPlanet === "Moon"
                          ? "bg-white text-black border-white"
                          : "bg-black/40 border-white/30 text-gray-300"
                      }`}
                      onClick={() => onPlanetButtonClick("Moon")}
                      disabled={isWarping || isBackAnimating}
                    >
                      Moon
                    </button>
                  </div>
                </div>
              )}

              {/* Mars system */}
              {inMarsSystem && (
                <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-xl p-2.5 shadow-xl min-w-[130px] max-w-[160px]">
                  <div className="text-gray-300 text-sm font-medium mb-1">
                    Moons of{" "}
                    <span className="text-gray-100 font-semibold">Mars</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {["Phobos", "Deimos"].map((name) => (
                      <button
                        key={name}
                        className={`w-full px-2 py-1 rounded text-[0.85rem] border transition-all
                        ${
                          focusedPlanet === name
                            ? "bg-white text-black border-white"
                            : "bg-black/40 border-white/30 text-gray-300"
                        }`}
                        onClick={() => onPlanetButtonClick(name)}
                        disabled={isWarping || isBackAnimating}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Jupiter system */}
              {inJupiterSystem && (
                <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-xl p-2.5 shadow-xl min-w-[120px] max-w-[150px]">
                  <div className="text-gray-300 text-sm font-medium mb-1">
                    Moons of{" "}
                    <span className="text-gray-100 font-semibold">Jupiter</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {[
                      "Io",
                      "Europa",
                      "Ganymede",
                      "Callisto",
                      "Amalthea",
                      "Thebe",
                      "Himalia",
                      "Elara",
                      "Pasiphae",
                    ].map((name) => (
                      <button
                        key={name}
                        className={`w-full px-2 py-1 rounded text-[0.85rem] border transition-all
                        ${
                          focusedPlanet === name
                            ? "bg-white text-black border-white"
                            : "bg-black/40 border-white/30 text-gray-300"
                        }`}
                        onClick={() => onPlanetButtonClick(name)}
                        disabled={isWarping || isBackAnimating}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Saturn system */}
              {inSaturnSystem && (
                <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-xl p-2.5 shadow-xl min-w-[130px] max-w-[160px]">
                  <div className="text-gray-300 text-sm font-medium mb-1">
                    Moons of{" "}
                    <span className="text-gray-100 font-semibold">Saturn</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {[
                      "Titan",
                      "Rhea",
                      "Dione",
                      "Tethys",
                      "Enceladus",
                      "Mimas",
                      "Iapetus",
                    ].map((name) => (
                      <button
                        key={name}
                        className={`w-full px-2 py-1 rounded text-[0.85rem] border transition-all
                        ${
                          focusedPlanet === name
                            ? "bg-white text-black border-white"
                            : "bg-black/40 border-white/30 text-gray-300"
                        }`}
                        onClick={() => onPlanetButtonClick(name)}
                        disabled={isWarping || isBackAnimating}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Uranus system */}
              {inUranusSystem && (
                <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-xl p-2.5 shadow-xl min-w-[130px] max-w-[170px]">
                  <div className="text-gray-300 text-sm font-medium mb-1">
                    Moons of{" "}
                    <span className="text-gray-100 font-semibold">Uranus</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {["Miranda", "Ariel", "Umbriel", "Titania", "Oberon"].map(
                      (name) => (
                        <button
                          key={name}
                          className={`w-full px-2 py-1 rounded text-[0.85rem] border transition-all
                        ${
                          focusedPlanet === name
                            ? "bg-white text-black border-white"
                            : "bg-black/40 border-white/30 text-gray-300"
                        }`}
                          onClick={() => onPlanetButtonClick(name)}
                          disabled={isWarping || isBackAnimating}
                        >
                          {name}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Neptune system */}
              {inNeptuneSystem && (
                <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-xl p-2.5 shadow-xl min-w-[130px] max-w-[170px]">
                  <div className="text-gray-300 text-sm font-medium mb-1">
                    Moons of{" "}
                    <span className="text-gray-100 font-semibold">Neptune</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {["Proteus", "Triton"].map((name) => (
                      <button
                        key={name}
                        className={`w-full px-2 py-1 rounded text-[0.85rem] border transition-all
                        ${
                          focusedPlanet === name
                            ? "bg-white text-black border-white"
                            : "bg-black/40 border-white/30 text-gray-300"
                        }`}
                        onClick={() => onPlanetButtonClick(name)}
                        disabled={isWarping || isBackAnimating}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
