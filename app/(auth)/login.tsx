import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { create } from "twrnc";
import { useRouter } from "expo-router";
import axios from "axios";
import { storeUserId } from "../../backend/userStorage";

const tw = create(require("../../tailwind.config.js"));

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    setLoading(true);
    try {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber.trim());
      const response = await axios.post("http://localhost:5001/api/login", {
        phoneNumber: formattedPhoneNumber,
      });

      if (response.data && response.data._id) {
        await storeUserId(response.data._id);
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          // If onLoginSuccess is not provided, navigate to the main app screen
          router.replace("/(tabs)/discover");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        Alert.alert(
          "Account Not Found",
          "We couldn't find an account with this phone number. Would you like to create a new account?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Create Account",
              onPress: handleCreateAccount,
            },
          ]
        );
      } else {
        Alert.alert(
          "Login Error",
          "We couldn't log you in. Please check your phone number and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push("/(auth)/signup");
  };

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+1${match[1]}${match[2]}${match[3]}`;
    }
    return number;
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-4 bg-white`}>
      <Text style={tw`text-3xl font-bold mb-8 text-indigo-600`}>
        FriendsOfFriends
      </Text>
      <Text style={tw`text-xl mb-6 text-center`}>
        Connect with friends of friends and expand your social circle
      </Text>
      <TextInput
        style={tw`w-full border border-gray-300 rounded-md p-4 mb-4 text-lg`}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        editable={!loading}
      />
      <TouchableOpacity
        style={tw`bg-indigo-600 w-full rounded-md p-4 mb-4 flex-row justify-center items-center ${
          loading ? "opacity-50" : ""
        }`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" style={tw`mr-2`} /> : null}
        <Text style={tw`text-white text-center font-semibold text-lg`}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleCreateAccount}
        style={tw`bg-white border border-indigo-600 w-full rounded-md p-4`}
        disabled={loading}
      >
        <Text style={tw`text-indigo-600 text-center font-semibold text-lg`}>
          Create an account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
