import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

interface NewsProps {
  image: ImageSourcePropType;
}

export default function News(props: NewsProps) {
  return (
    <View className="flex-row gap-x-3 items-center">
      <Image source={props.image} className="w-10 h-10 rounded-full" />
      <Text className="flex-shrink font-poppins text-sm">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis soluta
        quam consectetur quisquam suscipit voluptate!
      </Text>
    </View>
  );
}
