import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { create } from "twrnc";
import { useRouter } from "expo-router";

const tw = create(require("../../tailwind.config.js"));

interface LoginScreenProps {
  onLogin: (phoneNumber: string) => Promise<void>;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    onLogin(phoneNumber);
  };

  const handleCreateAccount = () => {
    router.push("/(auth)/signup");
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-4`}>
      <Text style={tw`text-2xl font-bold mb-6`}>
        Welcome to FriendsOfFriends
      </Text>
      <TextInput
        style={tw`w-full border border-gray-300 rounded-md p-2 mb-4`}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity
        style={tw`bg-indigo-600 w-full rounded-md p-3 mb-4`}
        onPress={handleLogin}
      >
        <Text style={tw`text-white text-center font-semibold`}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleCreateAccount}
        style={tw`bg-white border border-indigo-600 w-full rounded-md p-3`}
      >
        <Text style={tw`text-indigo-600 text-center font-semibold`}>
          Create an account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
