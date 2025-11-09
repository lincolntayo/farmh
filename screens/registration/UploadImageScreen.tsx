import ImageUpload from "@/components/registration/ImageUpload";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginUser, registerUser } from "../../api/farmhubapi";

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
      router.push("/(auth)/register?pageType=accountType");
      return;
    }

    setLoading(true);
    try {
      // Remove confirmPassword and map accountType to role
      const { confirmPassword, accountType, ...userData } = parsedData;
      const role = accountType === "seller" ? "farmer" : accountType === "both" ? "farmer" : "buyer";
      
      const finalData = {
        ...userData,
        photoID: image,
        role: role,
      };
      
      const res = await registerUser(finalData);

      if (res.status === 201 || res.status === 200) {
        // Handle different possible response structures
        const responseData: any = res.data;
        let token: string | undefined;
        let user: any | undefined;
        
        // Try different response formats
        if (responseData.token && responseData.user) {
          // Direct format: { token, user }
          token = responseData.token;
          user = responseData.user;
        } else if (responseData.data) {
          // Nested format: { data: { token, user } }
          if (responseData.data.token && responseData.data.user) {
            token = responseData.data.token;
            user = responseData.data.user;
          } else if (responseData.data.data) {
            // Double nested: { data: { data: { token, user } } }
            token = responseData.data.data.token;
            user = responseData.data.data.user;
          }
        } else if (responseData.user) {
          // Format: { message: "...", user: {...} } - no token, need to login
          user = responseData.user;
        }

        // If we have user but no token, automatically login
        if (user && !token) {
          try {
            console.log("No token in registration response, attempting auto-login...");
            const loginResponse = await loginUser({
              email: finalData.email,
              password: finalData.password,
            });

            if (loginResponse.status === 200 || loginResponse.status === 201) {
              const loginData: any = loginResponse.data;
              
              // Extract token from login response
              if (loginData.token) {
                token = loginData.token;
              } else if (loginData.data?.token) {
                token = loginData.data.token;
              } else if (loginData.data?.data?.token) {
                token = loginData.data.data.token;
              }

              // Update user from login response if available
              if (loginData.user) {
                user = loginData.user;
              } else if (loginData.data?.user) {
                user = loginData.data.user;
              } else if (loginData.data?.data?.user) {
                user = loginData.data.data.user;
              }
            }
          } catch (loginError: any) {
            console.error("Auto-login after registration failed:", loginError);
            // Continue with registration user data even if auto-login fails
          }
        }

        // Validate token and user before saving
        if (!user) {
          console.error("Missing user in response:", {
            responseData: responseData
          });
          throw new Error("Invalid response format from server - user not found");
        }

        // Save token and user info (token might be null if auto-login failed)
        if (token) {
          await AsyncStorage.setItem("token", token);
        }
        await AsyncStorage.setItem("user", JSON.stringify(user));

        if (token) {
          Alert.alert("Success", `Welcome ${user.name || "to FarmHub"}!`, [
            {
              text: "OK",
              onPress: () => router.replace("/(tabs)/home"),
            },
          ]);
        } else {
          Alert.alert(
            "Registration Successful",
            "Account created! Please login to continue.",
            [
              {
                text: "OK",
                onPress: () => router.replace("/(auth)/login"),
              },
            ]
          );
        }
      } else {
        // Handle non-success status codes
        const responseData: any = res.data;
        const errorMessage = 
          responseData?.error ||
          responseData?.message ||
          responseData?.msg ||
          `Registration failed with status ${res.status}`;
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Extract error message
      const errorMessage = error?.response?.data?.error 
        || error?.response?.data?.message 
        || error?.response?.data?.msg
        || error?.message 
        || "Something went wrong. Please try again.";
      
      // Check if error indicates user already exists
      const errorLower = errorMessage.toLowerCase();
      const isUserExists = errorLower.includes("already exists") 
        || errorLower.includes("user already") 
        || errorLower.includes("email already")
        || errorLower.includes("already registered")
        || error?.response?.status === 409
        || error?.response?.status === 400;
      
      if (isUserExists && parsedData) {
        // Offer to login with saved credentials
        Alert.alert(
          "Account Already Exists",
          "An account with this email already exists. Would you like to sign in instead?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Sign In",
              onPress: async () => {
                setLoading(true);
                try {
                  const loginResponse = await loginUser({
                    email: parsedData.email,
                    password: parsedData.password,
                  });

                  if (loginResponse.status === 200 || loginResponse.status === 201) {
                    const loginData: any = loginResponse.data;
                    let token: string | undefined;
                    let user: any | undefined;
                    
                    // Extract token and user from login response
                    if (loginData.token) {
                      token = loginData.token;
                      user = loginData.user || loginData.data?.user;
                    } else if (loginData.data) {
                      if (loginData.data.token) {
                        token = loginData.data.token;
                        user = loginData.data.user;
                      } else if (loginData.data.data) {
                        token = loginData.data.data.token;
                        user = loginData.data.data.user;
                      }
                    }

                    if (token && user) {
                      await AsyncStorage.setItem("token", token);
                      await AsyncStorage.setItem("user", JSON.stringify(user));
                      
                      Alert.alert("Success", `Welcome back, ${user.name || "User"}!`, [
                        {
                          text: "OK",
                          onPress: () => router.replace("/(tabs)/home"),
                        },
                      ]);
                    } else {
                      throw new Error("Invalid login response format");
                    }
                  } else {
                    throw new Error("Login failed");
                  }
                } catch (loginError: any) {
                  console.error("Login error:", loginError);
                  const loginErrorMessage = 
                    loginError?.response?.data?.error ||
                    loginError?.response?.data?.message ||
                    loginError?.response?.data?.msg ||
                    loginError?.message ||
                    "Invalid email or password. Please try again.";
                  
                  Alert.alert("Login Failed", loginErrorMessage, [
                    {
                      text: "OK",
                      onPress: () => router.replace("/(auth)/login"),
                    },
                  ]);
                } finally {
                  setLoading(false);
                }
              },
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