import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { tailwind } from "../../../tailwind";
import { Image } from "lucide-react-native";

interface CongratsScreenProps {
  onContinue: () => void;
}

export default function CongratsScreen({ onContinue }: CongratsScreenProps) {
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
            Thank you for joining our app!
          </Text>
        </View>
        <TouchableOpacity
          onPress={onContinue}
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
