import { StatusBar, View } from "react-native";
import * as Font from "expo-font";
import * as SystemUI from "expo-system-ui";
import { MainView } from "./components/MainView";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        NotoSans_Light: require("./assets/fonts/NotoSans_Light.ttf"),
        NotoSans_Regular: require("./assets/fonts/NotoSans_Regular.ttf"),
        NotoSans_SemiBold: require("./assets/fonts/NotoSans_SemiBold.ttf"),
        Selawk: require("./assets/fonts/selawk.ttf"),
        SelawkLight: require("./assets/fonts/selawkl.ttf"),
        SelawkSemiBold: require("./assets/fonts/selawksb.ttf"),
      });
      setFontLoaded(true);
    }
    
    // Set system UI colors
    SystemUI.setBackgroundColorAsync('#000000');
    
    loadFont();
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: '#000000',
          background: '#000000',
          card: '#000000',
          text: '#ffffff',
          border: '#000000',
          notification: '#000000',
        },
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
          animation: 'none',
        }}
      >
        <Stack.Screen 
          name="MainView" 
          component={MainView}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              color: '#ffffff',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
