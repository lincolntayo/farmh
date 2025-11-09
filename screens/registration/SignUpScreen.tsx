// screens/registration/SignUpScreen.tsx
import Input from "@/components/registration/Input";
import { Checkbox } from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { accountType } = useLocalSearchParams<{ accountType?: string }>();
  const initialAccountType = accountType || "buyer";
  
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
    accountType: initialAccountType,
  });

  const [isChecked, setChecked] = useState(false);

  const onChangeText = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    // Validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert("Error", "Name, email, and password are required!");
      return;
    }

    if (!validateEmail(form.email)) {
      Alert.alert("Error", "Please enter a valid email address!");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long!");
      return;
    }

    const isSeller = form.accountType === "seller" || form.accountType === "both";
    
    if (isSeller && !form.farmName) {
      Alert.alert("Error", "Farm name is required for farmers!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    if (!isChecked) {
      Alert.alert("Error", "Please agree to Terms and Conditions!");
      return;
    }

    // Navigate to upload image screen
    router.push({
      pathname: "/(auth)/register",
      params: { 
        pageType: "upload",
        formData: JSON.stringify(form) 
      },
    });
  };

  const isSeller = form.accountType === "seller" || form.accountType === "both";

  return (
    <SafeAreaView className="flex-1 bg-white pt-10" edges={["top","bottom"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1 px-4 pt-10"
      >
        <View className="flex-1 justify-center gap-y-8 pt-12">
          <View className="items-center">
            <Image
              source={require("../../assets/images/splash-icon.png")}
              className="w-32 h-32"
              resizeMode="contain"
            />
            <Text className="text-deep-green font-poppins-semibold text-2xl mt-2">
              FarmHub
            </Text>
            <Text className="text-base text-center mt-1 font-poppins-medium">
              Create a {isSeller ? "Farmer" : "Buyer"} account
            </Text>
          </View>

          {/* Account Type Selector */}
          <View className="px-2">
            <Text className="text-base font-poppins-medium mb-2">Account Type</Text>
            <View className="flex-row gap-x-3">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-lg border ${
                  form.accountType === "buyer" ? "bg-deep-green border-deep-green" : "border-gray-300"
                }`}
                onPress={() => onChangeText("accountType", "buyer")}
              >
                <Text className={`text-center font-poppins-medium ${
                  form.accountType === "buyer" ? "text-white" : "text-gray-600"
                }`}>
                  Buyer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-lg border ${
                  form.accountType === "seller" ? "bg-deep-green border-deep-green" : "border-gray-300"
                }`}
                onPress={() => onChangeText("accountType", "seller")}
              >
                <Text className={`text-center font-poppins-medium ${
                  form.accountType === "seller" ? "text-white" : "text-gray-600"
                }`}>
                  Seller
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-lg border ${
                  form.accountType === "both" ? "bg-deep-green border-deep-green" : "border-gray-300"
                }`}
                onPress={() => onChangeText("accountType", "both")}
              >
                <Text className={`text-center font-poppins-medium ${
                  form.accountType === "both" ? "text-white" : "text-gray-600"
                }`}>
                  Both
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Inputs */}
          <View>
            <Input 
              label="Full Name *" 
              name="name" 
              value={form.name} 
              onChangeText={onChangeText} 
              placeholder="John Doe"
              returnKeyType="next"
              onSubmitEditing={() => {}}
            />
            
            {isSeller && (
              <Input 
                label="Farm Name *" 
                name="farmName" 
                value={form.farmName} 
                onChangeText={onChangeText}
                placeholder="Green Valley Farms"
                returnKeyType="next"
                onSubmitEditing={() => {}}
              />
            )}
            
            <Input 
              label="Phone Number" 
              name="phoneNumber" 
              value={form.phoneNumber} 
              onChangeText={onChangeText} 
              keyboardType="phone-pad"
              placeholder="+234 800 000 0000"
              returnKeyType="next"
              onSubmitEditing={() => {}}
            />
            
            <Input 
              label="Email *" 
              name="email" 
              value={form.email} 
              onChangeText={onChangeText} 
              keyboardType="email-address"
              placeholder="john@example.com"
              returnKeyType="next"
              onSubmitEditing={() => {}}
            />
            
            <Input 
              label="Country" 
              name="country" 
              value={form.country} 
              onChangeText={onChangeText}
              placeholder="Nigeria"
              returnKeyType="next"
              onSubmitEditing={() => {}}
            />
            
            <Input 
              label="State/City" 
              name="state" 
              value={form.state} 
              onChangeText={onChangeText}
              placeholder="Lagos"
              returnKeyType="next"
              onSubmitEditing={() => {}}
            />
            
            <Input 
              label="Address" 
              name="address" 
              value={form.address} 
              onChangeText={onChangeText}
              placeholder="123 Farm Road, Ikeja"
              returnKeyType="next"
              onSubmitEditing={() => {}}
            />
            
            <Input 
              label="Password *" 
              name="password" 
              value={form.password} 
              onChangeText={onChangeText} 
              secureTextEntry
              placeholder="At least 6 characters"
              returnKeyType="next"
              onSubmitEditing={() => {}}
            />
            
            <Input 
              label="Confirm Password *" 
              name="confirmPassword" 
              value={form.confirmPassword} 
              onChangeText={onChangeText} 
              secureTextEntry
              placeholder="Re-enter password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            <View className="flex-row items-center px-2 mt-2">
              <Checkbox 
                value={isChecked} 
                onValueChange={setChecked} 
                color={isChecked ? "#0B4812" : undefined} 
                className="mr-2" 
              />
              <Text className="text-sm font-poppins flex-1">
                I agree with{" "}
                <Text className="text-sky-blue font-poppins-medium">
                  Terms and Conditions
                </Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            className="bg-deep-green py-3 rounded-xl mb-8" 
            onPress={handleSubmit}
          >
            <Text className="text-white font-poppins-medium text-base text-center">
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}