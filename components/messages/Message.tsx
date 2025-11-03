import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Message() {
  return (
    <TouchableOpacity
      className="bg-gray rounded-xl px-3 py-4 flex-row items-center gap-x-4 mb-5"
      onPress={() => router.push("/chat")}
    >
      <Image
        source={require("../../assets/images/profile.png")}
        className="w-12 h-12 rounded-full border"
      />

      <View className="flex-row flex-1 items-end justify-between">
        <View className="">
          <Text className="font-poppins-medium text-base">Mike</Text>
          <Text className="text-ellipsis flex-1">
            Lorem ipsum dolor sit amet con...
          </Text>
        </View>
        <Text className="font-poppins  text-xs">13:20</Text>
      </View>
    </TouchableOpacity>
  );
}
