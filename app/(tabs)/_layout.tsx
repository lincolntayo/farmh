import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import signedUser from "../../db/signedUser.json";

export default function Layout() {
  const insets = useSafeAreaInsets();

  if (!("name" in signedUser[0])) {
    return <Redirect href={"/login"} />;
  }

  return (
    <Tabs
      screenOptions={{
        // headerShown: false,
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
