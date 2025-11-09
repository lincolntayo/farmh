// components/ads/AdCard.tsx
import { Product } from "@/api/farmhubapi";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { router } from "expo-router";

interface AdCardProps {
  product: Product;
}

export default function AdCard({ product }: AdCardProps) {
  const [saved, setSaved] = useState(false);
  const placeholderImage = require("../../assets/images/image-1.png");
  const productImage = product.image ? { uri: product.image } : placeholderImage;

  useEffect(() => {
    checkIfSaved();
  }, [product._id]);

  const checkIfSaved = async () => {
    try {
      const savedProducts = await AsyncStorage.getItem("savedProducts");
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        setSaved(parsed.includes(product._id));
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const toggleSave = async () => {
    try {
      const savedProducts = await AsyncStorage.getItem("savedProducts");
      let parsed = savedProducts ? JSON.parse(savedProducts) : [];

      if (saved) {
        // Remove from saved
        parsed = parsed.filter((id: string) => id !== product._id);
      } else {
        // Add to saved
        parsed.push(product._id);
      }

      await AsyncStorage.setItem("savedProducts", JSON.stringify(parsed));
      setSaved(!saved);
    } catch (error) {
      console.error("Error toggling save:", error);
      Alert.alert("Error", "Failed to save product");
    }
  };

  const handlePress = () => {
    router.push(`/product/${product._id}`);
  };

  return (
    <TouchableOpacity 
      className="bg-gray p-1.5 pr-3 pb-3 rounded-md"
      onPress={handlePress}
    >
      <View className="flex-row gap-x-2">
        <Image source={productImage} className="w-28 h-28 rounded-md" />

        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-poppins-semibold" numberOfLines={1}>
              {product.name}
            </Text>
            <View className="bg-light-green px-2 py-1 rounded">
              <Text className="text-xs font-poppins text-deep-green">
                {product.category}
              </Text>
            </View>
          </View>

          <Text className="text-xs font-poppins flex-shrink mt-1" numberOfLines={2}>
            {product.description}
          </Text>

          {product.farmer && (
            <Text className="text-xs font-poppins text-gray-600 mt-1">
              By: {product.farmer.name}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <Text className="font-poppins-medium text-sm">
          ₦{product.price.toLocaleString()}
        </Text>

        <View className="flex-row gap-x-1 items-center">
          <EvilIcons name="location" size={16} color="black" />
          <Text className="text-sm font-poppins-medium text-right">
            {product.farmer?.state || "Nigeria"}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <Text className="font-poppins text-xs">
          <Text className="font-poppins-bold">
            {product.quantity} kg
          </Text>{" "}
          available
        </Text>

        <TouchableOpacity onPress={toggleSave}>
          <FontAwesome
            name={saved ? "heart" : "heart-o"}
            size={16}
            color={saved ? "#0B4812" : "black"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}