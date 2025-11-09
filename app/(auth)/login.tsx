import { getCurrentUser, loginUser } from "@/api/farmhubAPI";
import { getUserFromToken } from "@/api/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true); // ⬅️ NEW

  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");
        if (token && user) {
          router.replace("/(tabs)/home");
        }
      } catch (err) {
        console.log("Token check error:", err);
      } finally {
        setCheckingToken(false); // ⬅️ Important
      }
    };
    checkLoggedIn();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email: email.trim(), password });
      
      // Backend returns: { "message": "Login successful", "token": "..." }
      const responseData: any = response.data;
      const token = responseData.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      // Save token
      await AsyncStorage.setItem("token", token);

      // Try to get user data from token or fetch from API
      let user: any = null;
      try {
        // Try to fetch current user
        user = await getCurrentUser();
      } catch (fetchError) {
        // If fetch fails, decode token to get basic info
        const tokenUser = getUserFromToken(token);
        user = {
          _id: tokenUser.id || "",
          email: tokenUser.email || email.trim(),
          name: "",
          role: "buyer" as const,
        };
      }

      // If still no user, create minimal user object
      if (!user) {
        user = {
          _id: "",
          email: email.trim(),
          name: "",
          role: "buyer" as const,
        };
      }

      await AsyncStorage.setItem("user", JSON.stringify(user));

      Alert.alert("Success", `Welcome back, ${user.name || email.trim()}!`, [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/home"),
        },
      ]);
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle error format: { "error": "..." }
      const errorMessage = 
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password. Please try again.";
      
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show spinner while checking token to prevent flicker
  if (checkingToken) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#00b894" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 justify-center gap-y-12">
            <View className="items-center">
              <Image
                source={require("../../assets/images/splash-icon.png")}
                className="w-44 h-44"
                resizeMode="contain"
              />
              <Text className="font-poppins-semibold text-3xl mt-2">
                Welcome Back!
              </Text>
            </View>

            <View>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-5"
                placeholder="Enter email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onSubmitEditing={() => passwordRef.current?.focus()}
                returnKeyType="next"
              />

              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-2"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                secureTextEntry
                ref={passwordRef}
              />

              <Text className="text-sm font-poppins text-sky-blue text-right">
                Forgot password?
              </Text>
            </View>

            <View>
              <TouchableOpacity
                className="bg-deep-green py-3 rounded-xl mb-2"
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text className="font-poppins-medium text-white text-base text-center">
                  {loading ? "Signing in..." : "Sign in"}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center">
                <Text className="text-base font-poppins">No account yet? </Text>
                <Link
                  href={"/(auth)/register?pageType=accountType"}
                  className="text-base font-poppins text-sky-blue"
                >
                  Sign up
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
