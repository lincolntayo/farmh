import CustomDropdown from "@/components/ads/Dropdown";
import Form from "@/components/ads/Form";
import ImageUpload from "@/components/ads/ImageUpload";
import Header from "@/components/Header";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { createProduct } from "../../api/farmhubAPI"; // 

const adsType = [
  { label: "Sell", value: "sell" },
  { label: "Buy", value: "buy" },
];

export default function Create() {
  const [type, setType] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    productImage: "",
    type: "",
    productName: "",
    category: "",
    location: "",
    quantity: "",
    description: "",
    priceFrom: "",
    priceTo: "",
    availableFrom: "",
    availableUntil: "",
    unit: "",
  });

  const handleSubmit = async () => {
    // ✅ Validate required fields
    if (
      !form.productName ||
      !category ||
      !form.location ||
      !form.quantity ||
      !form.unit ||
      !form.priceFrom ||
      !form.priceTo ||
      !form.description ||
      !image ||
      !type
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Prepare data exactly as backend expects
      const newProduct = {
        ...form,
        category,
        type,
        productImage: image,
        quantity: Number(form.quantity),
        priceFrom: Number(form.priceFrom),
        priceTo: Number(form.priceTo),
      };

      // ✅ Send to backend API
      const response = await createProduct(newProduct);
      console.log("Created Product:", response.data);

      Alert.alert("Success", "Your ad has been created successfully!");
      router.push(`/marketplace?adsType=${type}`);
    } catch (error: any) {
      console.error("Error creating product:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create ad. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <Header />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-3">
          <Text className="text-xl font-poppins-medium mb-1">
            Create New Ad
          </Text>
          <Text className="text-xs font-poppins text-gray-500 mb-4">
            List your product or buying request
          </Text>

          {/* Ad type dropdown */}
          <View className="flex-row items-center gap-x-3 mb-4">
            <Text className="text-base font-poppins">I want to: </Text>
            <CustomDropdown
              data={adsType}
              style={{
                width: 120,
                borderRadius: 8,
                backgroundColor: "#d9d9d9",
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              value={type}
              setValue={setType}
              placeholder="Sell"
            />
          </View>

          {/* Image Upload */}
          <ImageUpload image={image} setImage={setImage} />

          <Text className="text-base font-poppins-medium mt-4 mb-3">Product Details</Text>

          {/* Product Form */}
          <Form
            category={category}
            form={form}
            handleSubmit={handleSubmit}
            setCategory={setCategory}
            setForm={setForm}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
}
