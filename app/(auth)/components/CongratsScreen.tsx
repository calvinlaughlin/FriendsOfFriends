import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { tailwind } from "../../../tailwind";
import { Image } from "lucide-react-native";

interface CongratsScreenProps {
  userData: {
    phoneNumber: string;
    firstName: string;
    birthday: string;
    gender: string;
    desiredGender: string;
    profilePhoto: string;
    additionalPhotos: string[];
    promptAnswers: { [key: string]: string };
    location: string;
    college: string | null;
    job: string;
    closestContacts: { name: string; phoneNumber: string }[];
    excludedContacts: { name: string; phoneNumber: string }[];
  };
}

export default function CongratsScreen({ userData }: CongratsScreenProps) {
  const router = useRouter();

  const handleContinue = () => {
    console.log(
      "Accumulated user information:",
      JSON.stringify(userData, null, 2)
    );
    router.replace({
      pathname: "/(tabs)/discover",
      params: { newUser: JSON.stringify(userData) },
    });
  };

  return (
    <SafeAreaView style={tailwind`flex-1 bg-indigo-600`}>
      <View style={tailwind`flex-1 justify-between p-6`}>
        <View style={tailwind`items-center`}>
          <View
            style={tailwind`w-24 h-24 rounded-full bg-white items-center justify-center mb-6`}
          >
            <Image size={48} color="#4F46E5" />
          </View>
          <Text style={tailwind`text-4xl font-bold text-white mb-4`}>
            Congrats!
          </Text>
          <Text style={tailwind`text-lg text-white text-center`}>
            Your account has been created successfully. You're all set to start
            connecting with friends of friends!
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleContinue}
          style={tailwind`bg-white rounded-full py-4 px-8`}
        >
          <Text
            style={tailwind`text-indigo-600 font-semibold text-center text-lg`}
          >
            Let's go
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
