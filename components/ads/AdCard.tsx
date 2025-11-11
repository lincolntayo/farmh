import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { saveAd, deleteSavedAd, getSavedAds } from "@/api/farmhubapi";

interface AdCardProps {
  _id?: string;
  productImage?: string;
  type: string;
  productName: string;
  category: string;
  location: string;
  quantity: number;
  description: string;
  priceFrom: number;
  priceTo: number;
  availableFrom: string;
  availableUntil: string;
  unit: string;
}

const images = {
  1: require("../../assets/images/image-1.png"),
  2: require("../../assets/images/image-2.png"),
  3: require("../../assets/images/image-3.png"),
  4: require("../../assets/images/image-4.png"),
  5: require("../../assets/images/image-5.png"),
};

export default function AdCard({
  adsData,
  imageId,
}: {
  adsData: AdCardProps;
  imageId: number;
}) {
  const [added, setAdded] = useState(false);
  const randomImage = images[imageId as 1 | 2 | 3 | 4 | 5];
  const image = adsData.productImage ? { uri: adsData.productImage } : randomImage;

  useEffect(() => {
    // Optionally, you can check if this ad is already saved
    const fetchSaved = async () => {
      try {
        const res = await getSavedAds();
        const exists = res.data.some((item) => item._id === adsData._id);
        setAdded(exists);
      } catch (error) {
        console.log("Error checking saved ads:", error);
      }
    };
    fetchSaved();
  }, []);

  const addToFavorites = async () => {
    try {
      if (!added) {
        await saveAd(adsData);
        Alert.alert("Saved", "This product has been added to your saved ads.");
      } else {
        if (adsData._id) await deleteSavedAd(adsData._id);
        Alert.alert("Removed", "This product has been removed from your saved ads.");
      }
      setAdded((prev) => !prev);
    } catch (error) {
      console.error("Error updating saved ads:", error);
      Alert.alert("Error", "Could not update saved ads. Try again later.");
    }
  };

  return (
    <View className="bg-gray p-1.5 pr-3 pb-3 rounded-md">
      <View className="flex-row gap-x-2">
        <Image source={image} className="w-28 h-28 rounded-md" />

        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-poppins-semibold">
              {adsData.productName}
            </Text>
            <Text className="text-xs font-poppins text-sky-blue">Organic</Text>
          </View>

          <Text className="text-xs font-poppins flex-shrink">
            {adsData.description}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="font-poppins-medium text-sm mt-1">
          ₦{adsData.priceFrom} - ₦{adsData.priceTo}
        </Text>

        <View className="flex-row gap-x-1 items-center">
          <EvilIcons name="location" size={16} color="black" />
          <Text className="text-sm font-poppins-medium text-right mt-1">
            {adsData.location}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <Text className="font-poppins text-xs mt-1">
          Up to{" "}
          <Text className="font-poppins-bold">
            {adsData.quantity} {adsData.unit}
          </Text>{" "}
          available
        </Text>

        <TouchableOpacity onPress={addToFavorites}>
          <FontAwesome
            name={added ? "heart" : "heart-o"}
            size={18}
            color={added ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
