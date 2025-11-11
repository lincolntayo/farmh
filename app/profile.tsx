import Header from "@/components/Header";
import Info from "@/components/profile/Info";
import InfoTab from "@/components/profile/InfoTab";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API, { getSavedAds } from "@/api/farmhubapi"; // ✅ use your shared API instance

const profile = require("../assets/images/profile.png");

interface User {
  name?: string;
  state?: string;
  country?: string;
  photoID?: string;
  email?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User>({});
  const [saved, setSaved] = useState(0);
  const [orders, setOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return router.replace("/(auth)/login");

      // ✅ Fetch user profile from backend (uses token via interceptor)
      const userRes = await API.get("/users/me"); // adjust if your route differs
      const savedRes = await getSavedAds();

      if (userRes.data) setUser(userRes.data);
      if (savedRes.data) setSaved(savedRes.data.length || 0);

      // If you have orders endpoint:
      try {
        const ordersRes = await API.get("/orders/my-orders");
        if (ordersRes.data) setOrders(ordersRes.data.length || 0);
      } catch {
        setOrders(0); // ignore if not implemented
      }
    } catch (error) {
      console.error("Profile load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const profileImage = user?.photoID
    ? { uri: user.photoID }
    : (profile as ImageSourcePropType);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4B9CD3" />
      </View>
    );
  }

  return (
    <View>
      <View className="h-12 bg-white" />
      <Header />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-4 pb-8">
          <Text className="font-poppins-medium mt-4 text-2xl">Profile</Text>

          {/* Profile Section */}
          <View className="bg-gray rounded-xl px-4 py-4 items-center justify-center relative mt-3">
            <View className="relative mb-3">
              <Image source={profileImage} className="w-20 h-20 rounded-full border" />
              <View className="absolute left-12 bg-white rounded-full w-7 h-7 justify-center items-center top-16 -translate-y-2">
                <Feather name="camera" size={18} color="black" />
              </View>
            </View>

            <View className="flex-row gap-x-6 items-center">
              <Text className="text-2xl font-poppins">{user?.name || "User"}</Text>
              <MaterialIcons name="verified" size={20} color="black" />
            </View>

            {(user?.state || user?.country) && (
              <Text className="text-base font-poppins text-gray-500">
                {user?.state || ""}{user?.state && user?.country ? ", " : ""}{user?.country || ""}
              </Text>
            )}

            <Feather name="edit-3" size={16} color="black" className="absolute right-5 top-5" />
          </View>

          {/* Stats Section */}
          <View className="bg-gray px-7 py-3 rounded-2xl mt-5 flex-row justify-between">
            <Info figure={saved} text="Saved" />
            <Info figure={orders} text="Orders" />
            <Info figure={0} text="Reviews" />
          </View>

          {/* Tabs Section */}
          <View className="bg-gray py-3 rounded-2xl mt-5">
            <InfoTab figure={orders} text="My orders" border="border-b" />
            <InfoTab figure={saved} text="Saved farmers" border="border-b" />
            <InfoTab figure={0} text="Saved products" border="border-b" />
            <InfoTab figure={0} text="Notifications" border="border-b" />
            <InfoTab text="Settings" />
          </View>

          {/* Logout */}
          <TouchableOpacity
            className="bg-gray mt-5 py-3 rounded-xl flex-row items-center justify-center gap-x-2"
            onPress={async () => {
              try {
                await AsyncStorage.multiRemove(["token", "user"]);
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
