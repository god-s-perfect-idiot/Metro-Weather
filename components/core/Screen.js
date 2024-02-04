import { ScrollView, View } from "react-native"
import { PageTitle } from "./Pagetitle"
import { useState } from "react"

// Pages :: [Page] -> { title, content }
export const Screen = ({ pages }) => {

    const [currentPage, setCurrentPage] = useState(0)

    return (
        // <ScrollView horizontal pagingEnabled>
            <View className="flex-1 flex-row  w-full h-full">

                {pages.map((page, index) => {
                    return (
                        <View className="flex flex-col mr-4" key={index}>
                            <PageTitle title={page.title} enabled={index == currentPage}/>
                        </View>
                    )
                })}
            </View>
        // </ScrollView>
    )
}