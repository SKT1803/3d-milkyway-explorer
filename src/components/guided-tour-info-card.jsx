import "../styles/guided-tour-info-card.css";

// Original cinematic illustrations; no external image URLs or downloads.
// These images are artistic visualizations, not observational astrophotography.
const TOUR_INFO = {
  galaxy: {
    title: "Milky Way Galaxy",
    description:
      "Our home galaxy contains billions of stars arranged in a luminous spiral. Our journey begins here.",
    image: "/tour-art/milky-way.webp",
  },
  approach: {
    title: "Approaching the Solar System",
    description:
      "We are crossing the Milky Way toward our own star and the planets that orbit it.",
    image: "/tour-art/solar-system.webp",
  },
  transit: {
    title: "Entering the Solar System",
    description:
      "The view shifts from the galactic scale to the neighborhood of our Sun.",
    image: "/tour-art/solar-system.webp",
  },
  solar: {
    title: "Solar System",
    description:
      "Beyond the Sun, eight planets orbit our star. We will visit all of them, along with Earth's Moon.",
    image: "/tour-art/solar-system.webp",
  },
  sun: {
    title: "The Sun",
    description:
      "Our star supplies the energy that powers life on Earth and shapes the Solar System.",
    image: "/tour-art/sun.webp",
  },
  mercury: {
    title: "Mercury",
    description:
      "The smallest planet orbits closest to the Sun. Its ancient surface is heavily cratered.",
    image: "/tour-art/mercury.webp",
  },
  venus: {
    title: "Venus",
    description:
      "Venus is wrapped in dense clouds and has the hottest planetary surface in our Solar System.",
    image: "/tour-art/venus.webp",
  },
  earth: {
    title: "Earth",
    description:
      "Our ocean-covered planet has a protective atmosphere and is the only known home for life.",
    image: "/tour-art/earth.webp",
  },
  moon: {
    title: "The Moon",
    description:
      "Earth's natural satellite has a cratered surface shaped by billions of years of impacts.",
    image: "/tour-art/moon.webp",
  },
  mars: {
    title: "Mars",
    description:
      "Known as the Red Planet, Mars has enormous volcanoes, canyons and polar ice caps.",
    image: "/tour-art/mars.webp",
  },
  jupiter: {
    title: "Jupiter",
    description:
      "Jupiter is the Solar System’s largest planet, with vast cloud bands and long-lived storms.",
    image: "/tour-art/jupiter.webp",
  },
  saturn: {
    title: "Saturn",
    description:
      "Saturn is known for its spectacular rings, composed largely of countless icy particles.",
    image: "/tour-art/saturn.webp",
  },
  uranus: {
    title: "Uranus",
    description:
      "An ice giant with a pale cyan atmosphere, Uranus rotates dramatically on its side.",
    image: "/tour-art/uranus.webp",
  },
  neptune: {
    title: "Neptune",
    description:
      "Far from the Sun, this deep-blue ice giant is swept by powerful winds and storms.",
    image: "/tour-art/neptune.webp",
  },
  toSirius: {
    title: "Traveling to Sirius",
    description:
      "Next, we visit the brightest star in Earth’s night sky and its compact stellar companion.",
    image: "/tour-art/sirius.webp",
  },
  siriusOverview: {
    title: "Sirius System",
    description:
      "Sirius is a binary star system featuring a brilliant main-sequence star and a white dwarf.",
    image: "/tour-art/sirius.webp",
  },
  siriusA: {
    title: "Sirius A",
    description:
      "Sirius A is a luminous, hot star approximately 8.6 light-years from Earth.",
    image: "/tour-art/sirius.webp",
  },
  siriusB: {
    title: "Sirius B",
    description:
      "Sirius B is a dense white dwarf: the compact remnant of a once much larger star.",
    image: "/tour-art/sirius.webp",
  },
  toAlpha: {
    title: "Traveling to Alpha Centauri",
    description:
      "Our next stop is the nearby triple-star system that includes Proxima Centauri.",
    image: "/tour-art/alpha-centauri.webp",
  },
  alphaOverview: {
    title: "Alpha Centauri",
    description:
      "This stellar neighborhood contains Alpha Centauri A, Alpha Centauri B and Proxima Centauri.",
    image: "/tour-art/alpha-centauri.webp",
  },
  alphaA: {
    title: "Rigil Kentaurus",
    description:
      "Alpha Centauri A is a Sun-like star, part of one of the closest stellar systems to Earth.",
    image: "/tour-art/alpha-centauri.webp",
  },
  alphaB: {
    title: "Toliman",
    description:
      "Alpha Centauri B is a companion star orbiting with Alpha Centauri A.",
    image: "/tour-art/alpha-centauri.webp",
  },
  alphaProxima: {
    title: "Proxima Centauri",
    description:
      "Proxima Centauri is a red dwarf and the closest known star to the Sun.",
    image: "/tour-art/alpha-centauri.webp",
  },
  toKepler: {
    title: "Traveling to Kepler-22",
    description:
      "We move to an exoplanetary system hundreds of light-years away.",
    image: "/tour-art/kepler-22.webp",
  },
  keplerOverview: {
    title: "Kepler-22 System",
    description:
      "The Kepler-22 star hosts Kepler-22b, a planet discovered through the transit method.",
    image: "/tour-art/kepler-22.webp",
  },
  keplerStar: {
    title: "Kepler-22",
    description:
      "Kepler-22 is a Sun-like star with a confirmed orbiting exoplanet.",
    image: "/tour-art/kepler-22.webp",
  },
  keplerPlanet: {
    title: "Kepler-22b",
    description:
      "Kepler-22b is a confirmed exoplanet; its actual appearance and surface conditions remain unknown.",
    image: "/tour-art/kepler-22.webp",
  },
  toVega: {
    title: "Traveling to Vega",
    description:
      "Across the Milky Way, we approach Vega, a brilliant blue-white star in the constellation Lyra.",
    image: "/tour-art/vega.webp",
  },
  vega: {
    title: "Vega",
    description:
      "Vega is a bright, nearby A-type star whose intense blue-white glow makes it stand out in our night sky.",
    image: "/tour-art/vega.webp",
  },
  toBetelgeuse: {
    title: "Traveling to Betelgeuse",
    description:
      "We cross the galaxy toward Orion’s vast red supergiant, one of the most recognizable giant stars.",
    image: "/tour-art/betelgeuse.webp",
  },
  betelgeuse: {
    title: "Betelgeuse",
    description:
      "A red supergiant in Orion, Betelgeuse has a huge, variable atmosphere and will eventually end its life as a supernova.",
    image: "/tour-art/betelgeuse.webp",
  },
  toNaos: {
    title: "Traveling to Naos",
    description:
      "Our next destination is Naos, a powerful blue O-type star in the constellation Puppis.",
    image: "/tour-art/naos.webp",
  },
  naos: {
    title: "Naos",
    description:
      "Naos, also known as Zeta Puppis, is a very hot, massive blue star with an exceptionally strong stellar wind.",
    image: "/tour-art/naos.webp",
  },
  toAntares: {
    title: "Traveling to Antares",
    description:
      "We approach Antares and its smaller blue-white companion in the constellation Scorpius.",
    image: "/tour-art/antares.webp",
  },
  antaresA: {
    title: "Antares A",
    description:
      "Antares A is an enormous, cool red supergiant, shining next to its much hotter companion.",
    image: "/tour-art/antares.webp",
  },
  antaresB: {
    title: "Antares B",
    description:
      "Antares B is a hot blue-white companion to the much larger red supergiant Antares A.",
    image: "/tour-art/antares.webp",
  },
  toCapella: {
    title: "Traveling to Capella",
    description:
      "Capella is a stellar system with two prominent yellow giant stars and a more distant pair of faint red dwarfs.",
    image: "/tour-art/capella.webp",
  },
  capellaAa: {
    title: "Capella Aa",
    description:
      "One of Capella’s bright yellow giants, paired closely with Capella Ab.",
    image: "/tour-art/capella.webp",
  },
  capellaAb: {
    title: "Capella Ab",
    description: "The companion yellow giant in Capella’s bright inner binary.",
    image: "/tour-art/capella.webp",
  },
  capellaH: {
    title: "Capella H",
    description:
      "A faint red dwarf associated with Capella, orbiting as part of a distant pair.",
    image: "/tour-art/capella.webp",
  },
  capellaL: {
    title: "Capella L",
    description:
      "The red-dwarf companion of Capella H in the system’s distant faint pair.",
    image: "/tour-art/capella.webp",
  },
  toCastor: {
    title: "Traveling to Castor",
    description:
      "We head toward Castor, a remarkable multiple-star system in Gemini.",
    image: "/tour-art/castor.webp",
  },
  castorAa: {
    title: "Castor Aa",
    description: "A bright stellar component of the Castor A pair.",
    image: "/tour-art/castor.webp",
  },
  castorAb: {
    title: "Castor Ab",
    description: "The companion star orbiting with Castor Aa.",
    image: "/tour-art/castor.webp",
  },
  castorBa: {
    title: "Castor Ba",
    description: "A stellar component of the Castor B binary.",
    image: "/tour-art/castor.webp",
  },
  castorBb: {
    title: "Castor Bb",
    description: "The companion in Castor’s second close stellar pair.",
    image: "/tour-art/castor.webp",
  },
  castorCa: {
    title: "YY Gem A (Castor Ca)",
    description:
      "A red dwarf in the eclipsing YY Gem binary, part of the Castor system.",
    image: "/tour-art/castor.webp",
  },
  castorCb: {
    title: "YY Gem B (Castor Cb)",
    description:
      "The second red dwarf in YY Gem, orbiting close to its partner.",
    image: "/tour-art/castor.webp",
  },
  toSagittarius: {
    title: "Traveling to the Galactic Center",
    description:
      "For our final destination, we journey toward the Milky Way’s central black hole.",
    image: "/tour-art/sagittarius-a.webp",
  },
  sagittariusOverview: {
    title: "Galactic Center",
    description:
      "The central region of the Milky Way hosts Sagittarius A*, a supermassive black hole.",
    image: "/tour-art/sagittarius-a.webp",
  },
  sagittariusCore: {
    title: "Sagittarius A*",
    description:
      "This supermassive black hole contains millions of times the Sun’s mass. The glowing disk shown here is an artistic interpretation.",
    image: "/tour-art/sagittarius-a.webp",
  },
  complete: {
    title: "Journey Complete",
    description:
      "From our galaxy and its planets to distant stars and the galactic center, our guided tour is complete.",
    image: "/tour-art/milky-way.webp",
  },
};

export function GuidedTourInfoCard({ phase }) {
  const info = TOUR_INFO[phase] ?? TOUR_INFO.galaxy;
  return (
    <aside className="guided-tour-card" aria-label="Guided tour information">
      <div key={phase} className="guided-tour-card-inner">
        <div className="guided-tour-card-image-frame">
          <img
            className="guided-tour-card-image"
            src={info.image}
            alt={info.title}
            draggable="false"
            loading="eager"
          />
          <span className="guided-tour-card-eyebrow">GUIDED SPACE TOUR</span>
        </div>
        <div className="guided-tour-card-copy" aria-live="polite">
          <h2 className="guided-tour-card-title">{info.title}</h2>
          <p className="guided-tour-card-description">{info.description}</p>
        </div>
      </div>
    </aside>
  );
}
