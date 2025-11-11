import React, { useEffect, useState } from "react";
import AdCard from "@/components/ads/AdCard";
import Header from "@/components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getSavedAds } from "@/api/farmhubapi";

export default function Saved() {
  const { adsType } = useLocalSearchParams();
  const [savedAds, setSavedAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adsType) {
      router.replace("/saved?adsType=sell");
      return;
    }

    fetchSavedAds();
  }, [adsType]);

  const fetchSavedAds = async () => {
    try {
      setLoading(true);
      const response = await getSavedAds();
      setSavedAds(response.data);
    } catch (error) {
      console.error("Error fetching saved ads:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!adsType) return null;

  const filteredAds = savedAds.filter((ad) => ad.type === adsType);

  return (
    <View className="flex-1">
      <Header />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-3">
          <Text className="text-xl font-poppins-medium mb-3">Saved</Text>
          <Text className="text-xs font-poppins mb-3">
            Your favorite farmers and products
          </Text>

          <View className="flex-row gap-x-4">
            <TextInput
              placeholder="Search"
              className="font-poppins text-sm px-3 py-2 bg-gray rounded-md flex-1"
            />
            <View className="bg-gray h-10 w-10 justify-center items-center rounded-md">
              <Ionicons name="filter" size={16} color="black" />
            </View>
          </View>

          <View className="bg-gray rounded-full mt-4 h-9 flex-row">
            <TouchableOpacity
              onPress={() => router.push("/saved?adsType=sell")}
              className={`flex-1 h-full justify-center flex-row items-center ${
                adsType === "sell" && "bg-deep-gray"
              } rounded-full`}
            >
              <Text className="text-xs font-poppins text-center rounded-full">
                Farmer Ads
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 h-full justify-center flex-row items-center rounded-full ${
                adsType === "buy" && "bg-deep-gray"
              }`}
              onPress={() => router.push("/saved?adsType=buy")}
            >
              <Text className="text-xs font-poppins text-center rounded-full">
                Buyer Ads
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" className="mt-10" />
          ) : (
            <View className="mt-5 flex-1 flex-col gap-y-6">
              {filteredAds.map((adsData, index) => (
                <AdCard
                  adsData={adsData}
                  key={index}
                  imageId={Math.floor(Math.random() * 5) + 1}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
