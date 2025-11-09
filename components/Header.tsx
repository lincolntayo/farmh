import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultProfile = require("../assets/images/profile.png");

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const navBarRef = useRef<View>(null);

  // Load logged-in user from AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.replace("/login");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  if (!user) {
    return (
      <View className="flex-row justify-between items-center px-4 py-3 bg-white">
        <ActivityIndicator size="small" color="green" />
      </View>
    );
  }

  const profileImage: ImageSourcePropType = user.photoID
    ? { uri: user.photoID }
    : defaultProfile;

  return (
    <>
      <View
        className="bg-white flex-row justify-between items-center px-4 py-3 mt-0"
        ref={navBarRef}
      >
        {/* User Info */}
        <View className="flex-row gap-x-4">
          <Image
            source={profileImage}
            className="w-12 h-12 border rounded-full"
          />
          <View>
            <Text className="text-sm font-poppins">
              Hi, {user.name.split(" ")[0]}
            </Text>
            <Text className="text-sm font-poppins">
              {user.state}, {user.country}
            </Text>
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

      {/* Dropdown Menu */}
      {open && (
        <View className="bg-white shadow-lg">
          <Link
            href={"/profile"}
            className="px-4 py-3 border-b border-gray-200"
          >
            <Text className="text-gray-800 font-poppins-medium text-lg text-right">
              Profile
            </Text>
          </Link>
          <Link
            href={"/settings"}
            className="px-4 py-3 border-b border-gray-200"
          >
            <Text className="text-gray-800 font-poppins-medium text-lg text-right">
              Settings
            </Text>
          </Link>
          <TouchableOpacity className="px-4 py-3" onPress={handleLogout}>
            <Text className="text-red-500 font-poppins-medium text-lg text-right">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
