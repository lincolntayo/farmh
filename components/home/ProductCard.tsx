// components/home/ProductCard.tsx
import { Product } from "@/api/farmhubapi";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const placeholderImage = require("../../assets/images/image-1.png");
  const productImage = product.image ? { uri: product.image } : placeholderImage;

  const handlePress = () => {
    router.push(`/product/${product._id}`);
  };

  return (
    <TouchableOpacity 
      className="w-[48%] bg-gray rounded-xl overflow-hidden mb-3"
      onPress={handlePress}
    >
      <Image 
        source={productImage} 
        className="w-full h-32"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="font-poppins-medium text-base" numberOfLines={1}>
          {product.name}
        </Text>
        <Text className="text-xs font-poppins text-gray-600 mt-1" numberOfLines={2}>
          {product.description}
        </Text>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="font-poppins-medium text-sm text-deep-green">
            ₦{product.price.toLocaleString()}
          </Text>
          <Text className="text-xs font-poppins text-gray-500">
            {product.quantity} {product.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}