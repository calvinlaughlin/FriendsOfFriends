import React from "react";
import { View, Text, Image } from "react-native";
import { User } from "lucide-react-native";
import { create } from "twrnc";

const tw = create(require("../tailwind.config.js"));

interface ProfileProps {
  name: string;
  age: number;
  location: string;
  profilePhoto: string;
}

export default function Profile({
  name,
  age,
  location,
  profilePhoto,
}: ProfileProps) {
  return (
    <View style={tw`items-start justify-center p-4`}>
      <Image
        source={{ uri: profilePhoto }}
        style={tw`w-[300px] h-[400px] rounded-lg self-center`}
      />
      <Text style={tw`text-2xl font-bold mt-4`}>
        {name}, {age}
      </Text>
      <Text style={tw`text-lg text-gray-600`}>{location}</Text>
      <View style={tw`flex-row items-center mt-2`}>
        <User size={24} color="#000" />
        <Text style={tw`ml-2 text-lg text-blue-500`}>11</Text>
      </View>
    </View>
  );
}
