// Wait for the DOM content to load before executing the script
document.addEventListener("DOMContentLoaded", function () {
  // Select DOM elements
  const form = document.querySelector("form"); // Select the form element
  const inputField = document.querySelector(".input_field"); // Select the input field
  const defaultDay = document.querySelector(".default_day"); // Select the element displaying the default day
  const defaultDate = document.querySelector(".default_date"); // Select the element displaying the default date
  const weatherTemp = document.querySelector(".weather_temp"); // Select the element displaying the weather temperature
  const cloudTxt = document.querySelector(".cloudtxt"); // Select the element displaying the weather condition
  const cityValue = document.querySelector(".value.city"); // Select the element displaying the city name
  const tempValue = document.querySelector(".value.temperature"); // Select the element displaying the temperature
  const humidityValue = document.querySelector(".value.humidity"); // Select the element displaying the humidity
  const windSpeedValue = document.querySelector(".value.wind_speed"); // Select the element displaying the wind speed
  const listContent = document.querySelector(".list_content ul"); // Select the unordered list element

  // Add event listener to the form
  form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Extract the city name from the input field
    const cityName = inputField.value.trim().toLowerCase();

    // Fetch weather data from the API
    fetch('http://localhost:3000/cities')
      .then(function (response) {
        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the response as JSON
      })
      .then(function (data) {
        // Find the city in the data
        const city = data.cities.find(city => city.name.toLowerCase() === cityName);

        // Display the weather data if the city is found
        if (city) {
          const currentWeather = city.weather[0];

          // Update default info
          defaultDay.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long' });
          defaultDate.textContent = new Date().toLocaleDateString('en-US');
          weatherTemp.textContent = currentWeather.temperature + "°C";
          cloudTxt.textContent = "Clouds";

          // Update day info
          cityValue.textContent = city.name;
          tempValue.textContent = currentWeather.temperature + "°C";
          humidityValue.textContent = currentWeather.humidity + "%";
          windSpeedValue.textContent = currentWeather.wind + "m/s";

          // Update list content
          listContent.innerHTML = "";
          city.weather.forEach(weather => {
            const li = document.createElement("li");
            li.innerHTML = `
              <img src="https://openweathermap.org/img/wn/10d@2x.png" />
              <span>${new Date(weather.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
              <span class="day_temp">${weather.temperature}°C</span>
            `;
            listContent.appendChild(li);
          });

          // Clear the input field
          inputField.value = "";
        } else {
          // Alert if the city is not found
          alert("City not found!");
        }
      })
      .catch(function (error) {
        // Log and handle errors
        console.error("Error fetching weather data:", error);
        alert("Error fetching weather data. Please try again later.");
      });
  });
});

