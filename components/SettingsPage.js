import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Button } from "./core/action/Button";
import { fonts } from "../styles/fonts";
import { MainTitle } from './core/decorator/MainTitle';
import { PageTitle } from './core/decorator/Pagetitle';
import { Select } from './core/action/Select';
import { Switch } from './core/action/Switch';

const SettingsPage = ({ 
  temperatureUnit, 
  toggleTemperatureUnit,
  location,
  onLocationPress,
  navigation,
  route
}) => {
  // Get parameters from route if not passed as props
  const params = route?.params || {};
  const currentTemperatureUnit = temperatureUnit || params.temperatureUnit || 'C';
  const currentToggleFunction = toggleTemperatureUnit || params.toggleTemperatureUnit;
  const currentLocation = location || params.location;
  const currentOnLocationPress = onLocationPress || params.onLocationPress;
  const currentColoredTiles = params.coloredTiles || false;
  const currentUpdateColoredTiles = params.updateColoredTiles;

  const handleTemperatureUnitChange = (selectedOption) => {
    // Only toggle if the selection is different from current and function exists
    if (currentToggleFunction && typeof currentToggleFunction === 'function') {
      const newUnit = selectedOption.value; // Get the value from the selected option object
      if (newUnit !== currentTemperatureUnit) {
        currentToggleFunction();
      }
    }
  };

  const handleColoredTilesChange = (enabled) => {
    console.log('Colored tiles changed to:', enabled);
    if (currentUpdateColoredTiles && typeof currentUpdateColoredTiles === 'function') {
      currentUpdateColoredTiles(enabled);
      console.log('Colored tiles state updated and saved');
    } else {
      console.log('Missing updateColoredTiles function');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }} className="p-4">
        <View className="flex-1 bg-black">
          <View className="flex flex-col items-start justify">
            <MainTitle title="metro weather" />
            <PageTitle title="preferences" classOverride="mt-4"/>
          </View>
          
          <ScrollView className="flex-1">
            <View className="mt-6">
              <Text className="text-[#a0b] text-xl mb-2" style={fonts.light}>
                units + accessibility
              </Text>
              <View className="rounded-lg mt-4">
                <View className="flex flex-row items-center justify-between">
                  <View className="flex flex-col">
                    <Select 
                      options={[
                        { name: 'Metric', value: 'C' },
                        { name: 'Imperial', value: 'F' }
                      ]}
                      onChange={handleTemperatureUnitChange}
                      title="weather unit"
                      initialValue={currentTemperatureUnit === 'C' ? { name: 'Metric', value: 'C' } : { name: 'Imperial', value: 'F' }}
                    />
                  </View>
                </View>
              </View>
              <View className="mt-8">
                <Switch
                  title="show colored tiles"
                  checked={currentColoredTiles}
                  onChange={handleColoredTilesChange}
                  description="show colored tiles based on weather conditions for accessibility"
                />
              </View>
            </View>


            <View className="mt-12">
              <Text className="text-[#a0b] text-xl mb-2" style={fonts.light}>
                about
              </Text>
              <View className="flex flex-col">
                <Text className="text-gray-400 text-sm" style={fonts.light}>
                  Metro Weather v0.2
                </Text>
                <Text className="text-gray-400 text-sm mt-2" style={fonts.light}>
                  Weather data provided by OpenWeatherMap and Open-Meteo
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SettingsPage; 