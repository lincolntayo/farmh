import ImageUpload from "@/components/registration/ImageUpload";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import pendingUser from "../../db/pendingUsers.json";
import signedUser from "../../db/signedUser.json";
import users from "../../db/users.json";

export default function UploadImageScreen() {
  const [image, setImage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!image) {
      Alert.alert("Error", "Please upload an image");
      return;
    }
    const completedData = { ...pendingUser[0], photoID: image };

    users.push(completedData as any);
    signedUser.length = 0;
    signedUser.push(completedData);
    pendingUser.length = 0;

    router.push("/home");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white justify-end px-4 gap-y-12"
      edges={["top", "bottom"]}
    >
      <View className="items-center">
        <Image
          source={require("../../assets/images/splash-icon.png")}
          className="w-44 h-44"
          resizeMode="contain"
        />
        <Text className="text-deep-green font-poppins-semibold text-3xl mt-2">
          FarmHub
        </Text>
        <Text className="text-lg text-center mt-2 font-poppins-medium">
          Upload an image for your account
        </Text>
      </View>

      <ImageUpload image={image} setImage={setImage} />

      <TouchableOpacity
        className="bg-deep-green text-white  py-3 rounded-xl"
        onPress={handleSubmit}
      >
        <Text className="font-poppins-medium text-white text-base text-center">
          Sign up
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-base font-poppins">Already have an account?</Text>
        <Link
          href="/login"
          className="font-poppins-medium text-sky-blue text-base"
        >
          Sign in
        </Link>
      </View>
    </SafeAreaView>
  );
}
