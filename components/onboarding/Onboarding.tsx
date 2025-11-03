import { Link } from "expo-router";
import React, { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { SafeAreaView } from "react-native-safe-area-context";

const slides = [
  {
    key: "one",
    title: "Welcome to FarmHub",
    text: "Connecting farmers and byers for a seamless Agricultural trade",
    image: require("../../assets/images/onboarding-welcome.jpg"),
  },
  {
    key: "two",
    title: "Trade Smarter, Not Harder",
    text: "List your products or find what you need. All in one app made just for you",
    image: require("../../assets/images/onboarding-trade.jpg"),
  },
  {
    key: "three",
    title: "Join a Growing Community",
    text: "Thousands of farmers and buyers trade safely every day on FarmHub.",
    image: require("../../assets/images/onboarding-community.jpg"),
  },
];

export default function OnboardingScreen() {
  const sliderRef = useRef<AppIntroSlider>(null);

  const renderItem = ({ item }: any) => {
    return (
      <View className="flex-1 *:font-medium items-center">
        <Image source={item.image} className="w-full h-96 object-contain" />
        <Text className="font-poppins-semibold text-xl mt-7 w-full text-center">
          {item.title}
        </Text>
        <Text className="text-base text-gray-500 font-poppins">
          {item.text}
        </Text>
      </View>
    );
  };

  const renderPagination = (activeIndex: number) => {
    return (
      <View className="w-full items-center">
        <View className="flex-row justify-center space-x-2 mb-5 absolute bottom-52">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`rounded-full w-2 h-2 mr-3 ${
                i === activeIndex ? "bg-black" : " bg-gray-500"
              }`}
            />
          ))}
        </View>

        {activeIndex < slides.length - 1 ? (
          <TouchableOpacity
            className="bg-deep-green py-4 px-16 rounded-2xl"
            onPress={() => sliderRef.current?.goToSlide(activeIndex + 1)}
          >
            <Text className="text-white font-poppins-medium text-base">
              Next
            </Text>
          </TouchableOpacity>
        ) : (
          <Link className="bg-deep-green py-4 px-16 rounded-2xl" href={"/auth"}>
            <Text className="text-white font-poppins-medium text-base">
              Get Started
            </Text>
          </Link>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <Link href={"/auth"} className="mb-1">
        <Text className="font-poppins-medium text-base text-right">skip</Text>
      </Link>

      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderItem}
        renderPagination={renderPagination}
        showNextButton={false}
        showDoneButton={false}
        showSkipButton={false}
      />
    </SafeAreaView>
  );
}
