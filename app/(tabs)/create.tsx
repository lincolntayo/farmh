// app/(tabs)/create.tsx
import CustomDropdown from "@/components/ads/Dropdown";
import ImageUpload from "@/components/ads/ImageUpload";
import Header from "@/components/Header";
import { createProduct } from "@/api/farmhubapi";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  { label: "Fruits", value: "fruits" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Grains", value: "grains" },
  { label: "Livestock", value: "livestock" },
  { label: "Poultry", value: "poultry" },
  { label: "Dairy", value: "dairy" },
  { label: "Other", value: "other" },
];

const CreateScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });

  // Manual date entry
  const [availableFromStr, setAvailableFromStr] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [availableUntilStr, setAvailableUntilStr] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price || !form.quantity || !form.description) {
      return Alert.alert("Error", "All fields are required!");
    }

    if (!image) return Alert.alert("Error", "Please upload a product image!");

    const price = parseFloat(form.price);
    const quantity = parseFloat(form.quantity);

    if (isNaN(price) || price <= 0) return Alert.alert("Error", "Please enter a valid price!");
    if (isNaN(quantity) || quantity <= 0) return Alert.alert("Error", "Please enter a valid quantity!");

    // Parse manual dates
    const fromDate = new Date(availableFromStr);
    const untilDate = new Date(availableUntilStr);

    if (isNaN(fromDate.getTime()) || isNaN(untilDate.getTime())) {
      return Alert.alert("Error", "Invalid date format. Use YYYY-MM-DD");
    }

    if (fromDate > untilDate) {
      return Alert.alert("Error", "'Available From' must be before 'Available Until'");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("price", price.toString());
      formData.append("quantity", quantity.toString());
      formData.append("description", form.description);
      formData.append("availableFrom", fromDate.toISOString());
      formData.append("availableUntil", untilDate.toISOString());

      if (image) {
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("image", {
          uri: image,
          name: `product.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await createProduct(formData);

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Product posted successfully!", [
          {
            text: "OK",
            onPress: () => {
              setForm({ name: "", category: "", price: "", quantity: "", description: "" });
              setAvailableFromStr(new Date().toISOString().split("T")[0]);
              setAvailableUntilStr(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
              setImage(null);
              router.push("/marketplace?adsType=sell");
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error("Product creation error:", error.response?.data || error.message);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to post product. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-3">
          <Text className="text-xl font-poppins-medium mb-3">Create New Product</Text>
          <Text className="text-xs font-poppins mb-3 text-gray-600">List your product for sale</Text>

          <ImageUpload image={image} setImage={setImage} />

          <View className="mt-5">
            {/* Product Name */}
            <Text className="text-base font-poppins-medium mb-2">Product Name *</Text>
            <TextInput
              className="bg-gray rounded-xl px-4 py-3 text-base font-poppins mb-3"
              placeholder="e.g., Fresh Tomatoes"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />

            {/* Category */}
            <Text className="text-base font-poppins-medium mb-2">Category *</Text>
            <CustomDropdown
              data={categories}
              placeholder="Select Category"
              setValue={(value) => setForm({ ...form, category: value })}
              style={{
                backgroundColor: "#d9d9d9",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                marginBottom: 12,
              }}
              value={form.category}
            />

            {/* Price & Quantity */}
            <View className="flex-row gap-x-3 mb-3">
              <View className="flex-1">
                <Text className="text-base font-poppins-medium mb-2">Price (₦) *</Text>
                <TextInput
                  className="bg-gray rounded-xl px-4 py-3 text-base font-poppins"
                  placeholder="e.g., 2500"
                  value={form.price}
                  onChangeText={(text) => setForm({ ...form, price: text })}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-poppins-medium mb-2">Quantity (kg) *</Text>
                <TextInput
                  className="bg-gray rounded-xl px-4 py-3 text-base font-poppins"
                  placeholder="e.g., 100"
                  value={form.quantity}
                  onChangeText={(text) => setForm({ ...form, quantity: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Manual Date Input */}
            <View className="flex-row gap-x-3 mb-3">
              <View className="flex-1">
                <Text className="text-base font-poppins-medium mb-2">Available From *</Text>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  value={availableFromStr}
                  onChangeText={setAvailableFromStr}
                  className="bg-gray rounded-xl px-4 py-3 text-base font-poppins"
                />
              </View>

              <View className="flex-1">
                <Text className="text-base font-poppins-medium mb-2">Available Until *</Text>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  value={availableUntilStr}
                  onChangeText={setAvailableUntilStr}
                  className="bg-gray rounded-xl px-4 py-3 text-base font-poppins"
                />
              </View>
            </View>

            {/* Description */}
            <Text className="text-base font-poppins-medium mb-2">Description *</Text>
            <TextInput
              className="bg-gray rounded-xl px-4 py-3 text-base font-poppins mb-5"
              placeholder="Describe your product, quality, certifications, etc."
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={{ height: 120 }}
            />

            {/* Buttons */}
            <View className="flex-row gap-x-3 mb-8">
              <TouchableOpacity
                className="flex-1 rounded-xl bg-gray py-3"
                onPress={() => router.back()}
                disabled={loading}
              >
                <Text className="text-center font-poppins text-base">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-xl bg-deep-green py-3"
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-center font-poppins-medium text-base text-white">
                    Post Product
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateScreen;
