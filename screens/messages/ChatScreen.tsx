import RecievedMessage from "@/components/messages/RecievedMessage";
import SentMessage from "@/components/messages/SentMessage";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import messagesDB from "../../db/messages.json";

export type Message = string;

export default function ChatScreen() {
  const [messages, setMessages] = useState(messagesDB);
  const [newMessage, setNewMessage] = useState("");

  return (
    <View className="flex-1 bg-white h-screen relative">
      <View className="h-12 bg-white" />
      <View className="py-3 px-4 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-poppins-medium">Messages</Text>

        <Image
          source={require("../../assets/images/profile.png")}
          className="w-8 h-8 rounded-full border"
        />
      </View>

      <KeyboardAwareScrollView
        className=""
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 w-full mt-5 flex-1 flex-col justify-between">
          <View>
            {messages.sent.map((msg, index) => (
              <View key={index}>
                <SentMessage message={messages.sent[index]} />
                {messages.recieved[index] && (
                  <RecievedMessage message={messages.recieved[index]} />
                )}
              </View>
            ))}
          </View>

          <View className="flex-row mt-40 rounded-xl bg-gray items-center px-4 py-4">
            <TextInput
              className="flex-1 font-poppins text-base"
              placeholder="Type a message"
              multiline
              textAlignVertical="top"
              numberOfLines={4}
              value={newMessage}
              onChangeText={(text) => setNewMessage(text)}
            />

            <TouchableOpacity
              onPress={() => {
                const newSentMessages = [...messages.sent, newMessage];

                setMessages((prev) => ({ ...prev, sent: newSentMessages }));
                setNewMessage("");
              }}
            >
              <MaterialCommunityIcons
                name="send-circle"
                size={32}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View className="h-16 bg-white" />
    </View>
  );
}
