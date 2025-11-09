import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

interface NewsProps {
  image: ImageSourcePropType;
}

export default function News(props: NewsProps) {
  return (
    <View className="flex-row gap-x-3 items-start">
      <Image source={props.image} className="w-10 h-10 rounded-full" />
      <Text className="flex-1 font-poppins text-sm text-black">
        Lorem ipsum dolor sit amet, adipiscing elit.
      </Text>
    </View>
  );
}
