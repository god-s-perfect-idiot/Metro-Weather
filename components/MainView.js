import { View, Text, StatusBar } from "react-native";
import { MainTitle } from "./core/decorator/MainTitle";
import { Check, X, MapPin, Search } from "react-native-feather";
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
import getTodayCondition, { getTonightCondition, getWeatherCondition } from "./core/helper/data-utils";

const Page = ({ setLoading = () => {} }) => {
  // const [weather, setWeather] = useState(null);
  const [temperatute, setTemperatute] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState("");
  const [dayTemperature, setDayTemperature] = useState(0);
  const [todayCondition, setTodayCondition] = useState("");
  const [nightTemperature, setNightTemperature] = useState(0);
  const [tonightCondition, setTonightCondition] = useState("");
  const [humidity, setHumidity] = useState(0);

  useEffect(() => {
    getWeather("Sheffield").then((data) => {
      setTemperatute(Math.round(data.current.temperature.celsius));
      setWeatherCondition(getWeatherCondition(data));
      let todayConditionData = getTodayCondition(data);
      setDayTemperature(Math.round(todayConditionData.maxTemperature.celsius));
      setTodayCondition(todayConditionData.condition);
      let tonightConditionData = getTonightCondition(data);
      setNightTemperature(Math.round(tonightConditionData.temperature.celsius))
      setTonightCondition(tonightConditionData.condition);
      setHumidity(data.current.humidity)
      console.log("weather data :", data);
      setLoading(false);
    }).catch((error) => {
      console.log("weather error :", error);
      setLoading(false);
    });
  }, []);

  return (
    <PageContent
      items={[
        <View>
          <View className="flex flex-row items-center mt-48">
            <Text
              className="text-white text-[150px] leading-tight"
              style={{ ...fonts.light, letterSpacing: -10, lineHeight: 160 }}
            >
              {temperatute}
            </Text>
            <Text
              className="text-white text-[50px] mb-[100px]"
              style={fonts.light}
            >
              &deg;C
            </Text>
          </View>
          <Text className="text-white text-xl mb-4" style={fonts.regular}>
            {weatherCondition}
          </Text>
          <View className="flex flex-row border-b-[0.5px] border-white w-full" />
          <View className="flex flex-row items-center mt-4 justify-between w-full">
            <View className="flex flex-col items-center w-1/2">
              <View className="flex flex-row items-center justify-center pr-8 w-full">
                <Text
                  className="text-white text-5xl flex justify-center items-center w-1/2"
                  style={{ ...fonts.light, lineHeight: 60 }}
                >
                  {dayTemperature}&deg;
                </Text>
                <View className="flex flex-col items-start pl-2 w-1/2">
                  <Text className="text-white text-lg" style={fonts.light}>
                    Today
                  </Text>
                  <Text className="text-white text-base" style={fonts.regular}>
                    {todayCondition}
                  </Text>
                </View>
              </View>
              <View className="flex flex-row items-center justify-center pr-8 w-full mt-4">
                <Text
                  className="text-white text-5xl flex justify-center items-center w-1/2"
                  style={{ ...fonts.light, lineHeight: 60 }}
                >
                  {nightTemperature}&deg;
                </Text>
                <View className="flex flex-col items-start pl-2 w-1/2">
                  <Text className="text-white text-lg" style={fonts.light}>
                    Tonight
                  </Text>
                  <Text className="text-white text-base" style={fonts.regular}>
                    {tonightCondition}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex flex-col items-start w-1/2">
              <View className="flex flex-row justify-between w-full">
                <Text
                  className="text-white text-base w-1/2 flex items-center"
                  style={fonts.light}
                >
                  Feels like
                </Text>
                <Text
                  className="text-white text-base w-1/2 pl-4"
                  style={fonts.light}
                >
                  15
                </Text>
              </View>
              <View className="flex flex-row justify-between w-full">
                <Text
                  className="text-white text-base w-1/2"
                  style={fonts.light}
                >
                  Humidity
                </Text>
                <Text
                  className="text-white text-base w-1/2 pl-4"
                  style={fonts.light}
                >
                  {humidity}%
                </Text>
              </View>
              <View className="flex flex-row justify-between w-full">
                <Text
                  className="text-white text-base w-1/2"
                  style={fonts.light}
                >
                  Visibility
                </Text>
                <Text
                  className="text-white text-base w-1/2 pl-4"
                  style={fonts.light}
                >
                  100%
                </Text>
              </View>
              <View className="flex flex-row justify-between w-full">
                <Text
                  className="text-white text-base w-1/2"
                  style={fonts.light}
                >
                  Barometer
                </Text>
                <Text
                  className="text-white text-base w-1/2 pl-4"
                  style={fonts.light}
                >
                  100%
                </Text>
              </View>
              <View className="flex flex-row justify-between w-full">
                <Text
                  className="text-white text-base w-1/2"
                  style={fonts.light}
                >
                  Wind
                </Text>
                <Text
                  className="text-white text-base w-1/2 pl-4"
                  style={fonts.light}
                >
                  100%
                </Text>
              </View>
              <View className="flex flex-row justify-between w-full">
                <Text
                  className="text-white text-base w-1/2"
                  style={fonts.light}
                >
                  UV Index
                </Text>
                <Text
                  className="text-white text-base w-1/2 pl-4"
                  style={fonts.light}
                >
                  100%
                </Text>
              </View>
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

// const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export const MainView = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View className="w-full h-full flex flex-col">
      {/* {loading ? (
        <Loader text="Loading" />
      ) : ( */}
        <PageView
          pages={[
            { title: "today", content: <Page setLoading={setLoading} /> },
            { title: "daily", content: <Simple /> },
            { title: "hourly", content: <Simple /> },
            { title: "maps", content: <Simple /> },
          ]}
          menu={{
            menuType: "simple",
            list: [
              // {
              //   icon: <Check stroke="white" />,
              //   onPress: () => {},
              //   text: "Ok",
              // },
              {
                icon: <Search stroke="white" />,
                onPress: () => {},
                text: "Close",
              },
            ],
          }}
          mainTitle={"Sheffield, England"}
        />
      {/* )}  */}
    </View>
  );
};
