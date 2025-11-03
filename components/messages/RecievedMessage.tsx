import { Message } from "@/screens/messages/ChatScreen";
import { Text, View } from "react-native";

export default function RecievedMessage({ message }: { message: Message }) {
  return (
    <View className="flex-row justify-start mb-4">
      <View className="px-3 py-2 max-w-72 rounded-xl bg-gray">
        <Text className="font-poppins">{message}</Text>
      </View>
    </View>
  );
}
