import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface ImageUploadProps {
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ image, setImage }) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // square crop
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 🤳 Take a new photo
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <>
      <View className="flex-row items-center justify-between w-full">
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-52 h-52 rounded-full mb-4 border-2 border-gray"
          />
        ) : (
          <View className="w-52 h-52 bg-gray mb-4 items-center justify-center">
            <EvilIcons name="image" size={66} color="white" />
          </View>
        )}

        <Text className="text-base font-poppins">Upload Photo ID</Text>
      </View>

      <View className="flex-row gap-x-12 justify-center">
        <TouchableOpacity
          onPress={pickImage}
          className="bg-gray w-16 h-16 rounded-full items-center justify-center"
        >
          <Feather name="image" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={takePhoto}
          className="bg-gray w-16 h-16 rounded-full items-center justify-center"
        >
          <Feather name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ImageUpload;
