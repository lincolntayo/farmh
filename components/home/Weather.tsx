import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const API_KEY = "7093de8944dd7e410519125d33ae9162";

type WeatherData = {
  main: {
    temp: number;
  };
  weather: {
    main: string;
  }[];
  name: string;
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );

      const data = await response.json();
      setWeather(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <ActivityIndicator size="large" className="mt-20" />;
  if (errorMsg) return <Text className="text-red-500">{errorMsg}</Text>;
  if (!weather) return null;

  const temp = Math.round(weather.main.temp);
  const condition = weather.weather[0].main;

  const getWeatherIcon = () => {
    switch (condition) {
      case "Clouds":
        return <Ionicons name="cloud" size={60} color="#555" />;
      case "Rain":
        return <Ionicons name="rainy" size={60} color="#4A90E2" />;
      case "Clear":
        return <Ionicons name="sunny" size={60} color="#facc15" />;
      case "Thunderstorm":
        return <Ionicons name="thunderstorm" size={60} color="#f59e0b" />;
      default:
        return <Ionicons name="partly-sunny" size={60} color="#9ca3af" />;
    }
  };

  return (
    <View className="items-center p-4 bg-gray rounded-xl flex-row gap-x-6">
      <View className="">{getWeatherIcon()}</View>

      <View className="ml-6">
        <Text className="text-3xl font-poppins-medium">{temp}°C</Text>
        {/* <Text className="text-2xl font-semibold">{city}</Text> */}
        <Text className="text-base font-poppins text-gray-500 mt-1">
          {condition}
        </Text>
      </View>
    </View>
  );
}
