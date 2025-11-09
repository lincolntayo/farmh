import { loginUser } from "@/api/farmhubapi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Redirect, router } from "expo-router";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      if (token && user) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setCheckingAuth(false);
    }
  };

  if (checkingAuth) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#1a73e8" />
      </SafeAreaView>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email: email.trim(), password });
      
      // Log the full response for debugging
      console.log("Login response status:", response.status);
      console.log("Login response data:", JSON.stringify(response.data, null, 2));
      
      // Check if response is successful
      if (response.status === 200 || response.status === 201) {
        // Handle different possible response structures
        // Type assertion to handle different API response formats
        const responseData: any = response.data;
        let token: string | undefined;
        let user: any | undefined;
        
        // Try different response formats
        if (responseData.token) {
          // Direct format: { token, user } or { message: "...", token, user }
          token = responseData.token;
          user = responseData.user || responseData.data?.user;
        } else if (responseData.data) {
          // Nested format: { data: { token, user } }
          if (responseData.data.token) {
            token = responseData.data.token;
            user = responseData.data.user;
          } else if (responseData.data.data) {
            // Double nested: { data: { data: { token, user } } }
            token = responseData.data.data.token;
            user = responseData.data.data.user;
          }
        }

        if (!token) {
          console.error("Missing token in login response:", {
            hasToken: !!token,
            hasUser: !!user,
            responseData: responseData
          });
          throw new Error("Login successful but no authentication token received from server");
        }

        if (!user) {
          console.error("Missing user in login response:", {
            hasToken: !!token,
            hasUser: !!user,
            responseData: responseData
          });
          // If we have token but no user, we can still proceed (user might be in token)
          // But we should try to extract user info
          user = { email: email.trim() }; // Fallback user object
        }

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        
        Alert.alert("Success", `Welcome back, ${user.name || "User"}!`, [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home"),
          },
        ]);
      } else {
        // Handle non-success status codes
        const responseData: any = response.data;
        const errorMessage = 
          responseData?.error ||
          responseData?.message ||
          responseData?.msg ||
          `Login failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      console.error("Error response:", error?.response?.data);
      
      // Better error message extraction
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error?.response?.data) {
        errorMessage = 
          error.response.data.error ||
          error.response.data.message ||
          error.response.data.msg ||
          errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white  px-4">
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

            <View className="">
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
                className="bg-deep-green text-white  py-3 rounded-xl mb-2"
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
