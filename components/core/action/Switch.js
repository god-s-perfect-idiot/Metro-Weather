import { Text, TouchableWithoutFeedback, View } from "react-native";
import { fonts } from "../../../styles/fonts";
import { useState, useEffect } from "react";

export const Switch = ({
  defaultChecked = false,
  checked,
  onChange,
  title,
  description = "",
}) => {
  const [value, setValue] = useState(checked !== undefined ? checked : defaultChecked);

  // Update value when checked prop changes
  useEffect(() => {
    if (checked !== undefined) {
      setValue(checked);
    }
  }, [checked]);

  const handleToggle = (newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <View className="flex flex-col items-center justify-between w-full">
      <Text className="flex w-full text-[#c9c9c9] text-sm" style={fonts.light}>
        {title}
      </Text>
      <View className="flex flex-row w-full justify-between text-center">
        <Text
          className="flex flex-col text-white text-2xl"
          style={fonts.light}
        >
          {value ? "On" : "Off"}
        </Text>
        {value ? (
          <TouchableWithoutFeedback
            onPress={() => {
              handleToggle(false);
            }}
          >
            <View className="flex flex-row w-20 justify-end items-center">
              <View className="border-[3px] w-20 h-8 bg-[#fff] border-r-black items-center justify-center">
                <View className="border-black border-[3px] border-solid bg-[#a0b] w-[95%] h-[85%]" />
              </View>
              <View className="bg-white w-6 h-10 border-[4px] border-solid border-black z-10 absolute right-0" />
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              handleToggle(true);
            }}
          >
            <View className="flex flex-row w-20 justify-end items-center">
              <View className="border-[3px] w-20 h-8 bg-[#fff] border-l-black items-center justify-center">
                <View className="border-black border-[3px] border-solid bg-[#000] w-[95%] h-[85%]" />
              </View>
              <View className="bg-white w-6 h-10 border-[4px] border-solid border-black z-10 absolute left-0" />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
      {description && <Text
        className="flex w-full text-[#c9c9c9] mt-4 text-sm"
        style={fonts.light}
      >
        {description}
      </Text>}
    </View>
  );
};
