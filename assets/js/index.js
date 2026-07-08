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

    launchesGrid.innerHTML = `
        <div class="col-span-full text-center py-10">
            <i class="fas fa-spinner fa-spin text-3xl text-blue-400"></i>
            <p class="mt-3 text-slate-400">Loading launches...</p>
        </div>
    `;

    try {
        const response = await fetch(
            "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10"
        );

        const data = await response.json();
        console.log(data)
        launchesGrid.innerHTML = "";

        data.results.forEach((launch) => {
            launchesGrid.innerHTML += `
                <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group">

                    <div class="relative h-48 bg-slate-900 flex items-center justify-center">
                        <i class="fas fa-rocket text-5xl text-slate-600"></i>

                        <div class="absolute top-3 right-3">
                            <span class="px-3 py-1 bg-blue-500 text-white rounded-full text-xs">
                                ${launch.status?.name ?? "Unknown"}
                            </span>
                        </div>
                    </div>

                    <div class="p-5">

                        <h4 class="font-bold text-lg mb-2 line-clamp-2">
                            ${launch.name}
                        </h4>

                        <p class="text-sm text-slate-400 mb-4">
                            ${launch.launch_service_provider?.name ?? "Unknown Agency"}
                        </p>

                        <div class="space-y-2 text-sm">

                            <div>
                                <i class="fas fa-calendar mr-2"></i>
                                ${new Date(launch.net).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric"
            })}
                            </div>

                            <div>
                                <i class="fas fa-clock mr-2"></i>
                                ${new Date(launch.net).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
            })}
                            </div>

                            <div>
                                <i class="fas fa-rocket mr-2"></i>
                                ${launch.rocket?.configuration?.name ?? "Unknown Rocket"}
                            </div>

                            <div>
                                <i class="fas fa-map-marker-alt mr-2"></i>
                                ${launch.pad?.location?.name ?? "Unknown Location"}
                            </div>

                        </div>

                        <button class="w-full mt-5 py-2 bg-slate-700 rounded-lg hover:bg-slate-600">
                            Details
                        </button>

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

const PLANET_COLORS = {
    mercury: "#eab308",
    venus: "#f97316",
    earth: "#3b82f6",
    mars: "#ef4444",
    jupiter: "#fb923c",
    saturn: "#facc15",
    uranus: "#06b6d4",
    neptune: "#2563eb",
};

const AU_IN_KM = 149597870.7;
let allPlanets = [];

async function getPlanets() {
    const planetsGrid = document.getElementById("planets-grid");

    planetsGrid.innerHTML = `
        <div class="col-span-full text-center py-10">
            <i class="fas fa-spinner fa-spin text-3xl text-blue-400"></i>
            <p class="mt-3 text-slate-400">Loading planets...</p>
        </div>
    `;

    try {
        const response = await fetch("https://solar-system-opendata-proxy.vercel.app/api/planets");
        const data = await response.json();
        console.log(data);

        allPlanets = data.bodies
            .filter((body) => body.isPlanet)
            .sort((a, b) => a.semimajorAxis - b.semimajorAxis);

        renderPlanetsGrid(allPlanets);
        renderComparisonTable(allPlanets);

        const earth = allPlanets.find((p) => p.englishName === "Earth");
        if (earth) renderPlanetDetail(earth);

    } catch (error) {
        console.error(error);
        planetsGrid.innerHTML = `
            <div class="col-span-full text-center py-10 text-slate-400">
                <i class="fas fa-exclamation-triangle text-3xl text-red-400 mb-3"></i>
                <p>تعذر تحميل بيانات الكواكب، حاولي تاني.</p>
            </div>
        `;
    }
}

// Planets 
function renderPlanetsGrid(planets) {
    const planetsGrid = document.getElementById("planets-grid");

    const cards = planets.map((planet) => {
        const id = planet.englishName.toLowerCase();
        const color = PLANET_COLORS[id] ?? "#94a3b8";
        const distanceAU = (planet.semimajorAxis / AU_IN_KM).toFixed(2);

        return `
            <div
                class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
                data-planet-id="${id}"
                style="--planet-color: ${color}"
                onmouseover="this.style.borderColor='${color}80'"
                onmouseout="this.style.borderColor='#334155'"
            >
                <div class="relative mb-3 h-24 flex items-center justify-center">
                    <img
                        class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                        src="./assets/images/${id}.png"
                        alt="${planet.englishName}"
                    />
                </div>
                <h4 class="font-semibold text-center text-sm">${planet.englishName}</h4>
                <p class="text-xs text-slate-400 text-center">${distanceAU} AU</p>
            </div>
        `;
    });

    planetsGrid.innerHTML = cards.join("");

    document.querySelectorAll(".planet-card").forEach((card) => {
        card.addEventListener("click", () => {
            const planetId = card.getAttribute("data-planet-id");
            const planet = allPlanets.find(
                (p) => p.englishName.toLowerCase() === planetId
            );
            if (planet) renderPlanetDetail(planet);
        });
    });
}

//Planet Detail 
function renderPlanetDetail(planet) {
    const id = planet.englishName.toLowerCase();

    document.getElementById("planet-detail-image").setAttribute(
        "src",
        `./assets/images/${id}.png`
    );
    document.getElementById("planet-detail-name").innerHTML = planet.englishName;
    document.getElementById("planet-detail-description").innerHTML =
        `${planet.englishName} is one of the ${allPlanets.length} planets in our Solar System, discovered ${planet.discoveryDate ?? "in ancient times"}.`;

    document.getElementById("planet-distance").innerHTML =
        `${(planet.semimajorAxis / 1_000_000).toFixed(1)}M km`;
    document.getElementById("planet-radius").innerHTML =
        `${planet.meanRadius.toLocaleString()} km`;
    document.getElementById("planet-mass").innerHTML =
        planet.mass ? `${planet.mass.massValue} × 10${toSuperscript(planet.mass.massExponent)} kg` : "N/A";
    document.getElementById("planet-density").innerHTML = `${planet.density} g/cm³`;
    document.getElementById("planet-orbital-period").innerHTML =
        `${planet.sideralOrbit.toFixed(2)} days`;
    document.getElementById("planet-rotation").innerHTML =
        `${Math.abs(planet.sideralRotation).toFixed(1)} hours`;
    document.getElementById("planet-moons").innerHTML = planet.moons ? planet.moons.length : 0;
    document.getElementById("planet-gravity").innerHTML = `${planet.gravity} m/s²`;

    document.getElementById("planet-discoverer").innerHTML =
        planet.discoveredBy || "Known since antiquity";
    document.getElementById("planet-discovery-date").innerHTML =
        planet.discoveryDate || "Ancient";
    document.getElementById("planet-body-type").innerHTML = planet.bodyType ?? "Planet";
    document.getElementById("planet-volume").innerHTML =
        planet.vol ? `${planet.vol.volValue} × 10${toSuperscript(planet.vol.volExponent)} km³` : "N/A";

    document.getElementById("planet-perihelion").innerHTML =
        `${(planet.perihelion / 1_000_000).toFixed(1)}M km`;
    document.getElementById("planet-aphelion").innerHTML =
        `${(planet.aphelion / 1_000_000).toFixed(1)}M km`;
    document.getElementById("planet-eccentricity").innerHTML = planet.eccentricity;
    document.getElementById("planet-inclination").innerHTML = `${planet.inclination}°`;
    document.getElementById("planet-axial-tilt").innerHTML = `${planet.axialTilt}°`;
    document.getElementById("planet-temp").innerHTML =
        planet.avgTemp ? `${(planet.avgTemp - 273).toFixed(0)}°C` : "N/A";
    document.getElementById("planet-escape").innerHTML =
        `${(planet.escape / 1000).toFixed(1)} km/s`;

    document.querySelectorAll("#planet-comparison-tbody tr").forEach((row) => {
        row.classList.remove("bg-blue-500/5");
        if (row.getAttribute("data-planet-id") === id) {
            row.classList.add("bg-blue-500/5");
        }
    });
}

function toSuperscript(num) {
    const map = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
    return String(num).split("").map((ch) => map[ch] ?? ch).join("");
}

//  Table
function renderComparisonTable(planets) {
    const tbody = document.getElementById("planet-comparison-tbody");

    const rows = planets.map((planet) => {
        const id = planet.englishName.toLowerCase();
        const color = PLANET_COLORS[id] ?? "#94a3b8";
        const distanceAU = (planet.semimajorAxis / AU_IN_KM).toFixed(2);
        const diameterKm = (planet.meanRadius * 2).toLocaleString();
        const massEarthRatio = planet.mass
            ? (planet.mass.massValue * Math.pow(10, planet.mass.massExponent) / 5.972e24).toFixed(3)
            : "—";
        const orbitalPeriod = planet.sideralOrbit > 600
            ? `${(planet.sideralOrbit / 365.25).toFixed(1)} years`
            : `${planet.sideralOrbit.toFixed(0)} days`;
        const moonsCount = planet.moons ? planet.moons.length : 0;

        const isGasGiant = ["jupiter", "saturn"].includes(id);
        const isIceGiant = ["uranus", "neptune"].includes(id);
        const typeLabel = isGasGiant ? "Gas Giant" : isIceGiant ? "Ice Giant" : "Terrestrial";
        const typeColorClass = isGasGiant
            ? "bg-purple-500/50 text-purple-200"
            : isIceGiant
            ? "bg-cyan-500/50 text-cyan-200"
            : "bg-orange-500/50 text-orange-200";

        return `
            <tr class="hover:bg-slate-800/30 transition-colors" data-planet-id="${id}">
                <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
                    <div class="flex items-center space-x-2 md:space-x-3">
                        <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0" style="background-color: ${color}"></div>
                        <span class="font-semibold text-sm md:text-base whitespace-nowrap">${planet.englishName}</span>
                    </div>
                </td>
                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${distanceAU}</td>
                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${diameterKm}</td>
                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${massEarthRatio}</td>
                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${orbitalPeriod}</td>
                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${moonsCount}</td>
                <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    <span class="px-2 py-1 rounded text-xs ${typeColorClass}">${typeLabel}</span>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = rows.join("");


    tbody.querySelectorAll("tr").forEach((row) => {
        row.style.cursor = "pointer";
        row.addEventListener("click", () => {
            const planetId = row.getAttribute("data-planet-id");
            const planet = allPlanets.find((p) => p.englishName.toLowerCase() === planetId);
            if (planet) renderPlanetDetail(planet);
        });
    });
}

getPlanets();