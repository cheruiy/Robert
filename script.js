document.addEventListener('DOMContentLoaded', fetchWeatherData);

function fetchWeatherData() {
  const apiUrl = 'http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=json';
  
  // Fetch weather data from 7timer API
  fetch(apiUrl)
    .then(response => response.json())
    .then(processData)
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function processData(data) {
  // Extract relevant weather data from the API response
  const currentWeather = {
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0].description
  };

  // Update default day and date
  const defaultDayElement = document.querySelector('.default_day');
  const defaultDateElement = document.querySelector('.default_date');
  defaultDayElement.textContent = getDayOfWeek(data.dataseries[0].timepoint);
  defaultDateElement.textContent = getCurrentDate(data.dataseries[0].timepoint);

    // Update city name, temperature, humidity, and wind speed
    const cityNameElement = document.querySelector('.day_info .value');
    const tempElement = document.querySelector('.day_info .value:nth-of-type(2)');
    const humidityElement = document.querySelector('.day_info .value:nth-of-type(3)');
    const windSpeedElement = document.querySelector('.day_info .value:nth-of-type(4)');
    cityNameElement.textContent = 'City';
    tempElement.textContent = `${currentWeather.temperature}°C`;
    humidityElement.textContent = `${currentWeather.humidity}%`;
    windSpeedElement.textContent = `${currentWeather.windSpeed} m/s`;

  // Update weather icon, temperature, and description
  const weatherIconElement = document.querySelector('.img_section img');
  const weatherTempElement = document.querySelector('.weather_temp');
  const cloudTxtElement = document.querySelector('.cloudtxt');
  weatherTempElement.textContent = `${currentWeather.temperature}°C`;
  cloudTxtElement.textContent = currentWeather.description;

  // Update forecast
  const forecastListElement = document.querySelector('.list_content ul');
  forecastListElement.innerHTML = ''; // Clear previous forecast items
  data.dataseries.slice(1, 6).forEach(day => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${getWeatherIcon(day.weather)}@2x.png">
      <span>${getDayOfWeek(day.timepoint)}</span>
      <span class="day_temp">${day.temp}°C</span>
    `;
    forecastListElement.appendChild(listItem);
  });
}

// Function to get the current day of the week
function getDayOfWeek(timepoint) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(timepoint * 1000);
  return days[date.getDay()];
}

// Function to get the weather icon code
function getWeatherIcon(weather) {
  // Implement logic to map weather conditions to appropriate icon codes
  // For example:
  if (weather.includes('clear')) {
    return '01d';
  } else if (weather.includes('rain')) {
    return '10d';
  } else if (weather.includes('cloud')) {
    return '02d';
  } else {
    return '01d';
  }
}

// Function to get the current date
function getCurrentDate(timepoint) {
  const date = new Date(timepoint * 1000);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
