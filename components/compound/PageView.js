import {
  SafeAreaView,
  ScrollView,
  Touchable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MainTitle } from "../core/decorator/MainTitle";
import { PageTitle } from "../core/decorator/Pagetitle";
import { IconList, MenuBar, QuickMenu } from "../core/action/MenuBar";
import RoundedButton from "../core/action/RoundedButton";
import { useEffect, useRef, useState } from "react";

const renderMenu = (menu) => {
  switch (menu.menuType) {
    case "simple":
      return <QuickMenu options={menu.list} />;
    case "icon-list":
    // fix this
    case "custom-list":
    // fix this
    case "none":
    default:
      return <View></View>;
  }
};

export const PageView = ({ pages, menu, mainTitle }) => {
  // const [referencePages, setReferencePages] = useState(pages);
  // let referencePages = pages;
  // deep copy pages into referencePages including state propagation for rendering
  const [referencePages, setReferencePages] = useState([...pages]);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  // const [currentPage, setCurrentPage] = useState(pages);
  const scrollViewRef = useRef(null);

  // When pages or mainTitle changes, update the state copy:
  useEffect(() => {
    // splice pages into referencePages from currentSourceIndex
    setReferencePages(
      pages.map(page => ({
        ...page,
      }))
    );
    changePage(currentSourceIndex);
  }, [pages, mainTitle]);

  useEffect(() => {
    console.log(currentSourceIndex)
  }, [currentSourceIndex]);

  const scrollHeader = () => {
    scrollViewRef.current?.scrollTo({
      y: pages[(currentPage - 1) >= 0 ? currentPage - 1 : 0].title.length * 32 * currentPage,
      animated: true,
    });
  }

  const changeRight = () => {
    changePage(pages.length - 1);
    setCurrentSourceIndex((currentSourceIndex - 1) >= 0 ? currentSourceIndex - 1 : pages.length - 1);
  }

  const changeLeft = () => {
    changePage(1);
    setCurrentSourceIndex((currentSourceIndex + 1) % pages.length);
  }

  const arrangePages = (index) => {
    const newPages = referencePages.slice(index);
    const oldPages = referencePages.slice(0, index);
    setReferencePages(newPages.concat(oldPages));
    // referencePages = newPages.concat(oldPages);
  };

  const changePage = (index) => {
    // setCurrentPage(index);
    arrangePages(index);
    const realIndex = pages.findIndex(page => page.id === referencePages[index].id);
    setCurrentSourceIndex(realIndex);
  };

  return (
    <View className="w-full h-full flex items-start justify-start bg-black">
      <View className="w-full h-full px-4 pt-4">
        {mainTitle && (
          <View className="mb-4">
            <MainTitle title={mainTitle} />
          </View>
        )}
        {/* Change height if you change any font size */}
        <SafeAreaView className="w-full h-[3rem] flex items-start justify-start pr-50">
          <ScrollView
            className="mb-4 flex w-full"
            horizontal={true}
            scrollEnabled={true}
            // ref={scrollViewRef}
          >
            {referencePages.map((page, index) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  changePage(index);
                }}
                key={index}
              >
                <View>
                  <PageTitle
                    title={page.title}
                    classOverride="mr-5"
                    isActive={index === 0}
                  />
                </View>
              </TouchableWithoutFeedback>
            ))}
            <View className="w-screen" />
          </ScrollView>
        </SafeAreaView>
        <View
          onTouchStart={(e) => (this.touchX = e.nativeEvent.pageX)}
          onTouchEnd={(e) => {
            if (this.touchX - e.nativeEvent.pageX > 20)
              changeLeft();
            else if(this.touchX - e.nativeEvent.pageX < -20)
              changeRight();
          }} 
          ref={scrollViewRef}
        >
          {referencePages[0].content()}
        </View>
      </View>
      {menu && renderMenu(menu)}
    </View>
  );
};
