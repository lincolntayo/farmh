// app/(tabs)/home.tsx
import Header from "@/components/Header";
import ProductCard from "@/components/home/ProductCard";
import Weather from "@/components/home/Weather";
import { getAllProducts, Product } from "@/api/farmhubapi";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Split products by farmer vs buyer ads
  const farmerProducts = products.filter(p => p.farmerId);
  const latestProducts = products.slice(0, 4);

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
        <View className="px-4 py-3 flex-1 flex-col gap-y-8">
          <Weather />

          {/* Latest Products Section */}
          <View className="flex-col gap-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">
                Latest Products
              </Text>
              <Link
                href={"/marketplace?adsType=sell"}
                className="text-sm text-gray-500 font-poppins"
              >
                See all
              </Link>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#0B4812" />
            ) : latestProducts.length > 0 ? (
              <View className="flex-row flex-wrap gap-3">
                {latestProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 text-center py-4 font-poppins">
                No products available yet
              </Text>
            )}
          </View>

          {/* Farmers Section */}
          <View className="flex-col gap-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">
                From Farmers
              </Text>
              <Link
                href={"/marketplace?adsType=sell"}
                className="text-sm text-gray-500 font-poppins"
              >
                See more
              </Link>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#0B4812" />
            ) : farmerProducts.length > 0 ? (
              <View className="flex-row flex-wrap gap-3">
                {farmerProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 text-center py-4 font-poppins">
                No farmer products yet
              </Text>
            )}
          </View>

          {/* News/Tips Section */}
          <View className="flex-col gap-y-3 pb-8">
            <Text className="text-base font-poppins-medium">
              Farming Tips
            </Text>
            
            <View className="bg-gray rounded-xl p-4">
              <Text className="font-poppins-medium text-base mb-2">
                🌱 Best Practices for Storage
              </Text>
              <Text className="text-sm font-poppins text-gray-600">
                Keep your produce fresh longer with proper storage techniques. 
                Store in cool, dry places away from direct sunlight.
              </Text>
            </View>

            <View className="bg-gray rounded-xl p-4">
              <Text className="font-poppins-medium text-base mb-2">
                💧 Water Conservation Tips
              </Text>
              <Text className="text-sm font-poppins text-gray-600">
                Drip irrigation can save up to 60% water compared to traditional methods.
                Consider mulching to retain soil moisture.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}