import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from "react-native";
import { create } from "twrnc";
import { X, Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

const tw = create(require("../../tailwind.config.js"));

interface ProfilePhotoStepProps {
  profilePhoto: string | null;
  onImageUpload: (uri: string) => void;
  onDeletePhoto: () => void;
}

const ProfilePhotoStep: React.FC<ProfilePhotoStepProps> = ({
  profilePhoto,
  onImageUpload,
  onDeletePhoto,
}) => {
  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "You need to allow access to your photos to upload an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onImageUpload(result.assets[0].uri);
    }
  };

  return (
    <View style={tw`flex-1 justify-start`}>
      <Text style={tw`text-lg font-semibold mb-2`}>
        Please add at least 1 photo. This is the only photo that will be visible
        to your known contacts on the app.
      </Text>
      {profilePhoto ? (
        <View style={tw`relative`}>
          <Image
            source={{ uri: profilePhoto }}
            style={tw`w-full h-64 rounded-lg`}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={onDeletePhoto}
            style={tw`absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2`}
          >
            <X size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleImagePicker}
          style={tw`w-full h-64 border-2 border-dashed border-gray-300 rounded-lg justify-center items-center`}
        >
          <Camera size={48} color="#9CA3AF" />
          <Text style={tw`text-gray-500 mt-2`}>Tap to choose a photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfilePhotoStep;
