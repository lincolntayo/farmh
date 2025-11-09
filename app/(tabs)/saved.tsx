// app/(tabs)/saved.tsx
import { useCallback, useEffect, useState } from "react";
import AdCard from "@/components/ads/AdCard";
import Header from "@/components/Header";
import { getProductById, Product } from "@/api/farmhubapi";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

export default function Saved() {
  const { adsType } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!adsType) {
      router.replace("/saved?adsType=sell");
    }
  }, [adsType]);

  const fetchSavedProducts = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      
      // Get saved product IDs from AsyncStorage
      const savedProductsJson = await AsyncStorage.getItem("savedProducts");
      const savedProductIds: string[] = savedProductsJson ? JSON.parse(savedProductsJson) : [];
      
      if (savedProductIds.length === 0) {
        setProducts([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Fetch each saved product
      const productPromises = savedProductIds.map(id => 
        getProductById(id).catch(error => {
          console.error(`Error fetching product ${id}:`, error);
          return null;
        })
      );
      
      const productResponses = await Promise.all(productPromises);
      const fetchedProducts = productResponses
        .filter(response => response !== null)
        .map(response => response!.data);
      
      setProducts(fetchedProducts);
    } catch (error: any) {
      console.error("Error fetching saved products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSavedProducts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSavedProducts(true);
  };

  if (!adsType) return null;

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1">
      <Header />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-4 py-3">
          <Text className="text-xl font-poppins-medium mb-3">Saved</Text>
          <Text className="text-xs font-poppins mb-3 text-gray-600">
            Your favorite farmers and products
          </Text>

          <View className="flex-row gap-x-4">
            <TextInput
              placeholder="Search saved products..."
              className="font-poppins text-sm px-3 py-2 bg-gray rounded-md flex-1"
              value={searchQuery}
              onChangeText={setSearchQuery}
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
                All Saved
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 h-full justify-center flex-row items-center rounded-full ${
                adsType === "buy" && "bg-deep-gray"
              }`}
              onPress={() => router.push("/saved?adsType=buy")}
            >
              <Text className="text-xs font-poppins text-center rounded-full">
                Recent
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-5 flex-1 flex-col gap-y-6">
            {loading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color="#0B4812" />
              </View>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <AdCard key={product._id || index} product={product} />
              ))
            ) : (
              <View className="py-8 items-center">
                <Ionicons name="heart-outline" size={64} color="#d9d9d9" />
                <Text className="text-gray-500 text-center font-poppins mt-4 text-base">
                  {searchQuery 
                    ? "No saved products match your search" 
                    : "No saved products yet"}
                </Text>
                <Text className="text-gray-400 text-center font-poppins mt-2 text-sm px-8">
                  {searchQuery 
                    ? "Try a different search term" 
                    : "Save products by tapping the heart icon"}
                </Text>
                {!searchQuery && (
                  <TouchableOpacity 
                    className="mt-6 bg-deep-green py-3 px-6 rounded-xl"
                    onPress={() => router.push("/marketplace?adsType=sell")}
                  >
                    <Text className="text-white font-poppins-medium">
                      Browse Products
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}