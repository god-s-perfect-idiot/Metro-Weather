import { View } from "react-native";
import { Pivot } from "../../animations/Pivot";

export const PageContent = ({ items, itemStyle= "mb-8" }) => {
  return (
    <View className="w-full h-full flex flex-col">
      {items.map((item, index) => {
        return (
          <View className={itemStyle} key={index}>
            <Pivot index={index}>{item}</Pivot>
          </View>
        );
      })}
    </View>
  );
};
