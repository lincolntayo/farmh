import ImageUpload from "@/components/registration/ImageUpload";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerUser } from "../../api/farmhubAPI";

export default function UploadImageScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { formData } = useLocalSearchParams<{ formData?: string }>();
  const parsedData = formData ? JSON.parse(formData) : null;

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert("Error", "Please upload an image");
      return;
    }

    if (!parsedData) {
      Alert.alert("Error", "Missing user data, please restart registration");
      router.push("/register");
      return;
    }

    setLoading(true);
    try {
      const finalData = { ...parsedData, photoID: image };
      const res = await registerUser(finalData);

      if (res.status === 201 || res.status === 200) {
        // ✅ Handle nested response structure properly
        const responseData = res.data.data || res.data;
        const { token, user } = responseData;

        // ✅ Validate token and user before saving
        if (!token || !user) {
          throw new Error("Invalid response from server");
        }

        // ✅ Save token and user info
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        Alert.alert("Success", `Welcome ${user.name || "to FarmHub"}!`, [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home")
          }
        ]);
      } else {
        Alert.alert("Error", "Something went wrong. Try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error?.response?.data?.error 
        || error?.response?.data?.message 
        || error?.message 
        || "Something went wrong. Please try again.";
      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-end px-4 gap-y-12" edges={["top","bottom"]}>
      <View className="items-center">
        <Image source={require("../../assets/images/splash-icon.png")} className="w-44 h-44" resizeMode="contain" />
        <Text className="text-deep-green font-poppins-semibold text-3xl mt-2">FarmHub</Text>
        <Text className="text-lg text-center mt-2 font-poppins-medium">Upload an image for your account</Text>
      </View>

      <ImageUpload image={image} setImage={setImage} />

      <TouchableOpacity 
        className="bg-deep-green py-3 rounded-xl" 
        onPress={handleSubmit} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-poppins-medium text-base text-center">Sign up</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}