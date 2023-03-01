navigator.geolocation.getCurrentPosition(function(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const apiKey = "752ec2426d52813ab996121b8123207d";
  
  // Obtener el idioma del usuario
const userLanguage = navigator.language.split("-")[0]; // Obtener la parte del código del idioma (por ejemplo, "en" de "en-US")

// Ocultar el preloader
document.getElementById("loader").style.display = "none";
        
// Mostrar el contenedor
document.getElementsByClassName("container")[0].style.display = "block";

  // Agregar mapa meteorológico
  const mapContainer = document.getElementById("map-container");
  const mapHtml = `
    <div>
      <h1 class="mapita">Mapa meteorológico Hoy</h1>
      <iframe width="100%" height="700" frameborder="0" src="https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=${lat}&lon=${lon}&zoom=20&appid=${apiKey}"></iframe>
    </div>
  `;
  mapContainer.innerHTML = mapHtml;

  // Obtener el clima actual
const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${userLanguage}`;
fetch(currentWeatherUrl)
  .then(response => response.json())
  .then(data => {
    // Obtener el clima actual de hoy
    const currentTemperature = Math.round(data.main.temp);
    const currentDescription = data.weather[0].description;
    const currentIcon = data.weather[0].icon;
    const city = data.name;
    const country = data.sys.country;
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6);
    
    // Agregar la información del clima actual a la página
    const currentWeatherContainer = document.getElementById("current-weather-container");
    const currentWeatherHtml = `
      <div>
        <h2>${city}, ${country}</h2>
        <h2>Clima actual</h2>  
        <p><strong>${currentDescription}</strong></p>
        <div class="div-temp-img">
        <img class="img-clima-actual" src="http://openweathermap.org/img/w/${currentIcon}.png" alt="Weather icon">
        <p class="temperature"><strong>${currentTemperature}°C</strong></p>
        </div>
        <p><strong>Humedad: ${humidity}%</strong></p>
        <p><strong>Viento: ${windSpeed} Km/h</strong></p>
      </div>
    `;
    currentWeatherContainer.innerHTML = currentWeatherHtml;
  })
  .catch(error => console.log(error));

  // Obtener el pronóstico del tiempo para los próximos 5 días
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=${userLanguage}`;
fetch(forecastUrl)
  .then(response => response.json())
  .then(data => {
    // Filtrar los datos para obtener solo los pronósticos del tiempo para los próximos 5 días
    const forecastData = data.list;
    const days = {};

    // Agrupar los pronósticos por día
    forecastData.forEach(item => {
      const date = new Date(item.dt_txt);
      const dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'long' });

      if (!days[dayOfWeek]) {
        days[dayOfWeek] = [];
      }

      days[dayOfWeek].push(item);
    });
// Mostrar la información del pronóstico del tiempo en la página
const forecastContainer = document.getElementById("forecast-container");
let html = "";

Object.entries(days).forEach(([dayOfWeek, items]) => {
  html += `
    <div class="day-container">
      <h1>${dayOfWeek}</h1>
      <div class="weather-container">
        ${items.map(item => {
          const date = new Date(item.dt_txt);
          const timeOfDay = date.toLocaleTimeString('es-ES', { hour: 'numeric', minute: 'numeric' });
          const temperature = Math.round(item.main.temp - 273.15);
          const description = item.weather[0].description;
          const icon = item.weather[0].icon;

          return `
            <div>
              <p><strong>${timeOfDay}</strong><p>
              <img class="img-pronosticos" src="http://openweathermap.org/img/w/${icon}.png" alt="Weather icon">
              <p><strong>${description}</strong></p>
              <p class="temperatura"><strong>${temperature}°C</strong></p>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
});

forecastContainer.innerHTML = html;

  })
  .catch(error => console.log(error));
  
});

