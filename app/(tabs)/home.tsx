import Header from "@/components/Header";
import News from "@/components/home/News";
import SectionCard from "@/components/home/SectionCard";
import Weather from "@/components/home/Weather";
import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";

const marketPlaceImages = [
  require("../../assets/images/image-1.png"),
  require("../../assets/images/image-2.png"),
];

const farmersImages = [
  require("../../assets/images/image-3.png"),
  require("../../assets/images/image-4.png"),
];

const newsImages = [
  require("../../assets/images/image-3.png"),
  require("../../assets/images/image-5.png"),
  require("../../assets/images/image-4.png"),
];

export default function Home() {
  return (
    <View className="flex-1">
      <Header />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-3 flex-1 flex-col gap-y-6">
          <Weather />

          <View className="flex-col gap-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">
                Market place
              </Text>
              <Link
                href={"/marketplace?adsType=buy"}
                className="text-sm text-gray-500 font-poppins"
              >
                See more
              </Link>
            </View>

            <View className="flex-row gap-x-4 justify-between">
              {marketPlaceImages.map((image, index) => (
                <SectionCard image={image} key={index} />
              ))}
            </View>
          </View>

          <View className="flex-col gap-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">Farmers</Text>
              <Link
                href={"/marketplace?adsType=sell"}
                className="text-sm text-gray-500 font-poppins"
              >
                See more
              </Link>
            </View>

            <View className="flex-row gap-x-4 justify-between">
              {farmersImages.map((image, index) => (
                <SectionCard image={image} key={index} />
              ))}
            </View>
          </View>

          <View className="flex-col gap-y-3 flex-1">
            <Text className="text-base font-poppins-medium">Trending News</Text>

            <View className="flex-col flex-1 gap-y-4">
              {newsImages.map((image, index) => (
                <News image={image} key={index} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
