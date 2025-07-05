import {
  View,
  Text,
  StatusBar,
  BackHandler,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MainTitle } from "./core/decorator/MainTitle";
import { Globe, Settings, Thermometer } from "react-native-feather";
import { PageView } from "./compound/PageView";
import { Select } from "./core/action/Select";
import { Button } from "./core/action/Button";
import Link from "./core/action/Link";
import { TextBox } from "./core/action/TextBox";
import { Switch } from "./core/action/Switch";
import { PageContent } from "./compound/PageContent";
import { Loader } from "./core/decorator/Loader";
import { useEffect, useState } from "react";
import { fonts } from "../styles/fonts";
import { getWeather, getWeatherData } from "./core/helper/net-utils";
import getTodayCondition, {
  getFeelsLikeTemperature,
  getTonightCondition,
  getWeatherCondition,
  getDailyWeather,
  getHourlyWeather,
} from "./core/helper/data-utils";
import LocationBox from "./compound/LocationBox";
import { Pivot } from "../animations/Pivot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Droplet } from "react-native-feather";
import * as Animatable from "react-native-animatable";
import SettingsPage from "./SettingsPage";
import { createToggleTemperatureUnit, loadTemperatureUnit, loadColoredTiles, saveColoredTiles } from "../utils/temperatureUtils";

const AnimatedView = Animatable.createAnimatableComponent(View);

// Simple Globe icon component
// const GlobeIcon = ({ stroke = "white", size = 24 }) => (
//   <Text style={{ color: stroke, fontSize: size, fontWeight: 'bold' }}>🌍</Text>
// );

const Page = ({
  temperature,
  weatherCondition,
  dayTemperature,
  todayCondition,
  nightTemperature,
  tonightCondition,
  humidity,
  feelsLike,
  windSpeed,
  barometer,
  visibility,
  uvIndex,
  temperatureUnit,
  windSpeedUnit,
}) => {
  return (
    <PageContent
      items={[
        <View>
          <View className="flex flex-row items-center mt-48">
            <Text
              className="text-white text-[150px] leading-tight"
              style={{ ...fonts.light, letterSpacing: -10, lineHeight: 160 }}
            >
              {temperature}
            </Text>
            <Text
              className="text-white text-[50px] mb-[100px]"
              style={fonts.light}
            >
              &deg;{temperatureUnit}
            </Text>
          </View>
          <Text className="text-white text-xl mb-4" style={fonts.regular}>
            {weatherCondition}
          </Text>
          <View className="flex flex-row border-b-[0.5px] border-white w-full" />
        </View>,
        <View className="flex flex-row items-center justify-between w-full">
          <View className="flex flex-col items-center w-1/2">
            <View className="flex flex-row items-center justify-center pr-8 w-full">
              <Text
                className="text-white text-4xl flex justify-center items-center w-1/2"
                style={{ ...fonts.light, lineHeight: 60 }}
              >
                {dayTemperature}&deg;
              </Text>
              <View className="flex flex-col items-start pl-2 w-1/2">
                <Text className="text-white text-lg" style={fonts.light}>
                  Today
                </Text>
                <Text className="text-white text-sm" style={fonts.semiBold}>
                  {todayCondition}
                </Text>
              </View>
            </View>
            <View className="flex flex-row items-center justify-center pr-8 w-full mt-4">
              <Text
                className="text-white text-4xl flex justify-center items-center w-1/2"
                style={{ ...fonts.light, lineHeight: 60 }}
              >
                {nightTemperature}&deg;
              </Text>
              <View className="flex flex-col items-start pl-2 w-1/2">
                <Text className="text-white text-lg" style={fonts.light}>
                  Tonight
                </Text>
                <Text className="text-white text-sm" style={fonts.semiBold}>
                  {tonightCondition}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex flex-col items-start w-1/2">
            <View className="flex flex-row justify-between w-full">
              <Text
                className="text-white text-sm w-1/2 flex items-center"
                style={fonts.light}
              >
                Feels like
              </Text>
              <Text
                className="text-white text-sm w-1/2 pl-4"
                style={fonts.light}
              >
                {feelsLike}&deg;
              </Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-white text-sm w-1/2" style={fonts.light}>
                Humidity
              </Text>
              <Text
                className="text-white text-sm w-1/2 pl-4"
                style={fonts.light}
              >
                {humidity}%
              </Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-white text-sm w-1/2" style={fonts.light}>
                Visibility
              </Text>
              <Text
                className="text-white text-sm w-1/2 pl-4"
                style={fonts.light}
              >
                {visibility}
              </Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-white text-sm w-1/2" style={fonts.light}>
                Barometer
              </Text>
              <Text
                className="text-white text-sm w-1/2 pl-4"
                style={fonts.light}
              >
                {barometer} msl
              </Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-white text-sm w-1/2" style={fonts.light}>
                Wind
              </Text>
              <Text
                className="text-white text-sm w-1/2 pl-4"
                style={fonts.light}
              >
                {windSpeed} {windSpeedUnit}
              </Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-white text-sm w-1/2" style={fonts.light}>
                UV Index
              </Text>
              <Text
                className="text-white text-sm w-1/2 pl-4"
                style={fonts.light}
              >
                {uvIndex}
              </Text>
            </View>
          </View>
        </View>,
      ]}
    />
  );
};

const Simple = () => {
  return <PageContent items={[<Text>Simple</Text>]} />;
};

const Daily = ({ dailyData, temperatureUnit, convertTemperature, convertWindSpeed, getWindSpeedUnit, coloredTiles }) => {
  console.log('Daily component coloredTiles:', coloredTiles, 'typeof:', typeof coloredTiles);
  
  // Force re-render when coloredTiles changes
  useEffect(() => {
    console.log('Daily component coloredTiles changed to:', coloredTiles);
  }, [coloredTiles]);

  const getBackgroundColor = (weather) => {
    console.log('getBackgroundColor called with coloredTiles:', coloredTiles, 'weather:', weather);
    if (!coloredTiles) {
      console.log('Returning empty string - coloredTiles is false');
      return "";
    }
    console.log('Applying background color for weather:', weather);
    switch (weather) {
      case "Sunny":
        return "bg-yellow-400 bg-opacity-60";
      case "Rain":
        return "bg-blue-600 bg-opacity-60";
      case "Cloudy":
        return "bg-gray-500 bg-opacity-60";
      case "Windy":
        return "bg-orange-600 bg-opacity-60";
      default:
        return "bg-gray-600 bg-opacity-60";
    }
  };

  return (
    <PageContent
      items={[
        ...dailyData.map((day, index) => (
          <View
            key={index}
            className={`flex-row justify-between items-center py-4 px-4 mb-2 
               ${getBackgroundColor(day.weather)}
              `}
          >
            <View className="flex-1">
              <Text className="text-white text-lg" style={fonts.semiBold}>
                {day.day}
              </Text>
              <Text
                className="text-white text-sm opacity-80"
                style={fonts.regular}
              >
                {day.date}
              </Text>
            </View>
            
            <View className="flex-1 items-center">
              <Text className="text-white text-lg" style={fonts.regular}>
                {day.weather}
              </Text>
              <View className="flex flex-row items-center">
                <Droplet
                  color="white"
                  className="!w-2 !h-2 mr-1"
                  width={16}
                  height={16}
                />
                <Text className="text-white text-sm" style={fonts.regular}>
                  {day.rainChance}%
                </Text>
              </View>
            </View>
            
            <View className="flex-1 items-end">
              <Text className="text-white text-lg" style={fonts.semiBold}>
                {convertTemperature(day.temperature.max)}° / {convertTemperature(day.temperature.min)}°
              </Text>
              <Text
                className="text-white text-sm opacity-80"
                style={fonts.regular}
              >
                {convertWindSpeed(day.windSpeed)} {getWindSpeedUnit()}
              </Text>
            </View>
          </View>
        )),
      ]}
      itemStyle="mb-0"
    />
  );
};

const Hourly = ({ hourlyData, temperatureUnit, convertTemperature, convertWindSpeed, getWindSpeedUnit, coloredTiles }) => {
  console.log('Hourly component coloredTiles:', coloredTiles, 'typeof:', typeof coloredTiles);
  
  // Force re-render when coloredTiles changes
  useEffect(() => {
    console.log('Hourly component coloredTiles changed to:', coloredTiles);
  }, [coloredTiles]);

  const getBackgroundColor = (weather) => {
    console.log('getBackgroundColor called with coloredTiles:', coloredTiles, 'weather:', weather);
    if (!coloredTiles) {
      console.log('Returning empty string - coloredTiles is false');
      return "";
    }
    console.log('Applying background color for weather:', weather);
    switch (weather) {
      case "Sunny":
        return "bg-yellow-400 bg-opacity-60";
      case "Rain":
        return "bg-blue-600 bg-opacity-60";
      case "Cloudy":
        return "bg-gray-500 bg-opacity-60";
      case "Windy":
        return "bg-orange-600 bg-opacity-60";
      default:
        return "bg-gray-600 bg-opacity-60";
    }
  };

  return (
    <PageContent
      items={[
        ...hourlyData.map((hour, index) => (
          <View
            key={index}
            className={`flex-row justify-between items-center py-4 px-4 mb-2 
               ${getBackgroundColor(hour.weather)}
              `}
          >
            <View className="flex-1">
              <Text className="text-white text-lg" style={fonts.semiBold}>
                {hour.time}
              </Text>
            </View>
            
            <View className="flex-1 items-center">
              <Text className="text-white text-lg" style={fonts.regular}>
                {hour.weather}
              </Text>
              <View className="flex flex-row items-center">
                <Droplet
                  color="white"
                  className="!w-2 !h-2 mr-1"
                  width={16}
                  height={16}
                />
                <Text className="text-white text-sm" style={fonts.regular}>
                  {hour.rainChance}%
                </Text>
              </View>
            </View>
            
            <View className="flex-1 items-end">
              <Text className="text-white text-lg" style={fonts.semiBold}>
                {convertTemperature(hour.temperature)}°
              </Text>
              <Text
                className="text-white text-sm opacity-80"
                style={fonts.regular}
              >
                {convertWindSpeed(hour.windSpeed)} {getWindSpeedUnit()}
              </Text>
            </View>
          </View>
        )),
      ]}
      itemStyle="mb-0"
    />
  );
};

// const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export const MainView = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [getLocation, setGetLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [hasValidLocation, setHasValidLocation] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasPreviousLocation, setHasPreviousLocation] = useState(false);

  const [temperature, setTemperature] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState("");
  const [dayTemperature, setDayTemperature] = useState(0);
  const [todayCondition, setTodayCondition] = useState("");
  const [nightTemperature, setNightTemperature] = useState(0);
  const [tonightCondition, setTonightCondition] = useState("");
  const [humidity, setHumidity] = useState(0);
  const [feelsLike, setFeelsLike] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [barometer, setBarometer] = useState(0);
  const [visibility, setVisibility] = useState(0);
  const [uvIndex, setUvIndex] = useState(0);
  const [dailyWeather, setDailyWeather] = useState([]);
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [temperatureUnit, setTemperatureUnit] = useState('C'); // 'C' for Celsius, 'F' for Fahrenheit
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  const [coloredTiles, setColoredTiles] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  // Load saved location on app start
  useEffect(() => {
    loadSavedLocation();
    loadSavedTemperatureUnit();
    loadSavedColoredTiles();
  }, []);

  // Monitor coloredTiles changes
  useEffect(() => {
    console.log('MainView coloredTiles state changed to:', coloredTiles, 'typeof:', typeof coloredTiles);
    console.log('This should trigger PageView re-render with key:', `pageview-${coloredTiles}`);
  }, [coloredTiles]);

  // Load temperature unit from AsyncStorage
  const loadSavedTemperatureUnit = async () => {
    try {
      const savedUnit = await loadTemperatureUnit();
      setTemperatureUnit(savedUnit);
      setUnits(savedUnit === 'C' ? 'metric' : 'imperial');
    } catch (error) {
      console.log('Error loading saved temperature unit:', error);
    }
  };

  // Load colored tiles setting from AsyncStorage
  const loadSavedColoredTiles = async () => {
    try {
      const saved = await loadColoredTiles();
      console.log('Loaded colored tiles setting:', saved);
      setColoredTiles(saved);
    } catch (error) {
      console.log('Error loading colored tiles setting:', error);
    }
  };

  // Update colored tiles setting immediately
  const updateColoredTiles = (enabled) => {
    console.log('Updating colored tiles to:', enabled);
    setColoredTiles(enabled);
    setRenderKey(prev => prev + 1);
    saveColoredTiles(enabled);
  };

  // Test function to manually toggle colored tiles
  const testToggleColoredTiles = () => {
    console.log('Test toggle called, current coloredTiles:', coloredTiles);
    updateColoredTiles(!coloredTiles);
  };

  // Save temperature unit to AsyncStorage
  const saveTemperatureUnit = async (unit) => {
    try {
      await AsyncStorage.setItem('temperatureUnit', unit);
    } catch (error) {
      console.log('Error saving temperature unit:', error);
    }
  };

  // Toggle temperature units using utility function
  const toggleTemperatureUnit = createToggleTemperatureUnit(setTemperatureUnit, setUnits, setLoading);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      if (getLocation && !hasPreviousLocation) {
        // Close the app if location box is open and no previous location exists
        BackHandler.exitApp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [getLocation, hasPreviousLocation]);

  // Load location from AsyncStorage
  const loadSavedLocation = async () => {
    try {
      const savedLocation = await AsyncStorage.getItem("userLocation");
      if (savedLocation) {
        setLocation(savedLocation);
        setGetLocation(false);
        setHasPreviousLocation(true);
      } else {
        setGetLocation(true);
        setHasPreviousLocation(false);
      }
    } catch (error) {
      console.log("Error loading saved location:", error);
      setGetLocation(true);
      setHasPreviousLocation(false);
    } finally {
      setIsInitializing(false);
    }
  };

  // Save location to AsyncStorage
  const saveLocation = async (newLocation) => {
    try {
      await AsyncStorage.setItem("userLocation", newLocation);
      setHasPreviousLocation(true);
    } catch (error) {
      console.log("Error saving location:", error);
    }
  };

  // Convert temperature based on current unit
  const convertTemperature = (celsiusTemp) => {
    if (temperatureUnit === 'F') {
      return Math.round((celsiusTemp * 9/5) + 32);
    }
    return Math.round(celsiusTemp);
  };

  // Convert wind speed (km/h to mph or keep km/h)
  const convertWindSpeed = (kmh) => {
    if (units === 'imperial') {
      return Math.round(kmh * 0.621371); // Convert to mph
    }
    return Math.round(kmh);
  };

  // Convert visibility (km to miles or keep km)
  const convertVisibility = (km) => {
    if (units === 'imperial') {
      return `${Math.round(km * 0.621371)} mi`;
    }
    return `${Math.round(km)} km`;
  };

  // Get wind speed unit
  const getWindSpeedUnit = () => {
    return units === 'imperial' ? 'mph' : 'kmh';
  };

  // Track when image loading starts
  const handleImageLoadStart = () => {
    // Only track image loading if we have a weather condition
    if (weatherCondition) {
      setImageLoading(true);
    }
  };

  // Track when image loading completes
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Handle location setting with error handling
  const handleSetLocation = (newLocation) => {
    setLocationError(""); // Clear any previous errors
    setLocation(newLocation);
    setGetLocation(false); // Close the location box
    // Only set hasPreviousLocation to true if we don't already have a saved location
    if (!hasPreviousLocation) {
      setHasPreviousLocation(true);
    }
    // Do not save here; only save after successful fetch
  };

  // Handle location box close
  const handleCloseLocationBox = () => {
    setGetLocation(false);
    setLocationError(""); // Clear error when closing
    
    // Only close the app if no location has been set and no previous location exists
    // AND we're not in the middle of setting a location
    if (!location && !hasPreviousLocation && !getLocation) {
      BackHandler.exitApp();
    }
  };

  useEffect(() => {
    if (location == "") {
      if (!isInitializing) {
        setGetLocation(true);
      }
      setHasValidLocation(false);
      setLoading(false); // Don't show loading when no location
      return;
    }
    setLoading(true);
    setImageLoading(false); // Reset image loading state when location changes
    getWeather(location)
      .then((data) => {
        setTemperature(Math.round(data.current.temperature.celsius));
        setWeatherCondition(getWeatherCondition(data));
        let todayConditionData = getTodayCondition(data);
        setDayTemperature(
          Math.round(todayConditionData.maxTemperature.celsius)
        );
        setTodayCondition(todayConditionData.condition);
        let tonightConditionData = getTonightCondition(data);
        setNightTemperature(
          Math.round(tonightConditionData.temperature.celsius)
        );
        setTonightCondition(tonightConditionData.condition);
        setHumidity(data.current.humidity);
        setFeelsLike(Math.round(getFeelsLikeTemperature(data).celsius));
        setWindSpeed(data.current.wind.speed);
        setBarometer(data.current.barometer);
        setVisibility(data.current.visibility);
        setUvIndex(data.current.uvIndex);
        setDailyWeather(getDailyWeather(data));
        setHourlyWeather(getHourlyWeather(data));
        setLoading(false); // Stop loading on success
        setHasValidLocation(true); // Mark as having valid location
        // Only save location if it is valid and different from previous
        AsyncStorage.getItem("userLocation").then((storedLocation) => {
          if (storedLocation !== location) {
            saveLocation(location);
          }
        });
      })
      .catch((error) => {
        console.log("weather error :", error);
        // Check if it's a location not found error
        if (
          error.message.includes("not found") ||
          error.message.includes("Location")
        ) {
          setLocationError("Invalid location");
          setGetLocation(true); // Reopen location box to show error
          setLoading(false); // Stop loading when showing error
          setHasValidLocation(false); // Mark as invalid location
        } else {
          setLoading(false); // Stop loading for other errors
          setHasValidLocation(false); // Mark as invalid location
        }
      });
  }, [location, isInitializing]);

  // Show loading only when actively fetching weather data
  const shouldShowLoading = loading;

  // Only show weather content if we have a valid location and location box is not open
  const shouldShowWeather = hasValidLocation && !getLocation && !loading;

  // Don't render anything while initializing
  if (isInitializing) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
          <Loader text="Loading" />
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
        <View className="w-full h-full flex flex-col">
          {getLocation && (
            <LocationBox
              setLocation={handleSetLocation}
              closePopup={handleCloseLocationBox}
              error={locationError}
            />
          )}
          {shouldShowLoading ? (
            <Loader text="Loading" />
          ) : shouldShowWeather ? (
            <PageView
              key={`pageview-${coloredTiles}`}
              pages={[
                {
                  id: "#1",
                  title: "today",
                  content: () => (
                    <Page
                      temperature={convertTemperature(temperature)}
                      weatherCondition={weatherCondition}
                      dayTemperature={convertTemperature(dayTemperature)}
                      todayCondition={todayCondition}
                      nightTemperature={convertTemperature(nightTemperature)}
                      tonightCondition={tonightCondition}
                      humidity={humidity}
                      feelsLike={convertTemperature(feelsLike)}
                      windSpeed={convertWindSpeed(windSpeed)}
                      windSpeedUnit={getWindSpeedUnit()}
                      barometer={barometer}
                      visibility={convertVisibility(visibility)}
                      uvIndex={uvIndex}
                      temperatureUnit={temperatureUnit}
                    />
                  ),
                },
                {
                  id: "#2",
                  title: "daily",
                  content: () => <Daily key={`daily-${coloredTiles}-${renderKey}`} dailyData={dailyWeather} temperatureUnit={temperatureUnit} convertTemperature={convertTemperature} convertWindSpeed={convertWindSpeed} getWindSpeedUnit={getWindSpeedUnit} coloredTiles={coloredTiles} />,
                },
                { id: "#3", title: "hourly", content: () => <Hourly key={`hourly-${coloredTiles}-${renderKey}`} hourlyData={hourlyWeather} temperatureUnit={temperatureUnit} convertTemperature={convertTemperature} convertWindSpeed={convertWindSpeed} getWindSpeedUnit={getWindSpeedUnit} coloredTiles={coloredTiles} /> },
              ]}
              menu={{
                menuType: "simple",
                list: [
                  {
                    icon: <Globe stroke="white" />,
                    onPress: () => setGetLocation(true),
                    text: "location",
                  },
                  {
                    icon: <Settings stroke="white" />,
                    onPress: () => navigation.navigate('Settings', {
                      temperatureUnit,
                      toggleTemperatureUnit,
                      location,
                      onLocationPress: () => setGetLocation(true),
                      coloredTiles,
                      updateColoredTiles
                    }),
                    text: "settings",
                  },
                ],
              }}
              mainTitle={location || "Sheffield"}
              weatherCondition={weatherCondition}
              onImageLoad={handleImageLoad}
              onImageLoadStart={handleImageLoadStart}
            />
          ) : (
            // Show nothing when no valid location and not loading
            <View className="w-full h-full bg-black" />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};
