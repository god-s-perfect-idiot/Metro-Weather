import { Text, View } from "react-native";
import { Pivot } from "../../animations/Pivot";
import { fonts } from "../../styles/fonts";
import { TextBox } from "../core/action/TextBox";
import { Button } from "../core/action/Button";
import { useEffect, useState } from "react";

export default function LocationBox({setLocation, closePopup}) {
  const [locationText, setLocationText] = useState("");
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
        <View className="z-10 w-full bg-[#222222] z-10 px-4 py-4">
          <Text className="text-white text-xl my-4" style={fonts.semiBold}>
            Enter your location
          </Text>
          <TextBox placeholder="search for location" onSubmitText={setLocationText} onChangeText={setLocationText}/>
          <View className="flex flex-row justify-between mt-4">
            <Button
              classOverride="w-[48%]"
              text="save"
              onPress={() => {
                setLocation(locationText);
                closePopup();
              }}
            />
            <Button classOverride="w-[48%]" text="cancel" onPress={() => {
                closePopup();
            }} />
          </View>
        </View>
      </View>
    </Pivot>
  );
}
