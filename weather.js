const apiKey = '3f373754aa991917dba8a5a7e3073a24'; // Your Weatherstack API key
const baseUrl = 'https://api.weatherstack.com/current';

// Default location if geolocation fails or is denied
const defaultLocation = 'Seawater'; // Change this to your preferred default location

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Function to dynamically display weather data
function displayWeather(city, temperature, description) {
    const weatherDiv = document.createElement('div');
    weatherDiv.className = 'weather';
    
    const cityElement = document.createElement('p');
    cityElement.innerHTML = `<strong>City:</strong> ${city}`;
    
    const tempElement = document.createElement('p');
    tempElement.innerHTML = `<strong>Temperature:</strong> ${temperature.toFixed(1)}°F`;
    
    const descElement = document.createElement('p');
    descElement.innerHTML = `<strong>Description:</strong> ${description}`;

    weatherDiv.appendChild(cityElement);
    weatherDiv.appendChild(tempElement);
    weatherDiv.appendChild(descElement);
    
    document.body.appendChild(weatherDiv); // Append the weather info to the body
}

// Function to fetch weather data
function fetchWeather(location) {
    const url = `${baseUrl}?access_key=${apiKey}&query=${location}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success === false) {
                alert('Error fetching data: ' + data.error.info);
                return;
            }

            const { location, current } = data;
            const temperatureInFahrenheit = celsiusToFahrenheit(current.temperature);
            displayWeather(location.name, temperatureInFahrenheit, current.weather_descriptions[0]);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching data');
        });
}

// Automatically get weather for user's location or default location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const url = `${baseUrl}?access_key=${apiKey}&query=${latitude},${longitude}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.success === false) {
                    alert('Error fetching data: ' + data.error.info);
                    return;
                }

                const { location, current } = data;
                const temperatureInFahrenheit = celsiusToFahrenheit(current.temperature);
                displayWeather(location.name, temperatureInFahrenheit, current.weather_descriptions[0]);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error fetching data');
            });
    }, error => {
        console.error('Geolocation error:', error);
        fetchWeather(defaultLocation);
    });
} else {
    alert('Geolocation is not supported by this browser.');
    fetchWeather(defaultLocation);
}
