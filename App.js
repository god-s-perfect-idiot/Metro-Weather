import { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import * as Font from 'expo-font';
import { MainView } from './components/MainView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    
    async function loadFont() {
      await Font.loadAsync({
        'NotoSans_Light': require('./assets/fonts/NotoSans_Light.ttf'),
        'NotoSans_Regular': require('./assets/fonts/NotoSans_Regular.ttf'),
      });
      setFontLoaded(true);
    }

    loadFont();
  }, [])

  if (!fontLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar />
      <Stack.Navigator screenOptions={
        {
          headerShown: false
        }
      }>
        <Stack.Screen name="MainView" component={MainView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
