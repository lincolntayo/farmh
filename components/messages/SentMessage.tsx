import { Message } from "@/screens/messages/ChatScreen";
import React from "react";
import { Text, View } from "react-native";

export default function SentMessage({ message }: { message: Message }) {
  return (
    <View className="flex-row justify-end mb-4">
      <View className="px-3 py-2 max-w-72 rounded-xl bg-light-green">
        <Text className="font-poppins">{message}</Text>
      </View>
    </View>
  );
}
