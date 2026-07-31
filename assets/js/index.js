// Navigations
const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const selectedId = link.getAttribute("data-section");
    sections.forEach((section) => {
      section.classList.add("hidden");
    })
    const selectedSection = document.querySelector(`section[data-section="${selectedId}"]`);
    selectedSection?.classList.remove("hidden");

    // Active Link 
    navLinks.forEach((navLink) => {
      navLink.classList.remove("bg-blue-500/10", "text-blue-400");
      navLink.classList.add("text-slate-300");
    })
    link.classList.add("bg-blue-500/10", "text-blue-400");
    link.classList.remove("text-slate-300");
  })
})

// 1: Today In Space
const searchValue = document.getElementById("apod-date-input");
const searchDate = new Date().toISOString().split("T")[0];
searchValue.value = searchDate;

async function getAPODtoday(searchdate) {
  // Loading
  document.getElementById("apod-loading").classList.remove("hidden");
  document.getElementById("apod-image").classList.add("hidden");
  document.getElementById("apod-explanation").innerHTML = "Loading description...";
  document.getElementById("apod-date").innerHTML = "Astronomy Picture of the Day - Loading...";
  document.getElementById("apod-date-detail").innerHTML = "Loading...";
  document.querySelector(".date-input-wrapper span").innerHTML = "";
  document.getElementById("apod-title").innerHTML = "";
  document.getElementById("apod-date-info").innerHTML = "Loading...";
  document.getElementById("apod-media-type").innerHTML = "";

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=rR6WfkEKBR8cNJXBOfKENISGjNkJNuzaL7wB0KMS&date=${searchdate}`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.msg);
    }

    const date = new Date(searchdate).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // Set dynamic data
    document.getElementById("apod-image").src = result.hdurl || result.url;
    document.getElementById("apod-explanation").innerHTML = result.explanation;
    document.getElementById("apod-date").innerHTML = `Astronomy Picture of the Day - ${date}`;
    document.getElementById("apod-date-detail").innerHTML = date;
    document.querySelector(".date-input-wrapper span").innerHTML = date;
    document.getElementById("apod-title").innerHTML = result.title;
    document.getElementById("apod-date-info").innerHTML = date;
    document.getElementById("apod-media-type").innerHTML = result.media_type;

  } catch (error) {
    console.error(error);
  } finally {
    document.getElementById("apod-loading").classList.add("hidden");
    document.getElementById("apod-image").classList.remove("hidden");
  }
}
getAPODtoday(searchDate);

// Serach Button 
document.getElementById("load-date-btn").addEventListener("click", (e) => {
  getAPODtoday(searchValue.value);
})

// Today Button 
document.getElementById("today-apod-btn").addEventListener("click", (e) => {
  getAPODtoday(searchDate);
})

// 2: Lunches 
async function getLaunches() {
  const launchesGrid = document.getElementById("launches-grid");
  const featuredLaunch = document.getElementById("featured-launch");
  try {
    const response = await fetch(
      "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10"
    );

    const data = await response.json();
    const launchDate = new Date(data.results[0].net);

    const date = launchDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const dayDate = launchDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const time = launchDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

    const now = new Date();

    const days = Math.max(
      0,
      Math.ceil((launchDate - now) / (1000 * 60 * 60 * 24))
    );
    featuredLaunch.innerHTML = `<div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                      >
                        ${data.results[0].status.abbrev}
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                      ${data.results[0].name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${data.results[0].launch_service_provider.name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${data.results[0].rocket.configuration.name}</span>
                      </div>
                    </div>
                    <div
                      class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6"
                    >
                      <i class="fas fa-clock text-2xl text-blue-400"></i>
                      <div>
                        <p class="text-2xl font-bold text-blue-400">${days}</p>
                        <p class="text-xs text-slate-400">Days Until Launch</p>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">${dayDate}, ${date}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">${time} UTC</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${data.results[0].pad.location.name}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${data.results[0].pad.country.name}</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                      ${data.results[0].mission.description}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                  >
                    <!-- Placeholder image/icon since we can't load external images reliably without correct URLs -->
                    <div
                      class="flex items-center justify-center h-full min-h-[400px] bg-slate-800"
                    >
                      <img
    src="${data.results[0].image?.image_url || "./assets/images/launch-placeholder.png"}"
    class="w-full h-full object-cover"
    alt="${data.results[0].name}"
/>
                    </div>
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                    ></div>
                  </div>
                </div>
              </div>
            </div>`;
    launchesGrid.innerHTML = "";

    data.results.slice(1).forEach((launch) => {

      const launchDate = new Date(launch.net);

      const date = launchDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const time = launchDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      });

      launchesGrid.innerHTML += `
    <div
        class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
    >
        <div
            class="relative h-48 bg-slate-900/50 flex items-center justify-center"
        >
<img
    src="${launch.image?.image_url || "./assets/images/launch-placeholder.png"}"
    onerror="this.onerror=null;this.src="./assets/images/launch-placeholder.png";"
    class="w-full h-full object-cover"
    alt="${launch.name}"
>
}

            <div class="absolute top-3 right-3">
                <span class="px-3 py-1 bg-green-500/90 text-white rounded-full text-xs font-semibold">
                    ${launch.status.abbrev}
                </span>
            </div>
        </div>

        <div class="p-5">

            <div class="mb-3">
                <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    ${launch.name}
                </h4>

                <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${launch.launch_service_provider?.name || "Unknown"}
                </p>
            </div>

            <div class="space-y-2 mb-4">

                <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${date}</span>
                </div>

                <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${time} UTC</span>
                </div>

                <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">
                        ${launch.rocket?.configuration?.name || "Unknown"}
                    </span>
                </div>

                <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">
                        ${launch.pad?.location?.name || "Unknown"}
                    </span>
                </div>

            </div>

            <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
                <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
                    Details
                </button>

                <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <i class="far fa-heart"></i>
                </button>
            </div>

        </div>
    </div>
    `;
    });

  } catch (error) {
    console.error(error);
  }
}
getLaunches();

// 3: Planets

document.addEventListener("DOMContentLoaded", () => {
  const planetCards = document.querySelectorAll(".planet-card");
  const planetName = document.getElementById("planet-detail-name");
  const planetImage = document.getElementById("planet-detail-image");
  const planetDescription = document.getElementById("planet-detail-description");
  const planetDistance = document.getElementById("planet-distance");
  const planetRadius = document.getElementById("planet-radius");
  const planetMass = document.getElementById("planet-mass");
  const planetDensity = document.getElementById("planet-density");
  const planetOrbital = document.getElementById("planet-orbital-period");
  const planetRotation = document.getElementById("planet-rotation");
  const planetMoons = document.getElementById("planet-moons");
  const planetGravity = document.getElementById("planet-gravity");
  const discoverer = document.getElementById("planet-discoverer");
  const discoveryDate = document.getElementById("planet-discovery-date");
  const bodyType = document.getElementById("planet-body-type");
  const volume = document.getElementById("planet-volume");
  const perihelion = document.getElementById("planet-perihelion");
  const aphelion = document.getElementById("planet-aphelion");
  const eccentricity = document.getElementById("planet-eccentricity");
  const inclination = document.getElementById("planet-inclination");
  const axialTilt = document.getElementById("planet-axial-tilt");
  const temperature = document.getElementById("planet-temp");
  const escapeVelocity = document.getElementById("planet-escape");
  const factsContainer = document.getElementById("planet-facts");
const comparisonTableBody = document.getElementById("planet-comparison-tbody");

  function loadPlanet(id) {
let planet = null;
    for (let i = 0; i < planets.length; i++) {

      let currentId = planets[i].id;

      if (currentId === "mercure") currentId = "mercury";
      if (currentId === "terre") currentId = "earth";
      if (currentId === "saturne") currentId = "saturn";

      if (currentId === id) {
        planet = planets[i];
        break;
      }
    }

    if (planet) {
      displayPlanet(planet);
    }
  }

  async function getPlanets() {
    try {
      const response = await fetch("https://solar-system-opendata-proxy.vercel.app/api/planets");
      const data = await response.json();

      planets = data.bodies;

      const planetsGrid = document.getElementById("planets-grid");
      planetsGrid.innerHTML = "";

      planets.forEach(function (planet) {

        let imageName = planet.id;

        if (imageName === "mercure") imageName = "mercury";
        if (imageName === "terre") imageName = "earth";
        if (imageName === "saturne") imageName = "saturn";

        planetsGrid.innerHTML += `
        <div
          class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
          data-planet-id="${imageName}"
        >
          <div class="relative mb-3 h-24 flex items-center justify-center">
            <img
              class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
              src="./assets/images/${imageName}.png"
              alt="${planet.englishName}"
            />
          </div>

          <h4 class="font-semibold text-center text-sm">${planet.englishName}</h4>

          <p class="text-xs text-slate-400 text-center">
            ${(planet.semimajorAxis / 149597870.7).toFixed(2)} AU
          </p>
        </div>
      `;
      });

      document.querySelectorAll(".planet-card").forEach(function (card) {
        card.addEventListener("click", function () {
          loadPlanet(card.dataset.planetId);
        });
      });
generatePlanetsTable(planets);
      loadPlanet("earth");

    } catch (error) {
      console.log(error);
    }
  }

  function displayPlanet(planet) {
    planetName.textContent = planet.englishName;

    let imageName = planet.id;

    if (imageName === "mercure") imageName = "mercury";
    if (imageName === "terre") imageName = "earth";
    if (imageName === "saturne") imageName = "saturn";

    planetImage.src = "./assets/images/" + imageName + ".png";

    planetDescription.textContent =
      planet.description || "No description available.";

    planetDistance.textContent =
      planet.semimajorAxis
        ? `${(planet.semimajorAxis / 1000000).toFixed(1)}M km`
        : "Unknown";

    planetRadius.textContent =
      planet.meanRadius
        ? `${planet.meanRadius.toFixed(0)} km`
        : "Unknown";

    planetMass.textContent =
      planet.mass
        ? `${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`
        : "Unknown";

    planetDensity.textContent =
      planet.density ? `${planet.density.toFixed(2)} g/cm³` : "Unknown";

    planetOrbital.textContent =
      planet.sideralOrbit
        ? `${planet.sideralOrbit.toFixed(2)} days`
        : "Unknown";

    planetRotation.textContent =
      planet.sideralRotation
        ? `${planet.sideralRotation.toFixed(2)} hours`
        : "Unknown";

    planetMoons.textContent =
      planet.moons ? planet.moons.length : "0";

    planetGravity.textContent =
      planet.gravity
        ? `${planet.gravity} m/s²`
        : "Unknown";


    //Part 1
    discoverer.textContent =
      planet.discoveredBy || "Known since antiquity";

    discoveryDate.textContent =
      planet.discoveryDate || "Ancient times";

    bodyType.textContent =
      planet.bodyType || "Unknown";

    volume.textContent = planet.vol
      ? `${planet.vol.volValue} ×10^${planet.vol.volExponent} km³`
      : "N/A";

    //Part 3
    perihelion.textContent = planet.perihelion
      ? `${((planet.perihelion)/100000).toFixed(1)}M km`
      : "N/A";

    aphelion.textContent = planet.aphelion
      ? `${((planet.aphelion)/100000).toFixed(1)}M km`
      : "N/A";

    eccentricity.textContent =
      planet.eccentricity ?? "N/A";

    inclination.textContent =
      planet.inclination
        ? `${planet.inclination}°`
        : "N/A";

    axialTilt.textContent =
      planet.axialTilt
        ? `${(planet.axialTilt).toFixed(2)}°`
        : "N/A";

    temperature.textContent =
      planet.avgTemp
        ? `${(planet.avgTemp).toFixed(0)}°C`
        : "N/A";

       escapeVelocity.textContent =
    planet.escape
    ? `${(planet.escape / 1000)} km/s`
    : "Unknown";

    //Part 2
    factsContainer.innerHTML = `
<li class="flex items-start">
    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
    <span class="text-slate-300">
 Mass:
        ${planet.mass
        ? `${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`
        : "Unknown"}
    </span>
</li>

<li class="flex items-start">
    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
    <span class="text-slate-300">
        Surface gravity:
        ${planet.gravity ?? "Unknown"} m/s²
    </span>
</li>

<li class="flex items-start">
    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
    <span class="text-slate-300">
       Density:
        ${planet.density ?? "Unknown"} g/cm³
    </span>
</li>

<li class="flex items-start">
    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
    <span class="text-slate-300">
        Axial tilt:
        ${planet.axialTilt ?? "Unknown"}°
    </span>
</li>
`;
  }
const planetColors = {
  uranus: { circle: "#06b6d4", badgeBg: "bg-cyan-500/50", badgeText: "text-cyan-200" },
  mercury: { circle: "#eab308", badgeBg: "bg-orange-500/50", badgeText: "text-orange-200" },
  venus: { circle: "#f97316", badgeBg: "bg-orange-500/50", badgeText: "text-orange-200" },
  earth: { circle: "#3b82f6", badgeBg: "bg-blue-500/50", badgeText: "text-blue-200" },
  mars: { circle: "#ef4444", badgeBg: "bg-red-500/50", badgeText: "text-red-200" },
  jupiter: { circle: "#fb923c", badgeBg: "bg-purple-500/50", badgeText: "text-purple-200" },
  saturn: { circle: "#facc15", badgeBg: "bg-yellow-500/50", badgeText: "text-yellow-200" },
  neptune: { circle: "#2563eb", badgeBg: "bg-blue-500/50", badgeText: "text-blue-200" },
};
function formatOrbitalPeriod(days) {
  if (!days) return "Unknown";
  if (days >= 365) {
    return `${(days / 365.25).toFixed(1)} years`;
  }
  return `${Math.round(days)} days`;
}
function generatePlanetsTable(planets) {
  const comparisonTableBody = document.getElementById("planet-comparison-tbody");
  if (!comparisonTableBody) return;

  const earthPlanet = planets.find(function (p) {
    return p.id === "terre";
  });

  const earthMassKg = earthPlanet
    ? earthPlanet.mass.massValue * Math.pow(10, earthPlanet.mass.massExponent)
    : 5.97237e24;

  comparisonTableBody.innerHTML = "";

  planets.forEach(function (planet) {
    let imageName = planet.id;
    if (imageName === "mercure") imageName = "mercury";
    if (imageName === "terre") imageName = "earth";
    if (imageName === "saturne") imageName = "saturn";

    const distance = planet.semimajorAxis
      ? (planet.semimajorAxis / 149597870.7).toFixed(2)
      : "Unknown";

    const diameter = planet.meanRadius
      ? Math.round(planet.meanRadius * 2).toLocaleString()
      : "Unknown";

    let mass = "Unknown";
    if (planet.mass) {
      const massKg = planet.mass.massValue * Math.pow(10, planet.mass.massExponent);
      mass = (massKg / earthMassKg).toFixed(3);
    }

    const orbitalPeriod = formatOrbitalPeriod(planet.sideralOrbit);
    const moons = planet.moons ? planet.moons.length : 0;
    const type = planet.type || "Unknown";

    const colors = planetColors[imageName] || {
      circle: "#94a3b8",
      badgeBg: "bg-slate-700",
      badgeText: "text-slate-200",
    };

    comparisonTableBody.innerHTML += `
      <tr class="hover:bg-slate-800/30 transition-colors">

        <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
          <div class="flex items-center space-x-2 md:space-x-3">
            <div
              class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
              style="background-color: ${colors.circle}"
            ></div>
            <span class="font-semibold text-sm md:text-base whitespace-nowrap">${planet.englishName}</span>
          </div>
        </td>

        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${distance}</td>

        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${diameter}</td>

        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${mass}</td>

        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${orbitalPeriod}</td>

        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${moons}</td>

        <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
          <span class="px-2 py-1 rounded text-xs ${colors.badgeBg} ${colors.badgeText}">
            ${type}
          </span>
        </td>

      </tr>
    `;
  });
}

  getPlanets();
});