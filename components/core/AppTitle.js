import { Text } from "react-native"
import { fonts } from "../../styles/fonts"

export const AppTitle = ({title}) => {
    return (
        <Text className="text-white text-base uppercase font-bold" style={fonts.regular}>
            {title}
        </Text>
    )
}