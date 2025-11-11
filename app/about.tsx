import { View, Text } from "react-native";

export default function About() {
  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-lg font-semibold text-green-800 mb-4">About Us</Text>
      <Text className="text-gray-700 leading-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        facilisis, lacus at ultrices eleifend, turpis justo dapibus mi,
        facilisis tincidunt sem libero vitae risus.
      </Text>
    </View>
  );
}
