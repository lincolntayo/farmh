// app/product/[id].tsx
import { addComment, getComments, getProductById, Product, Comment } from "@/api/farmhubapi";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchComments();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id!);
      setProduct(response.data);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      Alert.alert("Error", "Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id!);
      setComments(response.data);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      await addComment(id!, commentText.trim());
      setCommentText("");
      fetchComments(); // Refresh comments
      Alert.alert("Success", "Comment added successfully");
    } catch (error: any) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const placeholderImage = require("../../assets/images/image-1.png");

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0B4812" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-4">
        <Text className="text-lg font-poppins-medium text-gray-600">
          Product not found
        </Text>
        <TouchableOpacity
          className="mt-4 bg-deep-green py-3 px-6 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-poppins-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const productImage = product.image ? { uri: product.image } : placeholderImage;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="h-12 bg-white" />
      
      {/* Header */}
      <View className="py-3 px-4 flex-row items-center gap-x-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-poppins-medium">Product Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <Image source={productImage} className="w-full h-64" resizeMode="cover" />

        <View className="px-4 py-4">
          {/* Product Info */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-poppins-semibold">{product.name}</Text>
              <View className="bg-light-green px-3 py-1 rounded-full self-start mt-2">
                <Text className="text-sm font-poppins text-deep-green">
                  {product.category}
                </Text>
              </View>
            </View>
            <Text className="text-2xl font-poppins-bold text-deep-green">
              ₦{product.price.toLocaleString()}
            </Text>
          </View>

          {/* Farmer Info */}
          {product.farmer && (
            <View className="bg-gray rounded-xl p-4 mb-4">
              <Text className="text-sm font-poppins-medium mb-2">Seller Information</Text>
              <View className="flex-row items-center gap-x-3">
                <View className="w-12 h-12 bg-deep-green rounded-full justify-center items-center">
                  <Text className="text-white font-poppins-bold text-lg">
                    {product.farmer.name.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-poppins-medium text-base">
                    {product.farmer.name}
                  </Text>
                  {product.farmer.farmName && (
                    <Text className="text-xs font-poppins text-gray-600">
                      {product.farmer.farmName}
                    </Text>
                  )}
                  <View className="flex-row items-center gap-x-1 mt-1">
                    <Ionicons name="location-outline" size={12} color="#666" />
                    <Text className="text-xs font-poppins text-gray-600">
                      {product.farmer.state}, {product.farmer.country}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Quantity */}
          <View className="flex-row items-center gap-x-2 mb-4">
            <Ionicons name="cube-outline" size={20} color="#0B4812" />
            <Text className="text-base font-poppins">
              <Text className="font-poppins-bold">{product.quantity} kg</Text> available
            </Text>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-lg font-poppins-medium mb-2">Description</Text>
            <Text className="text-base font-poppins text-gray-700 leading-6">
              {product.description}
            </Text>
          </View>

          {/* Comments Section */}
          <View className="mb-6">
            <Text className="text-lg font-poppins-medium mb-3">
              Comments ({comments.length})
            </Text>

            {comments.length > 0 ? (
              comments.map((comment) => (
                <View key={comment._id} className="bg-gray rounded-xl p-3 mb-2">
                  <Text className="font-poppins-medium text-sm">
                    {comment.userName || "User"}
                  </Text>
                  <Text className="font-poppins text-sm text-gray-700 mt-1">
                    {comment.text}
                  </Text>
                  {comment.createdAt && (
                    <Text className="text-xs font-poppins text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <Text className="text-gray-500 text-center py-4 font-poppins">
                No comments yet. Be the first to comment!
              </Text>
            )}

            {/* Add Comment */}
            <View className="flex-row gap-x-2 mt-3">
              <TextInput
                className="flex-1 bg-gray rounded-xl px-4 py-3 font-poppins"
                placeholder="Write a comment..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                className="bg-deep-green rounded-xl px-4 justify-center items-center"
                onPress={handleAddComment}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="send" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-x-3 mb-8">
            <TouchableOpacity className="flex-1 bg-deep-green py-4 rounded-xl">
              <Text className="text-white font-poppins-medium text-base text-center">
                Contact Seller
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray px-4 py-4 rounded-xl">
              <Ionicons name="heart-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}