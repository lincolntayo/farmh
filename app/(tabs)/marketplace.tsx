import { useEffect, useState } from "react";
import AdCard from "@/components/ads/AdCard";
import Header from "@/components/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
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
import { getAllProducts } from "@/api/farmhubapi";
import { Product } from "@/api/types";

export default function MarketPlace() {
  const { adsType } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adsType) {
      router.replace("/marketplace?adsType=sell");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [adsType]);

  if (!adsType) return null;
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  // ✅ Updated filtering: show all posted ads, separate by seller role
  const filteredAds = products.filter((p) => {
    if (!p.seller?.role) return true; // include any product without role
    if (adsType === "sell") return p.seller.role === "farmer";
    if (adsType === "buy") return p.seller.role === "buyer";
    return true; // fallback include all
  });

  return (
    <View className="flex-1">
      <Header />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-3">
          <Text className="text-xl font-poppins-medium mb-3">Market place</Text>
          <Text className="text-xs font-poppins mb-3">
            Discover farmers & quality products
          </Text>

          <View className="flex-row gap-x-4">
            <TextInput
              placeholder="Search"
              className="font-poppins text-sm px-3 py-2 bg-gray rounded-md flex-1"
            />
            <View className="bg-gray h-10 w-10 justify-center items-center rounded-md">
              <Ionicons name="filter" size={16} color="black" />
            </View>
            <TouchableOpacity
              className="bg-gray h-10 w-10 justify-center items-center rounded-md"
              onPress={() => router.push("/postAd")}
            >
              <AntDesign name="plus" size={16} color="black" />
            </TouchableOpacity>
          </View>

          <View className="bg-gray rounded-full mt-4 h-9 flex-row">
            <TouchableOpacity
              onPress={() => router.push("/marketplace?adsType=sell")}
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
              onPress={() => router.push("/marketplace?adsType=buy")}
            >
              <Text className="text-xs font-poppins text-center rounded-full">
                Buyer Ads
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-5 flex-1 flex-col gap-y-6">
            {filteredAds.map((adsData, index) => (
              <AdCard
                adsData={adsData}
                key={index}
                imageId={Math.floor(Math.random() * 5) + 1}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
