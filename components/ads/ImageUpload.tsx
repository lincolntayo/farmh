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
    <View className="mt-4">
      <Text className="text-base font-poppins-medium mb-1">
        Product Image
      </Text>
      <Text className="text-xs font-poppins text-gray-500 mb-3">
        Add up to 5 images. First image will be the cover photo.
      </Text>

      {image ? (
        <View className="relative">
          <Image
            source={{ uri: image }}
            className="w-full h-64 rounded-md mb-4"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={pickImage}
            className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
          >
            <Feather name="edit-2" size={16} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-md items-center justify-center bg-gray/30"
        >
          <View className="items-center gap-y-2">
            <Feather name="upload" size={32} color="#979595" />
            <Text className="font-poppins text-base text-gray-600">Upload</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageUpload;
