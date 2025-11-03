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

  return (
    <View className="flex-row justify-between flex-1 mt-4">
      <View className="w-[45%]">
        <Text className="text-base font-poppins-medium mt-1">
          Product Image
        </Text>
        <Text className="text-xs font-poppins">
          Add an image to be used as your product cover photo
        </Text>
      </View>

      {image ? (
        <Image
          source={{ uri: image }}
          className="w-44 h-44 rounded-full mb-4 border-2 border-gray"
        />
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          className="w-44 h-44 bg-gray mb-4 items-center justify-center rounded-md"
        >
          <View className="border border-dashed rounded-md w-32 h-32 gap-y-1 justify-center items-center">
            <Feather name="upload" size={24} color="#979595" />
            <Text className="font-poppins text-base text-gray-600">Upload</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageUpload;
