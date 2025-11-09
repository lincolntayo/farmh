import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const profile = require("../assets/images/profile.png");

interface User {
  name?: string;
  state?: string;
  country?: string;
  photoID?: string;
}

export default function Header() {
  const [user, setUser] = useState<User>({});
  const [loading, setLoading] = useState(true);

  const navBarRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current; // Start off-screen to the right
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (open) {
      // Slide in from right to left and fade in backdrop
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
      // Slide out to the right and fade out backdrop
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

  const profileImage = user?.photoID
    ? { uri: user.photoID }
    : (profile as ImageSourcePropType);

  return (
    <>
      <View
        className="bg-white flex-row justify-between items-center px-4 py-3 mt-0"
        ref={navBarRef}
      >
        <View className="flex-row gap-x-4">
          <Image
            source={profileImage}
            className="w-12 h-12 border rounded-full"
          />
          <View>
            <Text className="text-sm font-poppins">
              Hi, {user?.name ? user.name.split(" ")[0] : "User"}
            </Text>
            {(user?.state || user?.country) && (
              <Text className="text-sm font-poppins">
                {user?.state || ""}{user?.state && user?.country ? ", " : ""}{user?.country || ""}
              </Text>
            )}
          </View>
        </View>

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
      {/* Menu */}
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
          position: "absolute",
          right: 0,
          top: 0,
          width: "70%",
          maxWidth: 300,
          height: "100%",
          zIndex: 1000,
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: {
            width: -2,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        pointerEvents={open ? "auto" : "none"}
      >
        <TouchableOpacity
          className="px-4 py-3 border-b border-gray-200"
          onPress={() => {
            setOpen(false);
            router.push("/profile");
          }}
        >
          <Text className="text-gray-800 font-poppins-medium text-lg text-right">
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-3 border-b border-gray-200"
          onPress={() => {
            setOpen(false);
            router.push("/settings");
          }}
        >
          <Text className="text-gray-800 font-poppins-medium text-lg text-right">
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-3"
          onPress={async () => {
            try {
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Logout error:", error);
            }
          }}
        >
          <Text className="text-red-500 font-poppins-medium text-lg text-right">
            Logout
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
