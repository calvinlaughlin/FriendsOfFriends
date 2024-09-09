import React from "react";
import { View, Text } from "react-native";
import { create } from "twrnc";

const tw = create(require("../../tailwind.config.js"));

export default function SearchScreen() {
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-2xl font-bold`}>Search Screen</Text>
    </View>
  );
}
