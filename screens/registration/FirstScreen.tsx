import RadioButton from "@/components/RadioButton";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const options = [
  {
    label: "Seller",
    value: "seller",
    description: "To showcase and sell my farm produce",
  },
  {
    label: "Buyer",
    value: "buyer",
    description: "To buy fresh farm produce",
  },
  {
    label: "Both",
    value: "both",
    description: "To buy and sell farm produce",
  },
];

export default function FirstScreen() {
  const [selected, setSelected] = useState<string>("");

  const handleSubmit = () => {
    if (selected === "") {
      Alert.alert("Error", "Please select an account type!");
      return;
    }

    // ✅ Navigate to SignUpScreen with accountType as a route param
    router.push({
      pathname: "/register",
      params: { pageType: "form", accountType: selected },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-end pb-32 px-4 gap-y-12">
      <View className="items-center">
        <Image
          source={require("../../assets/images/splash-icon.png")}
          className="w-44 h-44"
          resizeMode="contain"
        />
        <Text className="text-deep-green font-poppins-semibold text-3xl mt-2">
          FarmHub
        </Text>
        <Text className="text-lg text-center mt-2 font-poppins">
          Tell us how you would like to use FarmHub
        </Text>
      </View>

      <View className="flex">
        {options.map((option, index) => (
          <RadioButton
            key={index}
            description={option.description}
            label={option.label}
            selected={selected}
            value={option.value}
            setSelected={setSelected}
          />
        ))}
      </View>

      <TouchableOpacity
        className="bg-deep-green text-white py-3 rounded-xl"
        onPress={handleSubmit}
      >
        <Text className="font-poppins-medium text-white text-base text-center">
          Next
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
