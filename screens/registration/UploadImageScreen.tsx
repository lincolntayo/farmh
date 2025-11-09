import ImageUpload from "@/components/registration/ImageUpload";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser, loginUser, registerUser } from "../../api/farmhubAPI";
import { getUserFromToken } from "../../api/utils";

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
      // Remove confirmPassword and map accountType to role
      const { confirmPassword, accountType, ...userData } = parsedData;
      const role = accountType === "seller" ? "farmer" : accountType === "both" ? "farmer" : "buyer";
      
      // Backend User schema: name, email, password, role (required)
      // Other fields might be optional or need to be sent separately
      const finalData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: role as "farmer" | "buyer" | "admin",
        // Include optional fields if backend accepts them
        phoneNumber: userData.phoneNumber,
        farmName: userData.farmName,
        country: userData.country,
        state: userData.state,
        address: userData.address,
        photoID: image,
      };

      const res = await registerUser(finalData);

      if (res.status === 201 || res.status === 200) {
        // Backend returns: { "message": "...", "token": "..." } or { "token": "..." }
        const responseData: any = res.data;
        let token: string | undefined = responseData.token;

        // If no token, try to login
        if (!token) {
          try {
            const loginResponse = await loginUser({
              email: finalData.email,
              password: finalData.password,
            });
            if (loginResponse.status === 200 || loginResponse.status === 201) {
              token = loginResponse.data.token;
            }
          } catch (loginError) {
            console.error("Auto-login failed:", loginError);
          }
        }

        if (!token) {
          throw new Error("No token received from server");
        }

        // Save token
        await AsyncStorage.setItem("token", token);

        // Try to get user data
        let user: any = null;
        try {
          user = await getCurrentUser();
        } catch (fetchError) {
          // If fetch fails, decode token to get basic info
          const tokenUser = getUserFromToken(token);
          user = {
            _id: tokenUser.id || "",
            email: tokenUser.email || finalData.email,
            name: finalData.name || "",
            role: finalData.role || "buyer",
            phoneNumber: finalData.phoneNumber,
            farmName: finalData.farmName,
            country: finalData.country,
            state: finalData.state,
            address: finalData.address,
            photoID: finalData.photoID,
          };
        }

        // If still no user, create from form data
        if (!user) {
          user = {
            _id: "",
            email: finalData.email,
            name: finalData.name || "",
            role: finalData.role || "buyer",
            phoneNumber: finalData.phoneNumber,
            farmName: finalData.farmName,
            country: finalData.country,
            state: finalData.state,
            address: finalData.address,
            photoID: finalData.photoID,
          };
        }

        await AsyncStorage.setItem("user", JSON.stringify(user));

        Alert.alert("Success", `Welcome ${user.name || "to FarmHub"}!`, [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home"),
          },
        ]);
      } else {
        Alert.alert("Error", "Something went wrong. Try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle error format: { "error": "..." }
      const errorMessage = 
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      
      // Check if error indicates user already exists
      const errorLower = errorMessage.toLowerCase();
      const isUserExists = errorLower.includes("already exists") 
        || errorLower.includes("email already")
        || error?.response?.status === 409
        || (error?.response?.status === 400 && errorLower.includes("email"));
      
      if (isUserExists && parsedData) {
        Alert.alert(
          "Account Already Exists",
          "An account with this email already exists. Please sign in instead.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(auth)/login"),
            },
          ]
        );
      } else {
        Alert.alert("Signup Failed", errorMessage);
      }
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
