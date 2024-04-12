document.addEventListener('DOMContentLoaded', function() {
  const apiUrl = 'http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=json';

  // Fetch weather data from 7timer API
  fetch(apiUrl)
      .then(response => response.json())
      .then(processData)
      .catch(error => {
          console.error('Error fetching weather data:', error);
      });


function processData(data) {
  // Extract relevant weather data from the API response
  const currentWeather = {
    temperature: data.dataseries[0].temp2m,
    humidity: data.dataseries[0].rh2m,
    windSpeed: data.dataseries[0].wspd10m,
    description: data.dataseries[0].weather
  };

  // Update default day and date
  const defaultDayElement = document.querySelector('.default_day');
  const defaultDateElement = document.querySelector('.default_date');
  const currentDate = new Date();
  defaultDayElement.textContent = getDayOfWeek(currentDate.getDay());
  defaultDateElement.textContent = getCurrentDate(currentDate);

  // Update weather icon, temperature, and description
  const weatherIconElement = document.querySelector('.img_section img');
  const weatherTempElement = document.querySelector('.weather_temp');
  const cloudTxtElement = document.querySelector('.cloudtxt');
  weatherIconElement.src = `https://openweathermap.org/img/wn/${getWeatherIcon(currentWeather.description)}.png`;
  weatherTempElement.textContent = `${currentWeather.temperature}°C`;
  cloudTxtElement.textContent = currentWeather.description;

  // Update city name, temperature, humidity, and wind speed
  const cityNameElement = document.querySelector('.day_info .value');
  const tempElement = document.querySelector('.day_info .value:nth-of-type(2)');
  const humidityElement = document.querySelector('.day_info .value:nth-of-type(3)');
  const windSpeedElement = document.querySelector('.day_info .value:nth-of-type(4)');
  cityNameElement.textContent = 'Sample City'; // Update with actual city name if available in API response
  tempElement.textContent = `${currentWeather.temperature}°C`;
  humidityElement.textContent = `${currentWeather.humidity}%`;
  windSpeedElement.textContent = `${currentWeather.windSpeed} m/s`;

  // Update forecast
  const forecastListElement = document.querySelector('.list_content ul');
  forecastListElement.innerHTML = ''; // Clear previous forecast items
  data.dataseries.slice(1, 5).forEach(day => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${getWeatherIcon(day.weather)}.png">
      <span>${getDayOfWeek(day.timepoint)}</span>
      <span class="day_temp">${day.temp2m}°C</span>
    `;
    forecastListElement.appendChild(listItem);
  });
}

// Function to get the current day of the week
function getDayOfWeek(dayIndex) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

// Function to get the weather icon code
function getWeatherIcon(weather) {
  if (!weather) return '01d'; // Default icon if weather is undefined or null

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
function getCurrentDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
})
