import AsyncStorage from "@react-native-async-storage/async-storage";

// Save temperature unit to AsyncStorage
export const saveTemperatureUnit = async (unit) => {
  try {
    await AsyncStorage.setItem('temperatureUnit', unit);
  } catch (error) {
    console.log('Error saving temperature unit:', error);
  }
};

// Load temperature unit from AsyncStorage
export const loadTemperatureUnit = async () => {
  try {
    const savedUnit = await AsyncStorage.getItem('temperatureUnit');
    return savedUnit || 'C';
  } catch (error) {
    console.log('Error loading saved temperature unit:', error);
    return 'C';
  }
};

// Save colored tiles setting to AsyncStorage
export const saveColoredTiles = async (enabled) => {
  try {
    await AsyncStorage.setItem('coloredTiles', JSON.stringify(enabled));
  } catch (error) {
    console.log('Error saving colored tiles setting:', error);
  }
};

// Load colored tiles setting from AsyncStorage
export const loadColoredTiles = async () => {
  try {
    const saved = await AsyncStorage.getItem('coloredTiles');
    return saved ? JSON.parse(saved) : false;
  } catch (error) {
    console.log('Error loading colored tiles setting:', error);
    return false;
  }
};

// Toggle temperature unit function
export const createToggleTemperatureUnit = (setTemperatureUnit, setUnits, setLoading) => {
  return () => {
    setTemperatureUnit(prevUnit => {
      const newUnit = prevUnit === 'C' ? 'F' : 'C';
      const newUnits = newUnit === 'C' ? 'metric' : 'imperial';
      
      setUnits(newUnits);
      saveTemperatureUnit(newUnit);
      
      // Show loading screen briefly when switching units
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      
      return newUnit;
    });
  };
}; 