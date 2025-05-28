const API_KEY = '576b4efd0emsh08fdce5bfd390fbp1a4975jsn7c321e2d6130';
const API_HOST = 'visual-crossing-weather.p.rapidapi.com';

// Default city to load
const DEFAULT_CITY = 'Biharsharif';

document.addEventListener('DOMContentLoaded', () => {
  fetchWeather(DEFAULT_CITY);
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  if (!city) {
    alert('Please enter a city name');
  } else {
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  const url = `https://${API_HOST}/forecast`;
  const params = new URLSearchParams({
    aggregateHours: '24',
    location: city,
    contentType: 'json',
    unitGroup: 'metric',
    shortColumnNames: '0',
  });

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    });

    if (!response.ok) throw new Error('City not found');

    const data = await response.json();
    const weather = Object.values(data.locations)[0].values[0];

    console.log('Weather data:', weather); // Debug the weather data returned
    updateWeatherDetails(city, weather);
  } catch (error) {
    console.error('Error fetching weather:', error);
    showError();
  }
}

function updateWeatherDetails(city, weather) {
  document.getElementById('location').textContent = city;
  document.getElementById('description').textContent = `Weather: ${weather.conditions}`;
  document.getElementById('temperature').textContent = `Temperature: ${weather.temp}°C`;
  document.getElementById('humidity').textContent = `Humidity: ${weather.humidity}%`;
  document.getElementById('windSpeed').textContent = `Wind Speed: ${weather.wspd} km/h`;


  // Assign the local image based on the weather condition
  const weatherIcon = getWeatherIcon(weather.conditions.toLowerCase());
  document.getElementById('weatherIcon').src = `./icons/${weatherIcon}`;
  document.getElementById('weatherIcon').alt = weather.conditions;

  const weatherDetails = document.getElementById('weatherDetails');
  weatherDetails.classList.remove('hidden');
  document.getElementById('errorMessage').classList.add('hidden');

  setupTemperatureToggle(weather.temp);
}

function setupTemperatureToggle(tempCelsius) {
  const toggleButton = document.getElementById('toggleTemp');
  let isCelsius = true;

  toggleButton.onclick = () => {
    const tempElement = document.getElementById('temperature');
    if (isCelsius) {
      const tempFahrenheit = (tempCelsius * 9) / 5 + 32;
      tempElement.textContent = `Temperature: ${tempFahrenheit.toFixed(1)}°F`;
    } else {
      tempElement.textContent = `Temperature: ${tempCelsius}°C`;
    }
    isCelsius = !isCelsius;
  };
}

function showError() {
  document.getElementById('errorMessage').classList.remove('hidden');
  document.getElementById('weatherDetails').classList.add('hidden');
}

function getWeatherIcon(condition) {
  // Map the weather condition to the appropriate icon file
  const icons = {
    sunny: "sun.png",
    cloudy: "cloud.png",
    overcast: "cloud.png",
    fog: "fog.png",
    mist: "fog.png",
    rain: "rain.png",
    drizzle: "rain.png",
    sleet: "snow.png",
    snow: "snow.png",
    thunderstorm: "storm.png",
    windy: "windy.png",
    clear: "sun.png",
  };

  // Match the condition to an icon or default to cloudy
  return icons[condition] || "cloud.png";
}
