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
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const defaultProfile = require("../assets/images/profile.png");

// 🌤️ Weather API key from your .env
const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const navBarRef = useRef<View>(null);

  // ✅ Load user info and fetch weather
  useEffect(() => {
    const init = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        await fetchWeather(parsedUser);
      } else {
        router.replace("/login");
      }
    };
    init();
  }, []);

  // ✅ Get weather by user location or device GPS
  const fetchWeather = async (userData: any) => {
    try {
      let locationName = userData?.state || userData?.city || userData?.country;

      // 🌍 If no location saved, use GPS
      if (!locationName) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Location Access Needed",
            "We need location permission to show weather."
          );
          setLoadingWeather(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;

        // Reverse geocode to get the city name
        const places = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (places?.length > 0) {
          const city = places[0].city || places[0].region || places[0].country;
          locationName = city;
        }
      }

      if (!locationName) {
        console.warn("No valid location found for weather");
        setLoadingWeather(false);
        return;
      }

      // 🌦️ Fetch weather data from OpenWeather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${WEATHER_API_KEY}&units=metric`
      );

      const data = await res.json();

      if (data?.main) {
        setWeather({
          temp: Math.round(data.main.temp),
          desc: data.weather[0].main,
          icon: data.weather[0].icon,
          city: data.name,
        });
      } else {
        console.warn("Weather fetch failed:", data);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoadingWeather(false);
    }
  };

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
        className="bg-white flex-row justify-between items-center px-4 py-3"
        ref={navBarRef}
      >
        {/* 🧍‍♂️ User Info */}
        <View className="flex-row gap-x-4 items-center">
          <Image
            source={profileImage}
            className="w-12 h-12 border rounded-full"
          />
          <View>
            <Text className="text-sm font-poppins">
              Hi, {user?.name ? user.name.split(" ")[0] : "User"}
            </Text>
            <Text className="text-xs text-gray-600 font-poppins">
              {user?.state || user?.city || user?.country || weather?.city || ""}
            </Text>
          </View>
        </View>

        {/* 🌤️ Weather + Icons */}
        <View className="flex-row items-center gap-x-4">
          {loadingWeather ? (
            <ActivityIndicator size="small" color="gray" />
          ) : weather ? (
            <View className="flex-row items-center gap-x-1">
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
                }}
                style={{ width: 25, height: 25 }}
              />
              <View>
                <Text className="text-sm font-poppins">{weather.temp}°C</Text>
                <Text className="text-xs text-gray-600 font-poppins">
                  {weather.desc}
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-xs text-gray-400 font-poppins">
              Weather N/A
            </Text>
          )}

          {/* Notification + Menu */}
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
          <Link href={"/profile"} className="px-4 py-3 border-b border-gray-200">
            <Text className="text-gray-800 font-poppins-medium text-lg text-right">
              Profile
            </Text>
          </Link>
          <Link href={"/settings"} className="px-4 py-3 border-b border-gray-200">
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
