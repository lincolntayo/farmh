import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const defaultProfile = require("../assets/images/profile.png");

// ✅ Base backend URL (update this if your backend domain changes)
const BASE_URL = "https://farmhub-backend-26rg.onrender.com";

interface User {
  name?: string;
  state?: string;
  country?: string;
  photoID?: string;
  role?: string;
}

export default function Header() {
  const [user, setUser] = useState<User>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open]);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            setOpen(false);
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  // ✅ Correct image handling logic
  const profileImage: ImageSourcePropType =
    user?.photoID && typeof user.photoID === "string"
      ? {
          uri: user.photoID.startsWith("http")
            ? user.photoID
            : `${BASE_URL}${user.photoID}`,
        }
      : defaultProfile;

  return (
    <>
      {/* Top Header */}
      <View className="bg-white flex-row justify-between items-center px-4 py-3 mt-0">
        <View className="flex-row gap-x-4 items-center">
          <Image
            source={profileImage}
            className="w-12 h-12 rounded-full border border-gray-300"
          />
          <View>
            <Text className="text-sm font-poppins">
              Hi, {user?.name ? user.name.split(" ")[0] : "User"}
            </Text>
            {(user?.state || user?.country) && (
              <View className="flex-row items-center gap-x-1">
                <Ionicons name="location-outline" size={12} color="#666" />
                <Text className="text-xs font-poppins text-gray-600">
                  {user?.state || ""}
                  {user?.state && user?.country ? ", " : ""}
                  {user?.country || ""}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Icons */}
        <View className="flex-row gap-x-6">
          <TouchableOpacity>
            <AntDesign name="bell" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setOpen((prev) => !prev)}>
            <AntDesign name="menu" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Backdrop */}
      {open && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            opacity: backdropOpacity,
            zIndex: 999,
          }}
          pointerEvents={open ? "auto" : "none"}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          />
        </Animated.View>
      )}

      {/* Side Menu */}
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
          position: "absolute",
          right: 0,
          top: 0,
          width: "75%",
          maxWidth: 300,
          height: "100%",
          backgroundColor: "white",
          zIndex: 1000,
          shadowColor: "#000",
          shadowOffset: { width: -2, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        pointerEvents={open ? "auto" : "none"}
      >
        {/* Menu Header */}
        <View className="px-4 py-6 bg-light-green border-b border-gray-300">
          <View className="flex-row items-center gap-x-3">
            <Image
              source={profileImage}
              className="w-16 h-16 border-2 border-deep-green rounded-full"
            />
            <View className="flex-1">
              <Text className="font-poppins-medium text-lg" numberOfLines={1}>
                {user?.name || "User"}
              </Text>
              <Text className="text-xs font-poppins text-gray-600">
                {user?.role === "farmer" ? "Farmer" : "Buyer"}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="flex-1">
          <TouchableOpacity
            className="px-4 py-4 border-b border-gray-200 flex-row items-center gap-x-3"
            onPress={() => {
              setOpen(false);
              router.push("/profile");
            }}
          >
            <Feather name="user" size={20} color="#0B4812" />
            <Text className="text-gray-800 font-poppins-medium text-base">
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-4 py-4 border-b border-gray-200 flex-row items-center gap-x-3"
            onPress={() => {
              setOpen(false);
              router.push("/settings");
            }}
          >
            <Feather name="settings" size={20} color="#0B4812" />
            <Text className="text-gray-800 font-poppins-medium text-base">
              Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-4 py-4 border-b border-gray-200 flex-row items-center gap-x-3"
            onPress={() => setOpen(false)}
          >
            <Feather name="info" size={20} color="#0B4812" />
            <Text className="text-gray-800 font-poppins-medium text-base">
              About Us
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-4 py-4 border-b border-gray-200 flex-row items-center gap-x-3"
            onPress={() => setOpen(false)}
          >
            <Feather name="help-circle" size={20} color="#0B4812" />
            <Text className="text-gray-800 font-poppins-medium text-base">
              Support
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Actions */}
        <View className="border-t border-gray-300">
          <TouchableOpacity
            className="px-4 py-4 flex-row items-center gap-x-3"
            onPress={() => setOpen(false)}
          >
            <MaterialIcons name="switch-account" size={20} color="#1A73E8" />
            <Text className="text-sky-blue font-poppins-medium text-base">
              Switch Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-4 py-4 flex-row items-center gap-x-3"
            onPress={handleLogout}
          >
            <Ionicons name="exit-outline" size={20} color="#dc2626" />
            <Text className="text-red-600 font-poppins-medium text-base">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}
