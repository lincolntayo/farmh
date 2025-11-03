import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import signedUser from "../db/signedUser.json";

const profile = require("../assets/images/profile.png");

export default function Header() {
  const user = signedUser[0] as any;
  const profileImage = user.photoID
    ? { uri: user.photoID }
    : (profile as ImageSourcePropType);

  const navBarRef = useRef<View>(null);
  const [open, setOpen] = useState(false);

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
              Hi, {user.name.split(" ")[0]}
            </Text>
            <Text className="text-sm font-poppins">
              {user.state}, {user.country}
            </Text>
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
      {open && (
        <View className="bg-white">
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
          <TouchableOpacity
            className="px-4 py-3"
            onPress={() => {
              signedUser.length = 0;
              signedUser.push({});
              router.push("/login");
            }}
          >
            <Text className="text-red-500 font-poppins-medium text-lg text-right">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
