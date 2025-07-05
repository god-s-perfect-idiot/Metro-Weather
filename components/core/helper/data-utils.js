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
// Rain | Sunny | Windy | Cloudy
export function getWeatherCondition(weather) {
    const { wind, humidity, time } = weather.current;
    
    // Find current hour's precipitation probability
    const currentTime = new Date(time);
    const currentHourData = weather.hourly.find(hour => 
        new Date(hour.time).getHours() === currentTime.getHours()
    );
    
    const precipProb = currentHourData ? currentHourData.precipitation_probability : 0;
    
    // Define thresholds
    const STRONG_WIND_THRESHOLD = 25; // m/s (increased from 15 to be more forgiving)
    const RAIN_THRESHOLD = 30; // percentage
    
    // Check for windy conditions first (highest priority)
    if (wind.speed > STRONG_WIND_THRESHOLD) {
        return 'Windy';
    }
    
    // Check for rain (combining previous light and heavy rain thresholds)
    if (precipProb >= RAIN_THRESHOLD) {
        return 'Rain';
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

function calculateFeelsLike(temperature, humidity, windSpeed) {
    const tempC = typeof temperature === 'object' ? temperature.celsius : temperature;
    const tempF = (tempC * 9/5) + 32;
    
    // Convert wind speed from m/s to mph for the formula
    const windSpeedMph = windSpeed * 2.237;
    
    // For cold temperatures, use wind chill
    if (tempF <= 50) {
        const windChill = 35.74 + (0.6215 * tempF) - (35.75 * Math.pow(windSpeedMph, 0.16)) 
            + (0.4275 * tempF * Math.pow(windSpeedMph, 0.16));
        
        return {
            celsius: ((windChill - 32) * 5/9),
            fahrenheit: windChill
        };
    }
    
    // For hot temperatures, use heat index
    if (tempF >= 80) {
        const heatIndex = -42.379 + (2.04901523 * tempF) + (10.14333127 * humidity) 
            - (0.22475541 * tempF * humidity) - (6.83783 * Math.pow(10, -3) * tempF * tempF) 
            - (5.481717 * Math.pow(10, -2) * humidity * humidity) 
            + (1.22874 * Math.pow(10, -3) * tempF * tempF * humidity) 
            + (8.5282 * Math.pow(10, -4) * tempF * humidity * humidity) 
            - (1.99 * Math.pow(10, -6) * tempF * tempF * humidity * humidity);
            
        return {
            celsius: ((heatIndex - 32) * 5/9),
            fahrenheit: heatIndex
        };
    }
    
    // For moderate temperatures, use a weighted average of both
    const ratio = (tempF - 50) / 30; // will be between 0 and 1
    const windChillF = 35.74 + (0.6215 * tempF) - (35.75 * Math.pow(windSpeedMph, 0.16)) 
        + (0.4275 * tempF * Math.pow(windSpeedMph, 0.16));
        
    // Return actual temperature for moderate conditions with low wind
    if (windSpeedMph < 3) {
        return {
            celsius: tempC,
            fahrenheit: tempF
        };
    }
    
    // Apply wind chill effect proportionally for moderate temperatures
    const adjustedTemp = tempF - ((tempF - windChillF) * (1 - ratio));
    
    return {
        celsius: ((adjustedTemp - 32) * 5/9),
        fahrenheit: adjustedTemp
    };
}

// Usage with the weather data structure
export function getFeelsLikeTemperature(weather) {
    const { temperature, humidity, wind } = weather.current;
    return calculateFeelsLike(temperature, humidity, wind.speed);
}

// Get daily weather data for the next 7 days
export function getDailyWeather(weather) {
    const dailyData = [];
    
    // Use the daily data from Open-Meteo API (7 days)
    if (weather.daily && weather.daily.length > 0) {
        // Skip today and get the next 7 days
        const today = new Date(weather.current.time).toISOString().split('T')[0];
        
        weather.daily.forEach((day, index) => {
            const dayDate = new Date(day.date).toISOString().split('T')[0];
            
            // Skip today
            if (dayDate === today) {
                return;
            }
            
            const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
            const formattedDate = new Date(day.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Get weather condition based on precipitation probability
            const precipProb = day.precipitation_probability;
            let weatherCondition = 'Sunny';
            
            if (precipProb >= 30) {
                weatherCondition = 'Rain';
            } else if (weather.current.humidity > 70) {
                weatherCondition = 'Cloudy';
            }
            
            console.log(`Day ${dayName}: Precip ${precipProb}%, Condition: ${weatherCondition}`);
            
            dailyData.push({
                day: dayName,
                date: formattedDate,
                weather: weatherCondition,
                temperature: {
                    max: Math.round(day.temperature.max),
                    min: Math.round(day.temperature.min)
                },
                windSpeed: 0, // Open-Meteo daily doesn't provide wind speed, will need to calculate from hourly
                rainChance: Math.round(precipProb)
            });
        });
        
        // Limit to 7 days
        return dailyData.slice(0, 7);
    }
    
    // Fallback to hourly data processing if daily data is not available
    const days = {};
    weather.hourly.forEach(hour => {
        const date = new Date(hour.time).toISOString().split('T')[0];
        if (!days[date]) {
            days[date] = [];
        }
        days[date].push(hour);
    });
    
    // Get today's date to skip it
    const today = new Date(weather.current.time).toISOString().split('T')[0];
    
    // Get the next available days (skip today)
    const sortedDates = Object.keys(days)
        .sort()
        .filter(date => date !== today) // Skip today
        .slice(0, 7); // Get up to 7 days
    
    console.log(`Today: ${today}, Available dates: ${sortedDates.join(', ')}`);
    
    sortedDates.forEach(date => {
        const dayHours = days[date];
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        const formattedDate = new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Calculate daily stats
        const temperatures = dayHours.map(hour => hour.temperature.celsius);
        const windSpeeds = dayHours.map(hour => hour.wind_speed);
        const precipitationProbs = dayHours.map(hour => hour.precipitation_probability);
        
        // Get weather condition for the day (most common condition)
        const conditions = dayHours.map(hour => {
            const hourWeather = {
                current: {
                    humidity: weather.current.humidity,
                    temperature: hour.temperature,
                    time: hour.time,
                    wind: { speed: hour.wind_speed }
                },
                hourly: weather.hourly
            };
            
            // Check precipitation probability directly for this hour
            const precipProb = hour.precipitation_probability;
            const windSpeed = hour.wind_speed;
            
            // Debug logging
            console.log(`Hour: ${hour.time}, Precip: ${precipProb}%, Wind: ${windSpeed} m/s`);
            
            // Apply the same logic as getWeatherCondition but with actual hour data
            const STRONG_WIND_THRESHOLD = 25;
            const RAIN_THRESHOLD = 30;
            
            if (windSpeed > STRONG_WIND_THRESHOLD) {
                console.log(`  -> Windy (wind: ${windSpeed} > ${STRONG_WIND_THRESHOLD})`);
                return 'Windy';
            }
            
            if (precipProb >= RAIN_THRESHOLD) {
                console.log(`  -> Rain (precip: ${precipProb}% >= ${RAIN_THRESHOLD}%)`);
                return 'Rain';
            }
            
            // Use humidity from current weather for cloudiness check
            if (weather.current.humidity > 70) {
                console.log(`  -> Cloudy (humidity: ${weather.current.humidity}% > 70%)`);
                return 'Cloudy';
            }
            
            console.log(`  -> Sunny (default)`);
            return 'Sunny';
        });
        
        // Find most common condition
        const conditionCounts = conditions.reduce((acc, condition) => {
            acc[condition] = (acc[condition] || 0) + 1;
            return acc;
        }, {});
        
        console.log(`Day ${dayName} condition counts:`, conditionCounts);
        
        const dominantCondition = Object.entries(conditionCounts)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0];
        
        console.log(`Selected dominant condition for ${dayName}: ${dominantCondition}`);
        
        dailyData.push({
            day: dayName,
            date: formattedDate,
            weather: dominantCondition,
            temperature: {
                max: Math.round(Math.max(...temperatures)),
                min: Math.round(Math.min(...temperatures))
            },
            windSpeed: Math.round(
                windSpeeds.reduce((sum, speed) => sum + speed, 0) / windSpeeds.length
            ),
            rainChance: Math.round(
                precipitationProbs.reduce((sum, prob) => sum + prob, 0) / precipitationProbs.length
            )
        });
    });
    
    return dailyData;
}

// Get hourly weather data for today from current time until midnight
export function getHourlyWeather(weather) {
    const hourlyData = [];
    
    // Get current time
    const currentTime = new Date(weather.current.time);
    const currentHour = currentTime.getHours();
    
    // Get today's date
    const today = currentTime.toISOString().split('T')[0];
    
    // Filter hourly data for today from current hour until midnight
    const todayHours = weather.hourly.filter(hour => {
        const hourDate = new Date(hour.time);
        const hourTime = hourDate.getHours();
        return hour.time.startsWith(today) && hourTime >= currentHour;
    });
    
    todayHours.forEach((hour, index) => {
        const hourDate = new Date(hour.time);
        const hourTime = hourDate.getHours();
        
        // Format time (12-hour format)
        const timeString = hourTime === 0 ? '12 AM' : 
                          hourTime === 12 ? '12 PM' :
                          hourTime > 12 ? `${hourTime - 12} PM` : `${hourTime} AM`;
        
        // Get weather condition for this hour
        const precipProb = hour.precipitation_probability;
        const windSpeed = hour.wind_speed;
        let weatherCondition = 'Sunny';
        
        if (windSpeed > 25) {
            weatherCondition = 'Windy';
        } else if (precipProb >= 30) {
            weatherCondition = 'Rain';
        } else if (weather.current.humidity > 70) {
            weatherCondition = 'Cloudy';
        }
        
        hourlyData.push({
            time: timeString,
            weather: weatherCondition,
            temperature: Math.round(hour.temperature.celsius),
            windSpeed: Math.round(windSpeed),
            rainChance: Math.round(precipProb)
        });
    });
    
    return hourlyData;
}