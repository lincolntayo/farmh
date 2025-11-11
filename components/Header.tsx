import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const profileImage = user?.photoID
    ? { uri: user.photoID }
    : (profile as ImageSourcePropType);

  return (
    <>
      {/* ✅ HEADER */}
      <View className="bg-white flex-row justify-between items-center px-4 py-3 mt-0">
        <View className="flex-row gap-x-4 items-center">
          <Image source={profileImage} className="w-12 h-12 border rounded-full" />
          <View>
            <Text className="text-sm font-poppins">
              Hi, {user?.name ? user.name.split(" ")[0] : "User"}
            </Text>
            {(user?.state || user?.country) && (
              <Text className="text-sm font-poppins text-gray-600">
                {user?.state || ""}
                {user?.state && user?.country ? ", " : ""}
                {user?.country || ""}
              </Text>
            )}
          </View>
        </View>

        <View className="flex-row gap-x-6 items-center">
          {/* 🔔 Notification Bell */}
          <TouchableOpacity
            onPress={() => {
              setShowNotifications(!showNotifications);
              setOpen(false);
            }}
            style={{ position: "relative" }}
          >
            <Ionicons name="notifications-outline" size={22} color="#1E4620" />
            {/* Small dot indicator */}
            <View
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                backgroundColor: "#1E4620",
                width: 8,
                height: 8,
                borderRadius: 4,
              }}
            />
          </TouchableOpacity>

          {/* ☰ Hamburger Menu */}
          <TouchableOpacity
            onPress={() => {
              setOpen((prev) => !prev);
              setShowNotifications(false);
            }}
          >
            <MaterialIcons name="menu" size={26} color="#1E4620" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dim Background */}
      {(open || showNotifications) && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            opacity: backdropOpacity,
            zIndex: 998,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => {
              setOpen(false);
              setShowNotifications(false);
            }}
          />
        </Animated.View>
      )}

      {/* ✅ HAMBURGER MENU */}
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
          position: "absolute",
          right: 0,
          top: 0,
          width: 250,
          height: "100%",
          zIndex: 1000,
          backgroundColor: "#F9F9F9",
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          shadowColor: "#000",
          shadowOffset: { width: -2, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 6,
          paddingVertical: 20,
          justifyContent: "space-between",
        }}
        pointerEvents={open ? "auto" : "none"}
      >
        <View>
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              marginRight: 16,
              marginBottom: 24,
            }}
            onPress={() => setOpen(false)}
          >
            <AntDesign name="close" size={20} color="#4A4A4A" />
          </TouchableOpacity>

          {/* Menu Items */}
          {[
            { title: "Settings", icon: <Ionicons name="settings-outline" size={18} color="#1E4620" />, route: "/settings" },
            { title: "About Us", icon: <AntDesign name="infocircleo" size={18} color="#1E4620" />, route: "/about" },
            { title: "Support", icon: <MaterialIcons name="support-agent" size={20} color="#1E4620" />, route: "/support" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setOpen(false);
                router.push(item.route);
              }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#E6F4EA",
                borderRadius: 10,
                marginHorizontal: 16,
                paddingVertical: 10,
                paddingHorizontal: 16,
                marginBottom: 14,
              }}
            >
              <Text style={{ fontSize: 16, color: "#1E4620", fontWeight: "500" }}>
                {item.title}
              </Text>
              {item.icon}
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Actions */}
        <View style={{ marginHorizontal: 16 }}>
          {/* ✅ Switch Account */} 
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#DFF3E1",
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 16,
              marginBottom: 12,
            }}
            onPress={() => {
              setOpen(false);
              router.push("/screens/registration/signupscreen");
            }}
          >
            <Text style={{ fontSize: 16, color: "#1E4620", fontWeight: "500" }}>
              Switch Account
            </Text>
            <MaterialIcons name="compare-arrows" size={20} color="#1E4620" />
          </TouchableOpacity>

          {/* ✅ Sign Out */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#E6F4EA",
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 16,
            }}
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
            <Text style={{ fontSize: 16, color: "#E74C3C", fontWeight: "500" }}>
              Sign Out
            </Text>
            <MaterialIcons name="logout" size={20} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ✅ NOTIFICATION BUBBLE */}
      {showNotifications && (
        <View
          style={{
            position: "absolute",
            top: 60,
            right: 20,
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            width: 280,
            paddingVertical: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 1000,
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingBottom: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#EAEAEA",
            }}
          >
            <Text style={{ fontWeight: "600", color: "#1E4620" }}>Notifications</Text>
            <Text style={{ fontSize: 12, color: "#888" }}>
              You have 2 new notifications
            </Text>
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <Image
                source={profileImage}
                style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
              />
              <View>
                <Text style={{ fontSize: 13, color: "#333" }}>
                  Buyer you follow has a new request in the marketplace
                </Text>
                <Text style={{ fontSize: 11, color: "#888" }}>3 mins ago</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={profileImage}
                style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
              />
              <View>
                <Text style={{ fontSize: 13, color: "#333" }}>
                  Farmer you are following just posted an ad
                </Text>
                <Text style={{ fontSize: 11, color: "#888" }}>6 mins ago</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
