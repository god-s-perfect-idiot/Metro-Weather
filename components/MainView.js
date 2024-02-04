import { Text, View } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import { useEffect, useState } from "react";
import { Screen } from "./core/Screen";

export const MainView = () => {

    const [location, setLocation] = useState(null);

    useEffect(() => {
        setLocation("Sheffield, South Yorkshire")
    }, [])

    return (
        <View className="flex-1 bg-[#2868C7] w-full h-full py-4 pl-4">
            <AppTitle title={location} />
            <Screen pages={[
                {
                    title: "today",
                    content: <Text className="text-white text-5xl mt-5 lowercase">Sunny</Text>
                },
                {
                    title: "daily",
                    content: <Text className="text-white text-5xl mt-5">20°C</Text>
                },
                {
                    title: "hourly",
                    content: <Text className="text-white text-5xl mt-5">20°C</Text>
                },
                {
                    title: "maps",
                    content: <Text className="text-white text-5xl mt-5">20°C</Text>
                }
            ]} />   
        </View>
    );
}
