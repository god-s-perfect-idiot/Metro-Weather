import { Text, TextInput, View } from "react-native";
import { fonts } from "../../../styles/fonts";
import { useState } from "react";

export const TextBox = ({
  defaultValue,
  value,
  onChangeText,
  onSubmitText,
  classOverrides = "",
  title = "",
  placeholder = "Enter URL",
}) => {
  const [focused, setFocused] = useState(false);
  // if (title == "") {
  //     return (
  //         <TextInput
  //             className={`${focused ? "bg-white" : "bg-[#bfbfbf]"}  w-full h-10 px-4 text-base`}
  //             style={fonts.regular}
  //             cursorColor={"black"}
  //             selectionColor={"#a013ec"}
  //             placeholder={placeholder}
  //             defaultValue={defaultValue}
  //             onChangeText={onChangeText}
  //             onSubmitEditing={onSubmitText}
  //             onFocus={() => setFocused(true)}
  //             onBlur={() => setFocused(false)}
  //         />
  //     )
  // } else {
  return (
    <View className={`flex w-full ${classOverrides}`}>
      {title && (
        <Text className="text-[#b0b0b0] text-md mb-1" style={fonts.light}>
          {title}
        </Text>
      )}
      <TextInput
        className={`${
          focused
            ? "bg-white border-2 border-solid border-[#b20000]"
            : "bg-[#bfbfbf]"
        } flex items-center w-full h-12 px-2 text-base text-black placeholder:text-black`}
        style={fonts.regular}
        cursorColor={"black"}
        selectionColor={"#a013ec"}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChangeText={(e) => onChangeText(e)}
        onSubmitEditing={(e) => onSubmitText(e.nativeEvent.text)}
      />
    </View>
  );
  // }
};
