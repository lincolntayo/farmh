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
import API from "../../api/farmhubAPI";

export default function MarketPlace() {
  const { adsType } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!adsType) {
      router.replace("/marketplace?adsType=sell");
    } else {
      fetchProducts();
    }
  }, [adsType]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      const allProducts = res.data;

      // Filter by type (optional, if your backend includes product.type)
      const filtered = allProducts.filter(
        (product) => product.category === adsType // adjust field name if needed
      );
      setProducts(filtered);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!adsType) return null;

  return (
    <View className="flex-1">
      <Header />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-3">
          <Text className="text-xl font-poppins-medium mb-1">Market place</Text>
          <Text className="text-xs font-poppins text-gray-500 mb-4">
            Discover farmers & quality products
          </Text>

          <View className="flex-row gap-x-2 mb-4">
            <TextInput
              placeholder="Search"
              className="font-poppins text-sm px-3 py-2 bg-gray rounded-md flex-1"
            />
            <TouchableOpacity className="bg-gray h-10 w-10 justify-center items-center rounded-md">
              <Ionicons name="filter" size={16} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray h-10 w-10 justify-center items-center rounded-md"
              onPress={() => router.push("/(tabs)/create")}
            >
              <AntDesign name="plus" size={16} color="black" />
            </TouchableOpacity>
          </View>

          <View className="bg-gray rounded-full h-9 flex-row">
            <TouchableOpacity
              onPress={() => router.push("/marketplace?adsType=sell")}
              className={`flex-1 h-full justify-center items-center rounded-full ${
                adsType === "sell" ? "bg-black" : ""
              }`}
            >
              <Text className={`text-xs font-poppins ${
                adsType === "sell" ? "text-white" : "text-black"
              }`}>
                Farmer Ads
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 h-full justify-center items-center rounded-full ${
                adsType === "buy" ? "bg-black" : ""
              }`}
              onPress={() => router.push("/marketplace?adsType=buy")}
            >
              <Text className={`text-xs font-poppins ${
                adsType === "buy" ? "text-white" : "text-black"
              }`}>
                Buyer Ads
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#333" className="mt-5" />
          ) : (
            <View className="mt-5 flex-1 flex-col gap-y-6">
              {products.map((item, index) => (
                <AdCard
                  adsData={item}
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
