import CustomDropdown from "@/components/ads/Dropdown";
import Form from "@/components/ads/Form";
import ImageUpload from "@/components/ads/ImageUpload";
import Header from "@/components/Header";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import ads from "../../db/ads.json";

const adsType = [
  {
    label: "Sell",
    value: "sell",
  },
  {
    label: "Buy",
    value: "buy",
  },
];

export default function Create() {
  const [type, setType] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState("");
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

  const handleSubmit = () => {
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
      Alert.alert("Error", "Fill all fields marked as compulsory");
      return;
    }

    setForm((prev) => ({ ...prev, category, type, productImage: image }));
    ads.push(form as any);

    Alert.alert("Data", JSON.stringify(form));
    router.push(`/marketplace?adsType=${type}`);
  };

  return (
    <View className="flex-1">
      <Header />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-3">
          <Text className="text-xl font-poppins-medium mb-3">
            Create New Ad
          </Text>
          <Text className="text-xs font-poppins mb-3">
            List your product or buying request
          </Text>

          <View className="flex-row items-center gap-x-3 mt-2">
            <Text className="text-base font-poppins">I want to: </Text>
            <CustomDropdown
              data={adsType}
              style={{
                width: 100,
                borderRadius: 5,
                backgroundColor: "#d9d9d9",
                paddingHorizontal: 6,
                paddingVertical: 4,
              }}
              value={type}
              setValue={setType}
              placeholder="Select"
            />
          </View>

          <ImageUpload image={image} setImage={setImage} />

          <Text className="font-poppins text-base">Product Details</Text>

          <Form
            category={category}
            form={form}
            handleSubmit={handleSubmit}
            setCategory={setCategory}
            setForm={setForm}
          />
        </View>
      </ScrollView>
    </View>
  );
}
