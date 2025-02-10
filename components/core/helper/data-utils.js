// weather data:
// "current":
// 	{
// 		"humidity": 84,
// 		"temperature":
// 		{
// 			"celsius": 3.2,
// 			"fahrenheit": 37.76
// 		},
// 		"time": "2025-02-10T09:45",
// 		"wind":
// 		{
// 			"direction": 44,
// 			"speed": 17.1
// 		}
// 	},
// 	"hourly": [
// 	{
// 		"precipitation_probability": 48,
// 		"temperature": [Object],
// 		"time": "2025-02-10T00:00",
// 		"wind_speed": 14.9
// 	},
// 	...
// expected outputs: 
// Light Rain | Heavy Rain | Sunny | Windy | Cloudy
export function getWeatherCondition(weather) {
    const { wind, humidity, time } = weather.current;
    
    // Find current hour's precipitation probability
    const currentTime = new Date(time);
    const currentHourData = weather.hourly.find(hour => 
        new Date(hour.time).getHours() === currentTime.getHours()
    );
    
    const precipProb = currentHourData ? currentHourData.precipitation_probability : 0;
    
    // Define thresholds
    const STRONG_WIND_THRESHOLD = 15; // m/s
    const HIGH_PRECIP_THRESHOLD = 70; // percentage
    const MODERATE_PRECIP_THRESHOLD = 30; // percentage
    
    // Check for windy conditions first (highest priority)
    if (wind.speed > STRONG_WIND_THRESHOLD) {
        return 'Windy';
    }
    
    // Check rain conditions based on precipitation probability
    if (precipProb >= HIGH_PRECIP_THRESHOLD) {
        return 'Heavy Rain';
    }
    
    if (precipProb >= MODERATE_PRECIP_THRESHOLD) {
        return 'Light Rain';
    }
    
    // If humidity is high but no rain predicted, likely cloudy
    if (humidity > 70) {
        return 'Cloudy';
    }
    
    // Default to sunny if none of the above conditions are met
    return 'Sunny';
}

export default function getTodayCondition(weather) {
    // Get today's date to filter hourly data
    const today = new Date(weather.current.time).toISOString().split('T')[0];
    
    // Get today's hourly data
    const todayHours = weather.hourly.filter(hour => 
        hour.time.startsWith(today)
    );
    
    // Get max temperature from daily data
    const maxTemp = {
        celsius: weather.today.maxTemp.celsius,
        fahrenheit: weather.today.maxTemp.fahrenheit
    };
    
    // Get weather condition for each hour and find most common
    const conditions = todayHours.map(hour => {
        const hourWeather = {
            current: {
                humidity: weather.current.humidity,
                temperature: {
                    celsius: hour.temperature.celsius
                },
                time: hour.time,
                wind: {
                    speed: hour.wind_speed
                }
            },
            hourly: weather.hourly // Pass full hourly data for precipitation lookup
        };
        
        return getWeatherCondition(hourWeather);
    });
    
    // Count occurrences of each condition
    const conditionCounts = conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});
    
    // Find the most common condition
    const dominantCondition = Object.entries(conditionCounts)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    
    return {
        maxTemperature: maxTemp,
        condition: dominantCondition
    };
}

export function getTonightCondition(weather) {
    // Get today's date and tonight's hours (6 PM to midnight)
    const today = new Date(weather.current.time).toISOString().split('T')[0];
    
    // Get sunset time for reference
    const sunset = new Date(weather.today.sunset);
    const sunsetHour = sunset.getHours();
    
    // Filter for evening hours (after sunset until midnight)
    const tonightHours = weather.hourly.filter(hour => {
        const hourDate = new Date(hour.time);
        const hourTime = hourDate.getHours();
        return hour.time.startsWith(today) && hourTime >= sunsetHour;
    });
    
    // Get min temperature for tonight's hours
    const tonightTemps = tonightHours.map(hour => hour.temperature.celsius);
    const minTemp = Math.min(...tonightTemps);
    
    // Get weather condition for each evening hour and find most common
    const conditions = tonightHours.map(hour => {
        const hourWeather = {
            current: {
                humidity: weather.current.humidity,
                temperature: {
                    celsius: hour.temperature.celsius
                },
                time: hour.time,
                wind: {
                    speed: hour.wind_speed
                }
            },
            hourly: weather.hourly // Pass full hourly data for precipitation lookup
        };
        
        return getWeatherCondition(hourWeather);
    });
    
    // Count occurrences of each condition
    const conditionCounts = conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});
    
    // Find the most common condition
    const dominantCondition = Object.entries(conditionCounts)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    
    return {
        temperature: {
            celsius: minTemp,
            fahrenheit: (minTemp * 9/5) + 32
        },
        condition: dominantCondition
    };
}