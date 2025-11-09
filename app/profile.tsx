import Header from "@/components/Header";
import Info from "@/components/profile/Info";
import InfoTab from "@/components/profile/InfoTab";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/farmhubAPI";

const defaultProfile = require("../assets/images/profile.png");

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [savedProducts, setSavedProducts] = useState<any[]>([]);
  const [savedFarmers, setSavedFarmers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user info and profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        // Get user info
        const userRes = await API.get("/users/me");
        setUser(userRes.data);

        // Get saved items
        const savedRes = await API.get("/saved");
        setSavedProducts(savedRes.data.products || []);
        setSavedFarmers(savedRes.data.farmers || []);

        // Get orders
        const ordersRes = await API.get("/orders");
        setOrders(ordersRes.data || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="green" />
      </View>
    );

  if (!user) return null; // fallback

  const profileImage: ImageSourcePropType = user.photoID
    ? { uri: user.photoID }
    : defaultProfile;

  return (
    <View className="flex-1">
      <View className="h-12 bg-white" />
      <Header />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
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
            <Info figure={savedProducts.length} text="Saved" />
            <Info figure={orders.length} text="Orders" />
            <Info figure={0} text="Reviews" />
          </View>

          <View className="bg-gray py-3 rounded-2xl mt-5">
            <InfoTab figure={orders.length} text="My orders" border="border-b" />
            <InfoTab
              figure={savedFarmers.length}
              text="Saved farmers"
              border="border-b"
            />
            <InfoTab figure={savedProducts.length} text="Saved products" border="border-b" />
            <InfoTab figure={0} text="Notifications" border="border-b" />
            <InfoTab text="Settings" />
          </View>

          <TouchableOpacity
            className="bg-gray mt-5 py-3 rounded-xl flex-row items-center justify-center gap-x-2"
            onPress={handleSignOut}
          >
            <Text className="text-base font-poppins">Sign Out</Text>
            <Ionicons name="exit-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
