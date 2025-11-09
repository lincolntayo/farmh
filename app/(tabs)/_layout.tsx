import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const insets = useSafeAreaInsets();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setIsAuthenticated(!!token); // true if token exists
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Wait until auth check completes
  if (isAuthenticated === null) return null;

  // ✅ If not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderRadius: 5,
          width: "90%",
          margin: "auto",
          marginBottom: insets.bottom > 0 ? insets.bottom : 6,
          height: 35,
          borderColor: "black",
          borderWidth: 1,
          display: "flex",
          alignItems: "center",
          shadowColor: "transparent",
          justifyContent: "space-between",
        },
        headerStyle: {
          backgroundColor: "white",
          height: 40,
          shadowColor: "transparent",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
          tabBarIcon: () => <Feather name="home" size={14} color="black" />,
        }}
      />

      <Tabs.Screen
        name="marketplace"
        options={{
          title: "",
          tabBarIcon: () => (
            <Feather name="shopping-bag" size={14} color="black" />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarIcon: () => (
            <AntDesign name="plus-circle" size={18} color="black" />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "",
          tabBarIcon: () => (
            <FontAwesome name="heart-o" size={14} color="black" />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "",
          tabBarIcon: () => <Feather name="mail" size={14} color="black" />,
        }}
      />
    </Tabs>
  );
}
