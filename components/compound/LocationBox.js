import { Text, View } from "react-native";
import { Pivot } from "../../animations/Pivot";
import { fonts } from "../../styles/fonts";
import { TextBox } from "../core/action/TextBox";
import { Button } from "../core/action/Button";
import { useEffect, useState, useRef } from "react";
import * as Animatable from "react-native-animatable";

const AnimatedView = Animatable.createAnimatableComponent(View);

export default function LocationBox({ setLocation, closePopup, error = "" }) {
  const [locationText, setLocationText] = useState("");
  const [showError, setShowError] = useState(false);
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
              onPress={() => {
                if (locationText.trim()) {
                  setLocation(locationText.trim());
                  closePopup();
                }
              }}
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
      </View>
    </Pivot>
  );
}
