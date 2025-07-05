import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Pivot } from "../../animations/Pivot";
import { fonts } from "../../styles/fonts";
import { TextBox } from "../core/action/TextBox";
import { Button } from "../core/action/Button";
import { useEffect, useState, useRef } from "react";
import * as Animatable from "react-native-animatable";

const AnimatedView = Animatable.createAnimatableComponent(View);

// Popular locations list
const POPULAR_LOCATIONS = [
  "London",
  "New York",
  "Tokyo",
  "Paris",
  "Sydney",
  "Toronto",
  "Berlin",
  "Mumbai",
  "São Paulo",
  "Cairo",
  "Moscow",
  "Seoul",
  "Mexico City",
  "Bangkok",
  "Istanbul",
  "Lagos",
  "Jakarta",
  "Kinshasa",
  "Lima",
  "Madrid"
];

// Debounce function to limit API calls
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function LocationBox({ setLocation, closePopup, error = "" }) {
  const [locationText, setLocationText] = useState("");
  const [showError, setShowError] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const animatedViewRef = useRef(null);

  // Clear location text when error is shown
  useEffect(() => {
    if (error) {
      setLocationText("");
      setShowError(true);
      
      // Start slide out animation after 1.5 seconds
      const timer = setTimeout(() => {
        if (animatedViewRef.current) {
          animatedViewRef.current.slideOutLeft(500).then(() => {
            setShowError(false);
          });
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [error]);

  // Search for locations using geocoding API
  const searchLocations = async (query) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=d68fce741610928e4fcbbf3859036f96`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const locationSuggestions = data.map(result => ({
            name: result.name,
            country: result.country,
            admin1: result.state, // State/Province
            fullName: `${result.name}${result.state ? `, ${result.state}` : ''}, ${result.country}`
          }));
          setSuggestions(locationSuggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.log('Search error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useRef(debounce(searchLocations, 300)).current;

  // Generate suggestions based on input
  useEffect(() => {
    if (locationText.trim().length > 0) {
      // First check popular locations for quick matches
      const popularMatches = POPULAR_LOCATIONS.filter(location =>
        location.toLowerCase().includes(locationText.toLowerCase())
      );
      
      if (popularMatches.length > 0 && locationText.length < 3) {
        setSuggestions(popularMatches.map(name => ({ name, fullName: name })));
        setShowSuggestions(true);
      } else {
        // Use geocoding API for comprehensive search
        debouncedSearch(locationText);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [locationText, debouncedSearch]);

  const handleLocationSelect = (selectedLocation) => {
    const locationName = typeof selectedLocation === 'string' ? selectedLocation : selectedLocation.fullName;
    setLocationText(locationName);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (locationText.trim()) {
      setLocation(locationText.trim());
      closePopup();
    }
  };

  return (
    <Pivot
      index={0}
      classOverride={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
        width: "100%",
      }}
    >
      <View className="w-full flex flex-col bg-black">
        {error && showError && (
          <AnimatedView 
            ref={animatedViewRef}
            animation="slideInRight"
            duration={500}
            className="bg-red-600 px-3 py-4 z-[100] absolute top-0 left-0 w-full"
          >
            <Text className="text-white text-base" style={fonts.regular}>
              {error}
            </Text>
          </AnimatedView>
        )}
        <View className="z-10 w-full bg-[#222222] z-10 px-4 py-4">
          <Text className="text-white text-xl my-4" style={fonts.semiBold}>
            Enter your location
          </Text>

          <TextBox
            placeholder="search for location"
            onSubmitText={setLocationText}
            onChangeText={setLocationText}
            value={locationText}
          />

          <View className="flex flex-row justify-between mt-4">
            <Button
              classOverride="w-[48%]"
              text="save"
              onPress={handleSave}
            />
            <Button
              classOverride="w-[48%]"
              text="cancel"
              onPress={() => {
                closePopup();
              }}
            />
          </View>
        </View>

        {showSuggestions && suggestions.length > 0 && (
          <View className="mt-4 px-4">
            <Text className="text-[#a0b] text-xl mb-3" style={fonts.light}>
              {isSearching ? "searching..." : "suggestions"}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} className="max-h-full">
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleLocationSelect(suggestion)}
                  className="py-1"
                >
                  <Text className="text-white text-xl mb-1" style={fonts.regular}>
                    {typeof suggestion === 'string' ? suggestion : suggestion.fullName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {!showSuggestions && (
          <View className="mt-4 px-4 flex flex-col h-full">
            <Text className="text-[#a0b] text-xl mb-3" style={fonts.light}>
              popular locations
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} className="h-full">
              <View className="flex-col flex">
                {POPULAR_LOCATIONS.map((location, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleLocationSelect(location)}
                    className="py-1 rounded-full mr-2 mb-1"
                  >
                    <Text className="text-white text-xl" style={fonts.regular}>
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </Pivot>
  );
}
