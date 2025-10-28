const apiKey = "d9f3b413aa3a90dc7917883e83b3da7f";

const searchBtn = document.getElementById("searchBtn");
const locateBtn = document.getElementById("locateBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfoDiv = document.getElementById("weatherInfo");
const errorMsg = document.getElementById("errorMsg");
const themeToggle = document.getElementById("themeToggle");

const aqiHealthMessages = {
  1: { level: "Good", colorClass: "aqi-good", message: "Air quality is satisfactory, and air pollution poses little or no risk." },
  2: { level: "Satisfactory", colorClass: "aqi-satisfactory", message: "Air quality is acceptable. Minor breathing discomfort to sensitive people." },
  3: { level: "Moderate", colorClass: "aqi-moderate", message: "May cause breathing discomfort to people with lung disease, older adults, and children." },
  4: { level: "Poor", colorClass: "aqi-poor", message: "Breathing discomfort to most people on prolonged exposure." },
  5: { level: "Very Poor", colorClass: "aqi-very-poor", message: "Respiratory illness on prolonged exposure. Avoid outdoor activities." },
  6: { level: "Severe", colorClass: "aqi-severe", message: "Serious health impacts even on healthy people. Avoid all outdoor exertion." }
};

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
  localStorage.setItem("theme", theme);
}

function detectSystemTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const saved = localStorage.getItem("theme");
  setTheme(saved || (prefersDark ? "dark" : "light"));
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

detectSystemTheme();

function resetUI() {
  weatherInfoDiv.classList.add("hidden");
  errorMsg.textContent = "";
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeatherData(city);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) getWeatherData(city);
  }
});

locateBtn.addEventListener("click", () => {
  resetUI();
  cityInput.value = "";
  errorMsg.textContent = "Locating...";

  if (!navigator.geolocation) {
    errorMsg.textContent = "Geolocation is not supported by your browser.";
    return;
  }

  const locationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      getWeatherDataByCoords(latitude, longitude);
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        errorMsg.textContent = "Location access was denied.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMsg.textContent = "Location information is currently unavailable. Please check your device settings.";
      } else if (error.code === error.TIMEOUT) {
        errorMsg.textContent = "The attempt to get the location timed out. Try again with better signal or GPS access.";
      } else {
        errorMsg.textContent = `An unknown error occurred: ${error.message}`;
      }
    },
    locationOptions
  );
});

async function getWeatherData(city) {
  resetUI();
  errorMsg.textContent = "Fetching weather...";
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!res.ok) throw new Error("City not found.");
    const data = await res.json();
    displayWeather(data);
    getAQI(data.coord.lat, data.coord.lon);
    errorMsg.textContent = "";
  } catch (err) {
    errorMsg.textContent = err.message;
  }
}

async function getWeatherDataByCoords(lat, lon) {
  resetUI();
  errorMsg.textContent = "Fetching weather...";
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!res.ok) throw new Error("Unable to fetch location data.");
    const data = await res.json();
    displayWeather(data);
    getAQI(lat, lon);
    errorMsg.textContent = "";
  } catch (err) {
    errorMsg.textContent = err.message;
  }
}

function displayWeather(data) {
  const iconMap = {
    Thunderstorm: "thunderstorms",
    Drizzle: "drizzle",
    Rain: "rain",
    Snow: "snow",
    Mist: "fog",
    Smoke: "fog",
    Haze: "fog",
    Dust: "dust",
    Fog: "fog",
    Sand: "dust",
    Ash: "fog",
    Squall: "wind",
    Tornado: "tornado", 
    Clouds: "cloudy"
  };

  const condition = data.weather[0].main;
  const iconName = iconMap[condition] || "cloudy";

  document.getElementById("cityName").textContent = data.name;
  document.getElementById("temp").textContent = `${data.main.temp.toFixed(1)}°C`;
  document.getElementById("condition").textContent = data.weather[0].description;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("wind").textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  document.getElementById("icon").src = `https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/fill/all/${iconName}.svg`;

  weatherInfoDiv.classList.remove("hidden");
}

async function getAQI(lat, lon) {
  const aqiValueEl = document.getElementById("aqiValue");
  const aqiMsgEl = document.getElementById("aqiMessage");
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const data = await res.json();
    const aqi = data.list[0].main.aqi;
    const info = aqiHealthMessages[aqi];
    aqiValueEl.textContent = aqi;
    aqiValueEl.className = `value ${info.colorClass}`;
    aqiMsgEl.textContent = info.message;
    aqiMsgEl.className = `aqi-message ${info.colorClass}`;
  } catch {
    aqiValueEl.textContent = "AQI unavailable";
    aqiMsgEl.textContent = "";
  }
}
