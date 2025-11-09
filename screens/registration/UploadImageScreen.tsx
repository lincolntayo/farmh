import ImageUpload from "@/components/registration/ImageUpload";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
        const { token, user } = res.data;

        // ✅ Save token and user info
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        Alert.alert("Success", `Welcome ${user.name}!`);
        router.replace("/(tabs)/home");  // ✅ Navigate directly to home
      } else {
        Alert.alert("Error", "Something went wrong. Try again.");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Signup Failed", error?.response?.data?.error || "Something went wrong. Please try again.");
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

      <TouchableOpacity className="bg-deep-green py-3 rounded-xl" onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-poppins-medium text-base text-center">Sign up</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
