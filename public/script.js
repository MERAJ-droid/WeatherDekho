document.addEventListener('DOMContentLoaded', () => {
    let city = 'London'; // Default city
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const loadingSpinner = document.getElementById('loading-spinner');

    let weatherChart; // Declare chart instance globally

    // Fetch weather data from the backend
    function fetchWeather(city) {
        const apiUrl = `/api/weather?city=${city}`;
        loadingSpinner.style.display = 'block';
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                updateWeather(data);
                fetchNews(city); // Fetch news after fetching weather data
                loadingSpinner.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                loadingSpinner.style.display = 'none';
            });
    }

    searchBtn.addEventListener('click', () => {
        city = cityInput.value;
        if (city) {
            fetchWeather(city);
        }
    });

    cityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchBtn.click(); // Simulate a click on the search button
        }
    });

    fetchWeather(city); // Fetch default city weather on page load

    function updateWeather(data) {
        const todayWeather = data.list[0];
        const city = data.city.name;
        const date = new Date(todayWeather.dt * 1000).toLocaleDateString();
        const temp = todayWeather.main.temp;
        const description = todayWeather.weather[0].description;
        const minTemp = todayWeather.main.temp_min;
        const maxTemp = todayWeather.main.temp_max;
        const windSpeed = todayWeather.wind.speed;
        const humidity = todayWeather.main.humidity;
        const sunrise = new Date(data.city.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.city.sunset * 1000).toLocaleTimeString();

        document.getElementById('city-name').textContent = city;
        document.getElementById('date').textContent = date;
        document.getElementById('temperature').textContent = `Temperature: ${temp}°C`;
        document.getElementById('description').textContent = description;
        document.getElementById('min-temp').textContent = `Min Temp: ${minTemp}°C`;
        document.getElementById('max-temp').textContent = `Max Temp: ${maxTemp}°C`;
        document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} m/s`;
        document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
        document.getElementById('sunrise').textContent = `Sunrise: ${sunrise}`;
        document.getElementById('sunset').textContent = `Sunset: ${sunset}`;

        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = ''; // Clear previous forecast

       

        for (let i = 1; i < data.list.length; i += 8) {
            const forecast = data.list[i];
            const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString();
            const forecastTemp = forecast.main.temp;
            const forecastDescription = forecast.weather[0].description;

            const forecastElement = document.createElement('div');
            forecastElement.className = 'forecast-day';
            forecastElement.innerHTML = `
                <h4>${forecastDate}</h4>
                <p>${forecastTemp}°C</p>
                <p>${forecastDescription}</p>
                <div class="forecast-day-content">
                    <p>Min Temp: ${forecast.main.temp_min}°C</p>
                    <p>Max Temp: ${forecast.main.temp_max}°C</p>
                    <p>Wind Speed: ${forecast.wind.speed} m/s</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                </div>
            `;
            forecastElement.addEventListener('click', () => {
                forecastElement.classList.toggle('expanded');
            });
            forecastContainer.appendChild(forecastElement);

            
        }

       
        changeBackground(description);
    }

    

    function changeBackground(description) {
        let imageUrl = '';
        if (description.includes('rain')) {
            imageUrl = 'rainy.gif';
        } else if (description.includes('clear')) {
            imageUrl = 'sunny.gif';
        } else if (description.includes('cloud')) {
            imageUrl = 'cloudy.gif';
        } else {
            imageUrl = 'default.jpg';
        }
        document.body.style.backgroundImage = `url(${imageUrl})`;
    }
});
