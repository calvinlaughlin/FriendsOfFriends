import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { tailwind } from "../../../tailwind";

interface CongratsScreenProps {
  userData: any;
  onComplete: () => void;
}

export default function CongratsScreen({
  userData,
  onComplete,
}: CongratsScreenProps) {
  return (
    <View
      style={tailwind`flex-1 justify-center items-center bg-indigo-900 p-4`}
    >
      <Text style={tailwind`text-4xl font-bold text-white mb-4`}>
        Congratulations!
      </Text>
      <Text style={tailwind`text-xl text-white text-center mb-8`}>
        Your profile is all set up, {userData.firstName}!
      </Text>
      <TouchableOpacity
        style={tailwind`bg-white rounded-full py-3 px-8`}
        onPress={onComplete}
      >
        <Text style={tailwind`text-indigo-900 font-semibold text-lg`}>
          Let's Go!
        </Text>
      </TouchableOpacity>
    </View>
  );
}
