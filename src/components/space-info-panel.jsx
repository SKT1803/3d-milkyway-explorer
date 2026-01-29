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
  onSetFocusBetelgeuse,
  onResetBetelgeuseView,
  onSetFocusNaos,
  onResetNaosView,
  onSetFocusAntares,
  onResetAntaresView,
  onSetFocusCapella,
  onResetCapellaView,
  onSetFocusCastor,
  onResetCastorView,
  onSetFocusSagittarius,
  onResetSagittariusView,
  onSetFocusKepler22,
  onResetKepler22View,
  onSetFocusVega,
  onResetVegaView,
}) {
  const inGalaxy = mode === "galaxy";
  const inSolarSystem = mode === "inner" && activeInnerSpace === "sun";
  const inSiriusSystem = mode === "inner" && activeInnerSpace === "sirius";
  const inAlphaSystem =
    mode === "inner" && activeInnerSpace === "alphaCentauri";
  const inBetelgeuseSystem =
    mode === "inner" && activeInnerSpace === "betelgeuse";
  const inNaosSystem = mode === "inner" && activeInnerSpace === "naos";
  const inAntaresSystem = mode === "inner" && activeInnerSpace === "antares";
  const inCapellaSystem = mode === "inner" && activeInnerSpace === "capella";
  const inCastorSystem = mode === "inner" && activeInnerSpace === "castor";
  const inSagittariusSystem =
    mode === "inner" && activeInnerSpace === "sagittarius";
  const inKepler22System = mode === "inner" && activeInnerSpace === "kepler22";
  const inVegaSystem = mode === "inner" && activeInnerSpace === "vega";

  const freeSpaceSolarOrbiters = {
    Earth: ["ISS", "Hubble"],
    // Mars: ["..."],
    // Jupiter: ["..."],
  };

  const freeSpaceSolarProbes = ["Voyager 1", "New Horizons"];
  const freeSpaceInterstellar = ["Voyager 1", "New Horizons"];

  const inEarthSystem =
    focusedPlanet === "Earth" ||
    focusedPlanet === "Moon" ||
    focusedPlanet === "ISS" ||
    focusedPlanet === "Hubble";

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

  const dwarfPlanets = ["Pluto", "Haumea", "Makemake", "Eris", "Ceres"];
  const beltRegions = ["Asteroid Belt", "Kuiper Belt"];
  const siriusBodies = ["Sirius A", "Sirius B"];
  const alphaBodies = ["Rigil Kentaurus", "Toliman", "Proxima Centauri"];
  const antaresBodies = ["Antares A", "Antares B"];
  const capellaBodies = ["Capella Aa", "Capella Ab", "Capella H", "Capella L"];
  const castorBodies = [
    "Castor Aa",
    "Castor Ab",
    "Castor Ba",
    "Castor Bb",
    "YY Gem A (Ca)",
    "YY Gem B (Cb)",
  ];

  const sagittariusBodies = ["Sagittarius A*", "S2", "S0-102", "S38", "S62"];
  const kepler22Bodies = ["Kepler-22", "Kepler-22b"];
  const vegaBodies = ["Vega"];

  const handleFocusClick = (e, name) => {
    e.stopPropagation();
    onPlanetButtonClick?.(name);
  };

  const renderBodyButton = (name) => (
    <button
      key={name}
      className={`px-2 py-1.5 rounded text-base border transition-all
        ${
          focusedPlanet === name
            ? "bg-white text-black border-white"
            : "bg-black/40 border-white/30 text-gray-300"
        }`}
      onClick={(e) => handleFocusClick(e, name)}
      disabled={isWarping || isBackAnimating}
    >
      {name}
    </button>
  );

  const renderSmallButton = (name) => (
    <button
      key={name}
      className={`w-full px-2 py-1 rounded text-[0.85rem] border transition-all
        ${
          focusedPlanet === name
            ? "bg-white text-black border-white"
            : "bg-black/40 border-white/30 text-gray-300"
        }`}
      onClick={(e) => handleFocusClick(e, name)}
      disabled={isWarping || isBackAnimating}
    >
      {name}
    </button>
  );

  const inInterstellar =
    !inGalaxy &&
    !inSolarSystem &&
    !inSiriusSystem &&
    !inAlphaSystem &&
    !inBetelgeuseSystem &&
    !inNaosSystem &&
    !inAntaresSystem &&
    !inCapellaSystem &&
    !inCastorSystem &&
    !inSagittariusSystem &&
    !inKepler22System &&
    !inVegaSystem;

  return (
    <div className="absolute top-4 left-4 z-30 pointer-events-none">
      <div className="flex gap-3 items-start">
        <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-xl p-3 shadow-xl pointer-events-auto w-[260px] sm:w-[304px] text-[1rem]">
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
                      : inBetelgeuseSystem
                        ? "Betelgeuse System"
                        : inNaosSystem
                          ? "Naos System"
                          : inAntaresSystem
                            ? "Antares System"
                            : inCapellaSystem
                              ? "Capella System"
                              : inCastorSystem
                                ? "Castor System"
                                : inSagittariusSystem
                                  ? "Sagittarius A* (Galactic Center)"
                                  : inKepler22System
                                    ? "Kepler-22 System"
                                    : inVegaSystem
                                      ? "Vega System"
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

            {(inSolarSystem ||
              inSiriusSystem ||
              inAlphaSystem ||
              inBetelgeuseSystem ||
              inNaosSystem ||
              inAntaresSystem ||
              inCapellaSystem ||
              inCastorSystem ||
              inSagittariusSystem ||
              inKepler22System ||
              inVegaSystem) &&
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
                        {focusedPlanet === "ISS" &&
                          "Low Earth Orbit (LEO) ~400 km altitude (orbits Earth ~90 minutes)"}

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
                        {focusedPlanet === "Ceres" &&
                          "≈2.77 AU from the Sun (dwarf planet in the asteroid belt)"}

                        {focusedPlanet === "Voyager 1" &&
                          "Interplanetary / Interstellar probe (launched 1977) – far beyond outer planets"}

                        {focusedPlanet === "Asteroid Belt" &&
                          "Region of rocky bodies between Mars and Jupiter (~2–3.5 AU from the Sun)"}
                        {focusedPlanet === "Kuiper Belt" &&
                          "Icy debris region beyond Neptune (~30–50 AU from the Sun)"}

                        {focusedPlanet === "New Horizons" &&
                          "Interplanetary probe (launched 2006) – Pluto flyby, Kuiper Belt exploration"}

                        {focusedPlanet === "Hubble" &&
                          "Low Earth Orbit space telescope (~540 km altitude) – Earth orbit observatory"}
                      </>
                    )}

                    {inSagittariusSystem && (
                      <>
                        {focusedPlanet === "Sagittarius A*" &&
                          "Supermassive black hole at the Milky Way’s center (~26,000 light-years from Earth)."}

                        {focusedPlanet === "S2" &&
                          "S-star orbiting Sagittarius A* (one of the best-known close-orbit stars)."}
                        {focusedPlanet === "S0-102" &&
                          "Very fast-orbit S-star around Sagittarius A* (short-period orbiter)."}
                        {focusedPlanet === "S38" &&
                          "S-star orbiting Sagittarius A* (inner cluster member)."}
                        {focusedPlanet === "S62" &&
                          "S-star orbiting Sagittarius A* (inner cluster member)."}
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
                    {/* Betelgeuse System */}
                    {inBetelgeuseSystem && (
                      <>
                        {focusedPlanet === "Betelgeuse" &&
                          "Red supergiant star in Orion (distance ~500–700 light-years, approximate)"}
                      </>
                    )}
                    {/* Naos System */}
                    {inNaosSystem && (
                      <>
                        {focusedPlanet === "Naos" &&
                          "Blue supergiant in Puppis (distance ~1,000+ light-years, approximate)"}
                      </>
                    )}

                    {/* Antares System */}
                    {inAntaresSystem && (
                      <>
                        {focusedPlanet === "Antares A" && (
                          <>
                            <div className="font-medium text-gray-200">
                              Alpha Scorpii A (Antares A)
                            </div>
                            <div className="mt-0.5">
                              ~550 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Red supergiant primary — much brighter than B.
                            </div>
                          </>
                        )}

                        {focusedPlanet === "Antares B" && (
                          <>
                            <div className="font-medium text-gray-200">
                              Alpha Scorpii B (Antares B)
                            </div>
                            <div className="mt-0.5">
                              ~550 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Blue-white companion — wide binary companion.
                            </div>
                          </>
                        )}
                      </>
                    )}
                    {/* Kepler22System System */}
                    {inKepler22System && (
                      <>
                        {focusedPlanet === "Kepler-22" &&
                          "Kepler-22 host star (~600 ly, approx.)"}
                        {focusedPlanet === "Kepler-22b" &&
                          "Exoplanet around Kepler-22 (~600 ly, approx.)"}
                      </>
                    )}

                    {/* Capella System */}
                    {inCapellaSystem && (
                      <>
                        {focusedPlanet === "Capella Aa" && (
                          <>
                            <div className="font-medium text-gray-200">
                              Capella Aa
                            </div>
                            <div className="mt-0.5">
                              ~43 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Bright orange/yellow giant component of the close
                              binary.
                            </div>
                          </>
                        )}

                        {focusedPlanet === "Capella Ab" && (
                          <>
                            <div className="font-medium text-gray-200">
                              Capella Ab
                            </div>
                            <div className="mt-0.5">
                              ~43 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Companion giant — the second bright component of
                              the close pair.
                            </div>
                          </>
                        )}

                        {focusedPlanet === "Capella H" && (
                          <>
                            <div className="font-medium text-gray-200">
                              Capella H
                            </div>
                            <div className="mt-0.5">
                              ~43 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Dim red dwarf component — far wider companion
                              system.
                            </div>
                          </>
                        )}

                        {focusedPlanet === "Capella L" && (
                          <>
                            <div className="font-medium text-gray-200">
                              Capella L
                            </div>
                            <div className="mt-0.5">
                              ~43 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Dim red dwarf companion — paired with H as a wide
                              companion.
                            </div>
                          </>
                        )}
                      </>
                    )}
                    {inCastorSystem && (
                      <>
                        {focusedPlanet === "Castor Aa" && (
                          <>
                            <div className="font-medium text-gray-200">
                              Castor Aa
                            </div>
                            <div className="mt-0.5">
                              ~51.6 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Bright component of the Aa–Ab close binary (Castor
                              A).
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Castor A and Castor B form a wider pair on a much
                              larger orbit.
                            </div>
                          </>
                        )}

                        {focusedPlanet === "Castor Ab" && (
                          <>
                            <div className="font-medium text-gray-200">
                              Castor Ab
                            </div>
                            <div className="mt-0.5">
                              ~51.6 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Companion in the Aa–Ab close binary (Castor A).
                            </div>
                          </>
                        )}

                        {focusedPlanet === "Castor Ba" && (
                          <>
                            <div className="font-medium text-gray-200">
                              Castor Ba
                            </div>
                            <div className="mt-0.5">
                              ~51.6 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Bright component of the Ba–Bb close binary (Castor
                              B).
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Castor B is the wide companion of Castor A in the
                              AB system.
                            </div>
                          </>
                        )}

                        {focusedPlanet === "Castor Bb" && (
                          <>
                            <div className="font-medium text-gray-200">
                              Castor Bb
                            </div>
                            <div className="mt-0.5">
                              ~51.6 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Companion in the Ba–Bb close binary (Castor B).
                            </div>
                          </>
                        )}

                        {focusedPlanet === "YY Gem A (Ca)" && (
                          <>
                            <div className="font-medium text-gray-200">
                              YY Gem A (Ca)
                            </div>
                            <div className="mt-0.5">
                              ~51.6 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Red dwarf in the YY Gem close binary (Castor C).
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              A separate close pair system, widely separated
                              from the AB pair.
                            </div>
                          </>
                        )}

                        {focusedPlanet === "YY Gem B (Cb)" && (
                          <>
                            <div className="font-medium text-gray-200">
                              YY Gem B (Cb)
                            </div>
                            <div className="mt-0.5">
                              ~51.6 light-years from Earth (approx.)
                            </div>
                            <div className="text-gray-400 text-[0.92rem] mt-1">
                              Second red dwarf in the YY Gem close binary
                              (Castor C).
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* Vega System */}
                    {inVegaSystem && (
                      <>
                        {focusedPlanet === "Vega" &&
                          "Bright blue-white star ~25 light-years from Earth (approx.)"}
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
            {inBetelgeuseSystem && !focusedPlanet && (
              <>
                <div className="font-medium text-lg">Overview</div>
                <div className="mt-0.5">
                  You are inside the Betelgeuse system (single star scene).
                </div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Click the star or use the button below to focus.
                </div>
              </>
            )}

            {inNaosSystem && !focusedPlanet && (
              <>
                <div className="font-medium text-lg">Overview</div>
                <div className="mt-0.5">
                  You are inside the Naos system (single star scene).
                </div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Click the star or use the button below to focus.
                </div>
              </>
            )}

            {inAntaresSystem && !focusedPlanet && (
              <>
                <div className="font-medium text-lg">Overview</div>
                <div className="mt-0.5">
                  You are inside the Antares binary star system.
                </div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Focus on Antares A (red supergiant) or Antares B (blue-white
                  companion).
                </div>
              </>
            )}

            {inCapellaSystem && !focusedPlanet && (
              <>
                <div className="font-medium text-lg">Overview</div>
                <div className="mt-0.5">
                  You are inside the Capella multi-star system.
                </div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Focus on Capella Aa, Ab, H, or L using the buttons below or by
                  clicking the stars.
                </div>
              </>
            )}

            {inCastorSystem && !focusedPlanet && (
              <>
                <div className="font-medium text-lg">Overview</div>
                <div className="mt-0.5">
                  You are inside the Castor sextuple star system.
                </div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Castor A (Aa–Ab) and Castor B (Ba–Bb) form a wide pair. YY Gem
                  (Ca–Cb) is a distant third binary.
                </div>
              </>
            )}

            {inSagittariusSystem && !focusedPlanet && (
              <>
                <div className="font-medium text-lg">Overview</div>
                <div className="mt-0.5">
                  You are near Sagittarius A* (Galactic Center).
                </div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Focus on Sagittarius A* for a close-up core view, or select
                  S-stars to see orbiting targets.
                </div>
              </>
            )}

            {inKepler22System && !focusedPlanet && (
              <>
                <div className="font-medium text-lg">Overview</div>
                <div className="mt-0.5">
                  You are inside the Kepler-22 system.
                </div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Focus the host star or Kepler-22b using the buttons below.
                </div>
              </>
            )}

            {inVegaSystem && !focusedPlanet && (
              <>
                <div className="font-medium text-lg">Overview</div>
                <div className="mt-0.5">
                  You are inside the Vega system (single star scene).
                </div>
                <div className="text-gray-400 text-[0.9rem] mt-1">
                  Click Vega or use the button below to focus.
                </div>
              </>
            )}

            {inInterstellar && (
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

          <div className="space-y-2 space-scroll max-h-[58vh] overflow-y-auto pr-2">
            {inGalaxy && (
              <>
                <div className="text-gray-400 text-[0.9rem] mb-1">
                  Select destination:
                </div>

                <div className="grid grid-cols-2 gap-2">
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

                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
                          ${
                            focus === "sagittarius"
                              ? "bg-purple-500/30 border-purple-400 text-white"
                              : "bg-black/40 border-white/20 text-gray-300"
                          }`}
                    onClick={onSetFocusSagittarius}
                    disabled={isWarping}
                  >
                    Sagittarius A*
                  </button>

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

                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
                          ${
                            focus === "kepler22"
                              ? "bg-emerald-500/30 border-emerald-400 text-white"
                              : "bg-black/40 border-white/20 text-gray-300"
                          }`}
                    onClick={onSetFocusKepler22}
                    disabled={isWarping}
                  >
                    Kepler-22
                  </button>

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

                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
                          ${
                            focus === "vega"
                              ? "bg-indigo-500/30 border-indigo-400 text-white"
                              : "bg-black/40 border-white/20 text-gray-300"
                          }`}
                    onClick={onSetFocusVega}
                    disabled={isWarping}
                  >
                    Vega
                  </button>

                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
                      ${
                        focus === "betelgeuse"
                          ? "bg-rose-500/30 border-rose-400 text-white"
                          : "bg-black/40 border-white/20 text-gray-300"
                      }`}
                    onClick={onSetFocusBetelgeuse}
                    disabled={isWarping}
                  >
                    Betelgeuse
                  </button>

                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
                                ${
                                  focus === "naos"
                                    ? "bg-cyan-500/30 border-cyan-400 text-white"
                                    : "bg-black/40 border-white/20 text-gray-300"
                                }`}
                    onClick={onSetFocusNaos}
                    disabled={isWarping}
                  >
                    Naos
                  </button>

                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
                            ${
                              focus === "antares"
                                ? "bg-red-500/30 border-red-400 text-white"
                                : "bg-black/40 border-white/20 text-gray-300"
                            }`}
                    onClick={onSetFocusAntares}
                    disabled={isWarping}
                  >
                    Antares
                  </button>

                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
                      ${
                        focus === "capella"
                          ? "bg-amber-500/30 border-amber-400 text-white"
                          : "bg-black/40 border-white/20 text-gray-300"
                      }`}
                    onClick={onSetFocusCapella}
                    disabled={isWarping}
                  >
                    Capella
                  </button>
                  <button
                    className={`w-full px-3 py-1.5 rounded text-base border transition-all
                      ${
                        focus === "castor"
                          ? "bg-blue-500/30 border-blue-400 text-white"
                          : "bg-black/40 border-white/20 text-gray-300"
                      }`}
                    onClick={onSetFocusCastor}
                    disabled={isWarping}
                  >
                    Castor
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
                      <div className="grid grid-cols-3 gap-1.5">
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

                    {/* probes / spacecraft (planet'e bağlı değil) */}
                    {freeSpaceSolarProbes.length > 0 && (
                      <div className="mb-2">
                        <div className="text-gray-400 text-[0.8rem] uppercase tracking-wide mb-1 whitespace-normal break-words leading-tight">
                          Probes & spacecraft
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          {freeSpaceSolarProbes.map(renderBodyButton)}
                        </div>
                      </div>
                    )}

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

                {inBetelgeuseSystem && (
                  <>
                    <div className="text-gray-400 text-[0.9rem] mb-1">
                      Select star:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      {["Betelgeuse"].map(renderBodyButton)}
                      <div
                        className="opacity-0 pointer-events-none"
                        aria-hidden="true"
                      >
                        placeholder
                      </div>
                    </div>

                    <button
                      className="w-full px-3 py-1.5 rounded text-base border border-gray-500/50 bg-black/60 text-gray-300 mt-1"
                      onClick={onResetBetelgeuseView}
                      disabled={isWarping || isBackAnimating}
                    >
                      Reset View
                    </button>
                  </>
                )}

                {inNaosSystem && (
                  <>
                    <div className="text-gray-400 text-[0.9rem] mb-1">
                      Select star:
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      {["Naos"].map(renderBodyButton)}
                      <div
                        className="opacity-0 pointer-events-none"
                        aria-hidden="true"
                      >
                        placeholder
                      </div>
                    </div>

                    <button
                      className="w-full px-3 py-1.5 rounded text-base border border-gray-500/50 bg-black/60 text-gray-300 mt-1"
                      onClick={onResetNaosView}
                      disabled={isWarping || isBackAnimating}
                    >
                      Reset View
                    </button>
                  </>
                )}

                {inAntaresSystem && (
                  <>
                    <div className="text-gray-400 text-[0.9rem] mb-1">
                      Select star:
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      {antaresBodies.map(renderBodyButton)}
                    </div>

                    <button
                      className="w-full px-3 py-1.5 rounded text-base border border-gray-500/50 bg-black/60 text-gray-300 mt-1"
                      onClick={onResetAntaresView}
                      disabled={isWarping || isBackAnimating}
                    >
                      Reset View
                    </button>
                  </>
                )}

                {inCapellaSystem && (
                  <>
                    <div className="text-gray-400 text-[0.9rem] mb-1">
                      Select star:
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      {capellaBodies.map(renderBodyButton)}
                    </div>

                    <button
                      className="w-full px-3 py-1.5 rounded text-base border border-gray-500/50 bg-black/60 text-gray-300 mt-1"
                      onClick={onResetCapellaView}
                      disabled={isWarping || isBackAnimating}
                    >
                      Reset View
                    </button>
                  </>
                )}

                {inCastorSystem && (
                  <>
                    <div className="text-gray-400 text-[0.9rem] mb-1">
                      Select star:
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      {castorBodies.map(renderBodyButton)}
                    </div>

                    <button
                      className="w-full px-3 py-1.5 rounded text-base border border-gray-500/50 bg-black/60 text-gray-300 mt-1"
                      onClick={onResetCastorView}
                      disabled={isWarping || isBackAnimating}
                    >
                      Reset View
                    </button>
                  </>
                )}

                {inSagittariusSystem && (
                  <>
                    <div className="text-gray-400 text-[0.9rem] mb-1">
                      Select target:
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      {sagittariusBodies.map(renderBodyButton)}
                      <div
                        className="opacity-0 pointer-events-none"
                        aria-hidden="true"
                      >
                        placeholder
                      </div>
                    </div>

                    <button
                      className="w-full px-3 py-1.5 rounded text-base border border-gray-500/50 bg-black/60 text-gray-300 mt-1"
                      onClick={onResetSagittariusView}
                      disabled={isWarping || isBackAnimating}
                    >
                      Reset View
                    </button>
                  </>
                )}

                {inKepler22System && (
                  <>
                    <div className="text-gray-400 text-[0.9rem] mb-1">
                      Select target:
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      {kepler22Bodies.map(renderBodyButton)}
                    </div>

                    <button
                      className="w-full px-3 py-1.5 rounded text-base border border-gray-500/50 bg-black/60 text-gray-300 mt-1"
                      onClick={onResetKepler22View}
                      disabled={isWarping || isBackAnimating}
                    >
                      Reset View
                    </button>
                  </>
                )}

                {inVegaSystem && (
                  <>
                    <div className="text-gray-400 text-[0.9rem] mb-1">
                      Select star:
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      {vegaBodies.map(renderBodyButton)}
                      <div
                        className="opacity-0 pointer-events-none"
                        aria-hidden="true"
                      >
                        placeholder
                      </div>
                    </div>

                    <button
                      className="w-full px-3 py-1.5 rounded text-base border border-gray-500/50 bg-black/60 text-gray-300 mt-1"
                      onClick={onResetVegaView}
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
                <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-xl p-2.5 shadow-xl min-w-[140px] max-w-[190px]">
                  <div className="text-gray-300 text-sm font-medium mb-2">
                    Around{" "}
                    <span className="text-gray-100 font-semibold">Earth</span>
                  </div>
                  {/* Moon */}
                  <div className="mb-2">
                    <div className="text-gray-400 text-[0.72rem] uppercase tracking-wide mb-1">
                      Moon
                    </div>
                    <div className="flex flex-col gap-1">
                      {renderSmallButton("Moon")}
                    </div>
                  </div>

                  {/* Orbiters */}
                  {(freeSpaceSolarOrbiters.Earth ?? []).length > 0 && (
                    <div>
                      <div className="text-gray-400 text-[0.72rem] uppercase tracking-wide mb-1">
                        Orbiters
                      </div>
                      <div className="flex flex-col gap-1">
                        {(freeSpaceSolarOrbiters.Earth ?? []).map(
                          renderSmallButton,
                        )}
                      </div>
                    </div>
                  )}
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
                    {["Phobos", "Deimos"].map(renderSmallButton)}
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
                    ].map(renderSmallButton)}
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
                    ].map(renderSmallButton)}
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
                      renderSmallButton,
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
                    {["Proteus", "Triton"].map(renderSmallButton)}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
