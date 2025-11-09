// app/profile.tsx
import Header from "@/components/Header";
import Info from "@/components/profile/Info";
import InfoTab from "@/components/profile/InfoTab";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const defaultProfile = require("../assets/images/profile.png");

interface User {
  name?: string;
  state?: string;
  country?: string;
  photoID?: string;
  role?: string;
  farmName?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User>({});
  const [savedCount, setSavedCount] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      loadUser();
      loadSavedCount();
    }, [])
  );

  // Load user from AsyncStorage
  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  // Load saved products count
  const loadSavedCount = async () => {
    try {
      const savedProducts = await AsyncStorage.getItem("savedProducts");
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed)) {
          setSavedCount(parsed.length);
        }
      }
    } catch (error) {
      console.error("Error loading saved count:", error);
    }
  };

  // Use either user photoID or default profile image
  const profileImage = user?.photoID
    ? { uri: user.photoID }
    : (defaultProfile as ImageSourcePropType);

  return (
    <View className="flex-1 bg-white">
      <View className="h-12 bg-white" />
      <Header />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-4">
          <Text className="font-poppins-medium mt-4 text-2xl">Profile</Text>

          <View className="bg-gray rounded-xl px-4 py-4 items-center justify-center relative mt-4">
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
              <Text className="text-2xl font-poppins">{user?.name || "User"}</Text>
              <MaterialIcons name="verified" size={20} color="#0B4812" />
            </View>
            
            {user?.role && (
              <View className="bg-light-green px-3 py-1 rounded-full mt-2">
                <Text className="text-sm font-poppins text-deep-green">
                  {user.role === "farmer" ? "Farmer" : "Buyer"}
                </Text>
              </View>
            )}

            {user?.farmName && (
              <Text className="text-sm font-poppins text-gray-600 mt-1">
                {user.farmName}
              </Text>
            )}

            {(user?.state || user?.country) && (
              <View className="flex-row items-center gap-x-1 mt-1">
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text className="text-base font-poppins text-gray-500">
                  {user?.state || ""}{user?.state && user?.country ? ", " : ""}{user?.country || ""}
                </Text>
              </View>
            )}

            <TouchableOpacity className="absolute right-5 top-5">
              <Feather name="edit-3" size={16} color="black" />
            </TouchableOpacity>
          </View>

          <View className="bg-gray px-7 py-3 rounded-2xl mt-5 flex-row justify-between">
            <Info figure={savedCount} text="Saved" />
            <Info figure={0} text="Orders" />
            <Info figure={0} text="Reviews" />
          </View>

          <View className="bg-gray py-3 rounded-2xl mt-5">
            <TouchableOpacity 
              className="px-4 py-4 flex-row justify-between items-center border-b border-gray-300"
              onPress={() => router.push("/orders")}
            >
              <View className="flex-row items-center gap-x-3">
                <Ionicons name="receipt-outline" size={20} color="black" />
                <Text className="font-poppins text-base">My orders</Text>
              </View>
              <View className="flex-row items-center gap-x-2">
                <View className="py-1.5 px-3 rounded-full bg-deep-gray">
                  <Text className="text-sm font-poppins">0</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="px-4 py-4 flex-row justify-between items-center border-b border-gray-300"
              onPress={() => router.push("/saved?adsType=sell")}
            >
              <View className="flex-row items-center gap-x-3">
                <Ionicons name="heart-outline" size={20} color="black" />
                <Text className="font-poppins text-base">Saved products</Text>
              </View>
              <View className="flex-row items-center gap-x-2">
                <View className="py-1.5 px-3 rounded-full bg-deep-gray">
                  <Text className="text-sm font-poppins">{savedCount}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="px-4 py-4 flex-row justify-between items-center border-b border-gray-300"
            >
              <View className="flex-row items-center gap-x-3">
                <Ionicons name="notifications-outline" size={20} color="black" />
                <Text className="font-poppins text-base">Notifications</Text>
              </View>
              <View className="flex-row items-center gap-x-2">
                <View className="py-1.5 px-3 rounded-full bg-deep-gray">
                  <Text className="text-sm font-poppins">0</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="px-4 py-4 flex-row justify-between items-center"
              onPress={() => router.push("/settings")}
            >
              <View className="flex-row items-center gap-x-3">
                <Ionicons name="settings-outline" size={20} color="black" />
                <Text className="font-poppins text-base">Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-gray mt-5 py-3 rounded-xl flex-row items-center justify-center gap-x-2 mb-8"
            onPress={async () => {
              try {
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("user");
                router.replace("/(auth)/login");
              } catch (error) {
                console.error("Logout error:", error);
              }
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
