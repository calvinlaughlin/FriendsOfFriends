import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { X, Camera, Plus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { tailwind, tw } from "../../../tailwind";

interface ProfilePhotoStepProps {
  profilePhoto: string | null;
  additionalPhotos: string[];
  onImageUpload: (uri: string, isProfilePhoto: boolean) => void;
  onDeletePhoto: (index: number) => void;
}

const ProfilePhotoStep: React.FC<ProfilePhotoStepProps> = ({
  profilePhoto,
  additionalPhotos,
  onImageUpload,
  onDeletePhoto,
}) => {
  const handleImagePicker = async (isProfilePhoto: boolean) => {
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
      onImageUpload(result.assets[0].uri, isProfilePhoto);
    }
  };

  const renderPhotoSpot = (photo: string | null, index: number) => (
    <View key={index} style={tailwind`relative w-1/3 aspect-square p-1`}>
      {photo ? (
        <View style={tailwind`relative w-full h-full`}>
          <Image
            source={{ uri: photo }}
            style={tailwind`w-full h-full rounded-lg`}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => onDeletePhoto(index)}
            style={tailwind`absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1`}
          >
            <X size={16} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => handleImagePicker(false)}
          style={tailwind`w-full h-full border-2 border-dashed border-gray-300 rounded-lg justify-center items-center`}
        >
          <Plus size={24} color={tw.color("gray-400")} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={tailwind`flex-1`}>
      <View style={tailwind`p-4 pt-0`}>
        <Text style={tailwind`text-lg font-semibold mb-2`}>
          Please add at least 1 photo. The first photo will be visible to your
          known contacts on the app.
        </Text>
        <View style={tailwind`mb-4`}>
          {profilePhoto ? (
            <View style={tailwind`relative`}>
              <Image
                source={{ uri: profilePhoto }}
                style={tailwind`w-full h-60 rounded-lg`}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => onDeletePhoto(-1)}
                style={tailwind`absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2`}
              >
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => handleImagePicker(true)}
              style={tailwind`w-full h-60 border-2 border-dashed border-gray-300 rounded-lg justify-center items-center`}
            >
              <Camera size={48} color={tw.color("gray-400")} />
              <Text style={tailwind`text-gray-500 mt-2`}>
                Tap to choose a profile photo
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={tailwind`flex-row flex-wrap`}>
          {[
            ...additionalPhotos,
            ...Array(6 - additionalPhotos.length).fill(null),
          ].map((photo, index) => renderPhotoSpot(photo, index))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePhotoStep;
