// screens/registration/UploadImageScreen.tsx
import ImageUpload from "@/components/registration/ImageUpload";
import { loginUser, registerUser } from "@/api/farmhubapi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UploadImageScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { formData } = useLocalSearchParams<{ formData?: string }>();
  const parsedData = formData ? JSON.parse(formData) : null;

  const handleSkip = async () => {
    Alert.alert(
      "Skip Photo Upload",
      "You can add a profile photo later from settings. Continue without photo?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => handleSubmit(true) }
      ]
    );
  };

  const handleSubmit = async (skipImage = false) => {
    if (!skipImage && !image) {
      Alert.alert("Error", "Please upload a profile image or skip");
      return;
    }

    if (!parsedData) {
      Alert.alert("Error", "Missing user data, please restart registration");
      router.push("/(auth)/register?pageType=accountType");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, accountType, ...userData } = parsedData;
      
      // Map accountType to role
      let role: "farmer" | "buyer" = "buyer";
      if (accountType === "seller" || accountType === "both") {
        role = "farmer";
      }
      
      const registrationData = {
        ...userData,
        role,
        email: userData.email.trim().toLowerCase(),
        photoID: image || undefined,
      };
      
      console.log("Registering user with data:", { ...registrationData, password: "***" });
      
      const res = await registerUser(registrationData);

      if (res.status === 201 || res.status === 200) {
        const { token, user } = res.data;
        
        if (!token) {
          // If no token, try to login
          console.log("No token received, attempting auto-login...");
          const loginResponse = await loginUser({
            email: registrationData.email,
            password: userData.password,
          });
          
          if (loginResponse.status === 200 || loginResponse.status === 201) {
            const loginData = loginResponse.data;
            await AsyncStorage.setItem("token", loginData.token);
            await AsyncStorage.setItem("user", JSON.stringify(loginData.user));
            
            Alert.alert("Success", `Welcome to FarmHub, ${loginData.user.name}!`, [
              {
                text: "OK",
                onPress: () => router.replace("/(tabs)/home"),
              },
            ]);
            return;
          }
        }

        // Save token and user info
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        Alert.alert("Success", `Welcome to FarmHub, ${user.name}!`, [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home"),
          },
        ]);
      }
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message);
      
      const errorMessage = error?.response?.data?.message 
        || error?.response?.data?.error 
        || error?.message 
        || "Registration failed. Please try again.";
      
      const errorLower = errorMessage.toLowerCase();
      const isUserExists = errorLower.includes("already exists") 
        || errorLower.includes("email already")
        || error?.response?.status === 409;
      
      if (isUserExists && parsedData) {
        Alert.alert(
          "Account Already Exists",
          "An account with this email already exists. Would you like to sign in instead?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Sign In",
              onPress: async () => {
                try {
                  setLoading(true);
                  const loginResponse = await loginUser({
                    email: parsedData.email.trim().toLowerCase(),
                    password: parsedData.password,
                  });

                  if (loginResponse.status === 200 || loginResponse.status === 201) {
                    const { token, user } = loginResponse.data;
                    
                    await AsyncStorage.setItem("token", token);
                    await AsyncStorage.setItem("user", JSON.stringify(user));
                    
                    Alert.alert("Success", `Welcome back, ${user.name}!`, [
                      {
                        text: "OK",
                        onPress: () => router.replace("/(tabs)/home"),
                      },
                    ]);
                  }
                } catch (loginError: any) {
                  Alert.alert(
                    "Login Failed", 
                    loginError?.response?.data?.message || "Please try again from the login screen"
                  );
                  router.replace("/(auth)/login");
                } finally {
                  setLoading(false);
                }
              },
            },
          ]
        );
      } else {
        Alert.alert("Registration Failed", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-between px-4 py-8" edges={["top","bottom"]}>
      <View className="items-center mt-8">
        <Image 
          source={require("../../assets/images/splash-icon.png")} 
          className="w-32 h-32" 
          resizeMode="contain" 
        />
        <Text className="text-deep-green font-poppins-semibold text-2xl mt-2">
          FarmHub
        </Text>
        <Text className="text-base text-center mt-2 font-poppins-medium px-4">
          Upload a profile photo for your account
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <ImageUpload image={image} setImage={setImage} />
      </View>

      <View className="gap-y-3">
        <TouchableOpacity 
          className="bg-deep-green py-3 rounded-xl" 
          onPress={() => handleSubmit(false)} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-poppins-medium text-base text-center">
              Complete Registration
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          className="py-3 rounded-xl border border-gray-300" 
          onPress={handleSkip}
          disabled={loading}
        >
          <Text className="text-gray-600 font-poppins-medium text-base text-center">
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}