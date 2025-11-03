import Header from "@/components/Header";
import Info from "@/components/profile/Info";
import InfoTab from "@/components/profile/InfoTab";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import savedAds from "../db/savedAds.json";
import signedUser from "../db/signedUser.json";

const profile = require("../assets/images/profile.png");

export default function Profile() {
  const user = signedUser[0] as any;
  const profileImage = user.photoID
    ? { uri: user.photoID }
    : (profile as ImageSourcePropType);

  return (
    <View>
      <View className="h-12 bg-white" />
      <Header />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-4">
          <Text className="font-poppins-medium mt-4 text-2xl">Profile</Text>

          <View className="bg-gray rounded-xl px-4 py-4 items-center justify-center relative">
            <View className="relative mb-3">
              <Image
                source={profileImage}
                className="w-20 h-20 rounded-full border"
              />
              <View className="absolute left-12 bg-white rounded-full w-7 h-7 justify-center items-center top-16 -translate-y-2">
                <Feather name="camera" size={18} color="black" />
              </View>
            </View>

            <View className="flex-row gap-x-6 items-center">
              <Text className="text-2xl font-poppins">{user.name}</Text>
              <MaterialIcons name="verified" size={20} color="black" />
            </View>
            <Text className="text-base font-poppins text-gray-500">
              {user.state}, {user.country}
            </Text>

            <Feather
              name="edit-3"
              size={16}
              color="black"
              className="absolute right-5 top-5"
            />
          </View>

          <View className="bg-gray px-7 py-3 rounded-2xl mt-5 flex-row justify-between">
            <Info figure={savedAds.length} text="Saved" />
            <Info figure={6} text="Orders" />
            <Info figure={0} text="Reviews" />
          </View>

          <View className="bg-gray py-3 rounded-2xl mt-5">
            <InfoTab figure={6} text="My orders" border="border-b" />
            <InfoTab
              figure={savedAds.length}
              text="Saved farmers"
              border="border-b"
            />
            <InfoTab figure={0} text="Saved products" border="border-b" />
            <InfoTab figure={0} text="Notifications" border="border-b" />
            <InfoTab text="Settings" />
          </View>

          <TouchableOpacity
            className="bg-gray mt-5 py-3 rounded-xl flex-row items-center justify-center gap-x-2"
            onPress={() => {
              signedUser.length = 0;
              signedUser.push({});
              router.push("/login");
            }}
          >
            <Text className="text-base font-poppins">Sign Out</Text>
            <Ionicons name="exit-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
