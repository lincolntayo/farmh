import Message from "@/components/messages/Message";
import Feather from "@expo/vector-icons/Feather";
import { Text, View } from "react-native";

export default function Messages() {
  return (
    <View className="flex-1 bg-white">
      <View className="py-3 px-4 flex-row justify-between items-center">
        <Text className="text-xl font-poppins-medium">Messages</Text>

        <Feather name="search" size={18} color="black" />
      </View>

      <View className="mt-5 px-4">
        <Message />
        <Message />
        <Message />
      </View>
    </View>
  );
}
