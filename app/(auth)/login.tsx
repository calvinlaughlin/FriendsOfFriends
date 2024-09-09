import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { create } from "twrnc";

// Create a new instance of tailwind
const tw = create(require("../tailwind.config.js"));

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (phoneNumber.length >= 10) {
      console.log("Logging in with phone number:", phoneNumber);
      router.replace("/(tabs)/discover");
    } else {
      console.error("Invalid phone number");
    }
  };

  const handleCreateAccount = () => {
    router.push("/signup");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <View
          style={tw`flex-1 px-4 pt-${
            Platform.OS === "android" ? "8" : "0"
          } justify-between`}
        >
          <View style={tw`items-center mt-12`}>
            <View style={tw`w-24 h-24 rounded-full bg-gray-200 mb-8`}>
              <Image
                source={{ uri: "https://placekitten.com/96/96" }}
                style={tw`w-full h-full rounded-full`}
              />
            </View>
            <TextInput
              style={tw`w-full border border-gray-300 rounded-md p-3 mb-4`}
              placeholder="Mobile phone"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TouchableOpacity
              style={tw`w-full bg-indigo-600 rounded-md p-3 items-center`}
              onPress={handleLogin}
            >
              <Text style={tw`text-white font-semibold`}>Login</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={tw`w-full border border-indigo-600 rounded-md p-3 items-center mb-8`}
            onPress={handleCreateAccount}
          >
            <Text style={tw`text-indigo-600 font-semibold`}>
              Create a new account
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
