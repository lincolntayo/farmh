// app/(tabs)/marketplace.tsx
import { useCallback, useEffect, useState } from "react";
import AdCard from "@/components/ads/AdCard";
import Header from "@/components/Header";
import { getAllProducts, Product } from "@/api/farmhubapi";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
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

export default function MarketPlace() {
  const { adsType } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!adsType) {
      router.replace("/marketplace?adsType=sell");
    }
  }, [adsType]);

  const fetchProducts = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error: any) {
      console.error("Error fetching products:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(true);
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
          <Text className="text-xl font-poppins-medium mb-3">Marketplace</Text>
          <Text className="text-xs font-poppins mb-3 text-gray-600">
            Discover farmers & quality products
          </Text>

          <View className="flex-row gap-x-4">
            <TextInput
              placeholder="Search products..."
              className="font-poppins text-sm px-3 py-2 bg-gray rounded-md flex-1"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <View className="bg-gray h-10 w-10 justify-center items-center rounded-md">
              <Ionicons name="filter" size={16} color="black" />
            </View>

            {/* + button always visible */}
            <TouchableOpacity 
              className="bg-deep-green h-10 w-10 justify-center items-center rounded-md"
              onPress={() => router.push("create")} // relative path
            >
              <AntDesign name="plus" size={16} color="white" />
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
                All Products
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 h-full justify-center flex-row items-center rounded-full ${
                adsType === "buy" && "bg-deep-gray"
              }`}
              onPress={() => router.push("/marketplace?adsType=buy")}
            >
              <Text className="text-xs font-poppins text-center rounded-full">
                My Products
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
              <View className="py-8">
                <Text className="text-gray-500 text-center font-poppins">
                  {searchQuery 
                    ? "No products found matching your search" 
                    : "No products available yet"}
                </Text>
                <TouchableOpacity 
                  className="mt-4 bg-deep-green py-3 px-6 rounded-xl self-center"
                  onPress={() => router.push("create")} // relative path
                >
                  <Text className="text-white font-poppins-medium">
                    Post First Product
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
