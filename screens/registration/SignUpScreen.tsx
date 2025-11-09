import Input from "@/components/registration/Input";
import { Checkbox } from "expo-checkbox";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen({ route }: any) {
  const [form, setForm] = useState({
    name: "",
    farmName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    address: "",
    accountType: "buyer",
  });

  const [isChecked, setChecked] = useState(false);

  const onChangeText = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.phoneNumber ||
      !form.country ||
      !form.state ||
      !form.address ||
      !isChecked
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if ((form.accountType === "seller" || form.accountType === "both") && !form.farmName) {
      Alert.alert("Error", "Sellers must input their farm name");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    // ✅ Navigate to UploadImageScreen with form data
    router.push({
      pathname: "/(auth)/register",
      params: { 
        pageType: "upload",
        formData: JSON.stringify(form) 
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-10" edges={["top","bottom"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1 px-4 pt-10"
      >
        <View className="flex-1 justify-center gap-y-12 pt-12">
          <View className="items-center">
            <Image
              source={require("../../assets/images/splash-icon.png")}
              className="w-44 h-44"
              resizeMode="contain"
            />
            <Text className="text-deep-green font-poppins-semibold text-3xl mt-2">FarmHub</Text>
            <Text className="text-lg text-center mt-2 font-poppins-medium">
              Create a {form.accountType === "seller" || form.accountType === "both" ? "Farmer" : "Buyer"} account
            </Text>
          </View>

          {/* Inputs */}
          <View>
            <Input label="Name" name="name" value={form.name} onChangeText={onChangeText} />
            <Input label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChangeText={onChangeText} keyboardType="phone-pad" />
            <Input label="Email" name="email" value={form.email} onChangeText={onChangeText} keyboardType="email-address" />
            <Input label="Farm Name" name="farmName" value={form.farmName} onChangeText={onChangeText} />
            <Input label="Country" name="country" value={form.country} onChangeText={onChangeText} />
            <Input label="State" name="state" value={form.state} onChangeText={onChangeText} />
            <Input label="Address" name="address" value={form.address} onChangeText={onChangeText} />
            <Input label="Password" name="password" value={form.password} onChangeText={onChangeText} secureTextEntry />
            <Input label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChangeText={onChangeText} secureTextEntry />

            <View className="flex-row items-center px-2 mt-2">
              <Checkbox value={isChecked} onValueChange={setChecked} color={isChecked ? "#1a73e8" : undefined} className="mr-2" />
              <Text className="text-base font-poppins">
                I agree with <Text className="text-sky-blue font-poppins-medium">Terms and Conditions</Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity className="bg-deep-green py-3 rounded-xl" onPress={handleSubmit}>
            <Text className="text-white font-poppins-medium text-base text-center">Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
