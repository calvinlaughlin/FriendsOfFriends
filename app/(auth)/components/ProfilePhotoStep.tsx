import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { X, Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { tailwind, tw } from "../../../tailwind";

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
      alert("Permission to access camera roll is required!");
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
    <View style={tailwind`flex-1 justify-start`}>
      <Text style={tailwind`text-lg font-semibold mb-2`}>
        Please add at least 1 photo. This is the only photo that will be visible
        to your known contacts on the app.
      </Text>
      {profilePhoto ? (
        <View style={tailwind`relative`}>
          <Image
            source={{ uri: profilePhoto }}
            style={tailwind`w-full h-64 rounded-lg`}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={onDeletePhoto}
            style={tailwind`absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2`}
          >
            <X size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleImagePicker}
          style={tailwind`w-full h-64 border-2 border-dashed border-gray-300 rounded-lg justify-center items-center`}
        >
          <Camera size={48} color={tw.color("gray-400")} />
          <Text style={tailwind`text-gray-500 mt-2`}>
            Tap to choose a photo
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfilePhotoStep;
