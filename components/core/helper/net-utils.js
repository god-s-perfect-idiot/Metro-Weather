// Its a free API key so, what the hell
const API_KEY = "d68fce741610928e4fcbbf3859036f96";

async function getGlobalWeather(latitude, longitude) {
  try {
      // Fetch both current weather and forecast with additional parameters
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`
          + `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m`
          + `&current=visibility,pressure_msl,uv_index`  // Added new parameters
          + `&hourly=temperature_2m,precipitation_probability,wind_speed_10m`
          + `&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset`
          + `&timezone=auto`;

      const response = await fetch(url);
      
      if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Format the weather information including new metrics
      return {
          location: {
              latitude,
              longitude,
              timezone: data.timezone,
          },
          current: {
              temperature: {
                  celsius: data.current.temperature_2m,
                  fahrenheit: (data.current.temperature_2m * 9/5) + 32
              },
              humidity: data.current.relative_humidity_2m,
              wind: {
                  speed: data.current.wind_speed_10m,
                  direction: data.current.wind_direction_10m
              },
              visibility: data.current.visibility, // meters
              barometer: data.current.pressure_msl, // hPa (hectopascals)
              uvIndex: data.current.uv_index,
              time: data.current.time
          },
          today: {
              maxTemp: {
                  celsius: data.daily.temperature_2m_max[0],
                  fahrenheit: (data.daily.temperature_2m_max[0] * 9/5) + 32
              },
              minTemp: {
                  celsius: data.daily.temperature_2m_min[0],
                  fahrenheit: (data.daily.temperature_2m_min[0] * 9/5) + 32
              },
              sunrise: data.daily.sunrise[0],
              sunset: data.daily.sunset[0]
          },
          hourly: data.hourly.time.map((time, index) => ({
              time,
              temperature: {
                  celsius: data.hourly.temperature_2m[index],
                  fahrenheit: (data.hourly.temperature_2m[index] * 9/5) + 32
              },
              precipitation_probability: data.hourly.precipitation_probability[index],
              wind_speed: data.hourly.wind_speed_10m[index]
          }))
      };
  } catch (error) {
      console.error('Detailed error:', error);
      throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}

// Helper function to get coordinates from city name using OpenMeteo Geocoding API
export async function getCoordinates(cityName) {
  try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
      const response = await fetch(url);
      
      if (!response.ok) {
          throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
          throw new Error(`Location "${cityName}" not found`);
      }

      const result = data.results[0];
      return {
          latitude: result.latitude,
          longitude: result.longitude,
          name: result.name,
          country: result.country,
          timezone: result.timezone
      };
  } catch (error) {
      console.error('Detailed error:', error);
      throw new Error(`Failed to get coordinates: ${error.message}`);
  }
}

export async function getWeather(location) {
  try {
      const coordinates = await getCoordinates(location);
      return await getGlobalWeather(coordinates.latitude, coordinates.longitude);
  } catch (error) {
      console.error('Detailed error:', error);
      throw new Error(`Failed to get weather: ${error.message}`);
  }
}

export async function getWeatherData(location, apiKey = API_KEY) {
  try {
    // First, get coordinates for the location
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      location
    )}&limit=1&appid=${apiKey}`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    console.log(geoData)
    if (!geoData.length) {
      throw new Error("Location not found");
    }

    const { lat, lon } = geoData[0];

    // Then, get weather data using the coordinates
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // Format the weather information
    return {
      location: geoData[0].name,
      country: geoData[0].country,
      temperature: {
        current: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        min: Math.round(weatherData.main.temp_min),
        max: Math.round(weatherData.main.temp_max),
      },
      humidity: weatherData.main.humidity,
      wind: {
        speed: weatherData.wind.speed,
        direction: weatherData.wind.deg,
      },
      conditions: {
        main: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
      },
      timestamp: new Date(weatherData.dt * 1000),
    };
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}