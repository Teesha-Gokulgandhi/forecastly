// ===== CONFIG =====
const API_KEY = "e6ef9e539ae1d7b6d8952337c2b4c7e5";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const ICON_URL = "https://openweathermap.org/img/wn/";

// ===== ELEMENTS =====
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const weatherContent = document.getElementById("weatherContent");

const cityNameEl = document.getElementById("cityName");
const currentDateEl = document.getElementById("currentDate");
const currentTempEl = document.getElementById("currentTemp");
const weatherIconEl = document.getElementById("weatherIcon");
const weatherDescEl = document.getElementById("weatherDesc");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const forecastList = document.getElementById("forecastList");

// ===== HELPERS =====
const formatTemp = temp => Math.round(temp);

const formatDate = time =>
  new Date(time * 1000).toDateString();

const formatTime = time =>
  new Date(time * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

// ===== API =====
async function fetchWeather(city) {
  const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("City not found. Try again.");
  }

  return response.json();
}

// ===== UI =====
function renderCurrentWeather(data) {
  const current = data.list[0];

  cityNameEl.textContent = `${data.city.name}, ${data.city.country}`;
  currentDateEl.textContent = formatDate(current.dt);

  currentTempEl.textContent = formatTemp(current.main.temp);
  feelsLikeEl.textContent = formatTemp(current.main.feels_like) + "°C";
  humidityEl.textContent = current.main.humidity + "%";
  windEl.textContent = current.wind.speed + " m/s";

  weatherDescEl.textContent = current.weather[0].description;
  weatherIconEl.src = `${ICON_URL}${current.weather[0].icon}@2x.png`;
}

function renderForecast(data) {
  forecastList.innerHTML = "";

  data.list.slice(1, 6).forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <span>${formatTime(item.dt)}</span>
      <span>${formatTemp(item.main.temp)}°C</span>
      <span>${item.weather[0].main}</span>
    `;
    forecastList.appendChild(div);
  });
}

// ===== EVENTS =====
searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) return;

  loadingEl.classList.remove("hidden");
  errorEl.classList.add("hidden");
  weatherContent.classList.add("hidden");

  try {
    const data = await fetchWeather(city);
    renderCurrentWeather(data);
    renderForecast(data);
    weatherContent.classList.remove("hidden");
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.remove("hidden");
  } finally {
    loadingEl.classList.add("hidden");
  }
});

cityInput.addEventListener("keypress", e => {
  if (e.key === "Enter") searchBtn.click();
});
