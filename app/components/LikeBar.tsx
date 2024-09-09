import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Heart } from "lucide-react-native";
import { create } from "twrnc";

const tw = create(require("../tailwind.config.js"));

interface LikeBarProps {
  onDislike: () => void;
  onLike: () => void;
  onSuperLike: () => void;
}

export default function LikeBar({
  onDislike,
  onLike,
  onSuperLike,
}: LikeBarProps) {
  return (
    <View style={tw`flex-row justify-center gap-4 mb-4`}>
      <TouchableOpacity
        style={tw`w-15 h-15 rounded-full bg-gray-200 justify-center items-center`}
        onPress={onDislike}
      >
        <Text style={tw`text-2xl`}>✕</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`w-15 h-15 rounded-full bg-gray-200 justify-center items-center`}
        onPress={onLike}
      >
        <Text style={tw`text-2xl`}>☺</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`w-15 h-15 rounded-full bg-indigo-900 justify-center items-center`}
        onPress={onSuperLike}
      >
        <Heart size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
