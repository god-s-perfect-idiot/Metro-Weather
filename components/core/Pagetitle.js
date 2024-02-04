import { Text } from "react-native"
import { fonts } from "../../styles/fonts"

export const PageTitle = ({title, isUpperCase=false, enabled=true}) => {
    return (
        <Text className={`text-white text-4xl mt-2 ${isUpperCase ? "" : "lowercase"} ${enabled ? "opacity-100" : "opacity-50"}`} style={fonts.regular}>
            {title} 
        </Text>
    )
}     