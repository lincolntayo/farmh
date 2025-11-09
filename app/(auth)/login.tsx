// app/(auth)/login.tsx
import { loginUser } from "@/api/farmhubapi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Redirect, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const passwordRef = useRef<TextInput>(null);

  // Check if user is already authenticated
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      if (token && user) setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setCheckingAuth(false);
    }
  };

  if (checkingAuth) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0B4812" />
      </SafeAreaView>
    );
  }

  if (isAuthenticated) return <Redirect href="/(tabs)/home" />;

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.status === 200 || response.status === 201) {
        const { token, user } = response.data;

        if (!token) throw new Error("No authentication token received");

        await AsyncStorage.setItem("token", token);

        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } else {
          console.warn("User object missing in login response");
        }

        Alert.alert("Success", `Welcome back, ${user?.name || "User"}!`, [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home"),
          },
        ]);
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);

      let errorMessage = "Unable to connect. Please check your network or API URL.";

      if (error.response?.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          "Login failed. Check credentials.";
      } else if (error.message) {
        errorMessage = error.message.includes("Network Error")
          ? "Network Error: Unable to reach the server."
          : error.message;
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
            {/* Logo & Heading */}
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

            {/* Form */}
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
                secureTextEntry
                ref={passwordRef}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
              />
              <Text className="text-sm font-poppins text-sky-blue text-right">
                Forgot password?
              </Text>
            </View>

            {/* Buttons */}
            <View>
              <TouchableOpacity
                className="bg-deep-green text-white py-3 rounded-xl mb-2"
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="font-poppins-medium text-white text-base text-center">
                    Sign in
                  </Text>
                )}
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
