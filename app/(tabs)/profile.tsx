import React from "react";
import { View, Text, Image } from "react-native";
import { create } from "twrnc";

const tw = create(require("../../tailwind.config.js"));

export interface ProfileProps {
  name: string;
  age: number;
  location: string;
  profilePhoto: string;
  school: string;
}

export default function Profile({
  name,
  age,
  location,
  profilePhoto,
  school,
}: ProfileProps) {
  return (
    <View style={tw`p-4`}>
      <Image
        source={{ uri: profilePhoto }}
        style={tw`w-full h-80 rounded-lg mb-4`}
      />
      <Text style={tw`text-2xl font-bold mb-2`}>
        {name}, {age}
      </Text>
      <Text style={tw`text-gray-600 mb-2`}>{location}</Text>
      <Text style={tw`text-gray-600`}>{school}</Text>
    </View>
  );
}
