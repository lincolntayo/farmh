import { Link } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Auth() {
  return (
    <SafeAreaView className="flex-1 bg-white justify-between pb-32 px-4">
      <View className="items-center mt-60">
        <Image
          source={require("../assets/images/splash-icon.png")}
          className="w-44 h-44"
          resizeMode="contain"
        />
        <Text className="text-deep-green font-poppins-semibold text-3xl mt-2">
          FarmHub
        </Text>
      </View>

      <View>
        <Link
          href={"/(auth)/login"}
          className="bg-gray text-base font-poppins-medium text-center py-3 rounded-xl"
        >
          Sign in
        </Link>

        <Link
          href={"/(auth)/register?pageType=accountType"}
          className="bg-deep-green text-white mt-10 text-base font-poppins-medium text-center py-3 rounded-xl"
        >
          Sign up
        </Link>
      </View>
    </SafeAreaView>
  );
}
