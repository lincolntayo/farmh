import SettingTab from "@/components/SettingTab";
import { Feather } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Settings() {
  return (
    <View className="flex-1 bg-white h-screen relative">
      <View className="h-12 bg-white" />
      <View className="py-3 px-4 flex-row gap-x-4 items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-poppins-medium">Settings</Text>
      </View>

      <View>
        <SettingTab
          icon={<EvilIcons name="user" size={32} color="black" />}
          name="Edit Profile"
        />
        <SettingTab
          icon={<Ionicons name="key-outline" size={24} color="black" />}
          name="Change Password"
        />
        <SettingTab
          icon={<Fontisto name="world-o" size={24} color="black" />}
          name="Language"
        />
        <SettingTab
          icon={<Fontisto name="email" size={24} color="black" />}
          name="Email Verification"
        />
        <SettingTab
          icon={<Feather name="message-square" size={24} color="black" />}
          name="Messages"
        />
        <SettingTab
          icon={<Ionicons name="call-outline" size={24} color="black" />}
          name="Phone Number Verification"
        />
      </View>
    </View>
  );
}
