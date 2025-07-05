// OpenWeatherMap API key - more reliable for location search
const API_KEY = "d68fce741610928e4fcbbf3859036f96";

async function getGlobalWeather(latitude, longitude) {
  try {
    // Use OpenWeatherMap API for better location handling
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Format the weather information to match our expected structure
    const current = data.list[0]; // Current weather is the first item
    
    return {
      location: {
        latitude,
        longitude,
        timezone: data.city.timezone,
      },
      current: {
        temperature: {
          celsius: current.main.temp,
          fahrenheit: (current.main.temp * 9/5) + 32
        },
        humidity: current.main.humidity,
        wind: {
          speed: current.wind.speed,
          direction: current.wind.deg
        },
        visibility: current.visibility / 1000, // Convert to km
        barometer: current.main.pressure, // hPa
        uvIndex: 0, // OpenWeatherMap doesn't provide UV in free tier
        time: new Date(current.dt * 1000).toISOString()
      },
      today: {
        maxTemp: {
          celsius: Math.max(...data.list.slice(0, 8).map(item => item.main.temp_max)),
          fahrenheit: Math.max(...data.list.slice(0, 8).map(item => (item.main.temp_max * 9/5) + 32))
        },
        minTemp: {
          celsius: Math.min(...data.list.slice(0, 8).map(item => item.main.temp_min)),
          fahrenheit: Math.min(...data.list.slice(0, 8).map(item => (item.main.temp_min * 9/5) + 32))
        },
        sunrise: new Date(data.city.sunrise * 1000).toISOString(),
        sunset: new Date(data.city.sunset * 1000).toISOString()
      },
      hourly: data.list.slice(0, 24).map(item => ({
        time: new Date(item.dt * 1000).toISOString(),
        temperature: {
          celsius: item.main.temp,
          fahrenheit: (item.main.temp * 9/5) + 32
        },
        precipitation_probability: item.pop * 100, // Convert to percentage
        wind_speed: item.wind.speed
      }))
    };
  } catch (error) {
    console.error('Detailed error:', error);
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}

// Helper function to get coordinates from city name using OpenWeatherMap Geocoding API
export async function getCoordinates(cityName) {
  try {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error(`Location "${cityName}" not found`);
    }

    const result = data[0];
    return {
      latitude: result.lat,
      longitude: result.lon,
      name: result.name,
      country: result.country,
      state: result.state,
      timezone: 'UTC' // OpenWeatherMap doesn't provide timezone in geocoding
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

// Keep the old function for backward compatibility
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