import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { History, Menu } from "lucide-react-native";
import { create } from "twrnc";
import axios, { AxiosError } from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import Profile, { ProfileProps } from "../components/Profile";
import LikeBar from "../components/LikeBar";
import { getUserId, storeUserId } from "../../backend/userStorage";

const tw = create(require("../../tailwind.config.js"));

interface UserData {
  _id: string;
  name: string;
  location: string;
  profilePhoto: string;
  age: number;
  sex: string;
  preference: string;
  school: string;
  matches: UserData[];
}

export default function DiscoverScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentMatch, setCurrentMatch] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const initializeUser = async () => {
      if (params.newUser) {
        const newUserData = JSON.parse(params.newUser as string);
        console.log("New user data:", newUserData);
        await storeUserId(newUserData._id);
        setUserData(newUserData);
        if (newUserData.matches && newUserData.matches.length > 0) {
          setCurrentMatch(newUserData.matches[0]);
        }
        setLoading(false);
      } else {
        fetchUserData();
      }
    };

    initializeUser();
  }, [params.newUser]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await getUserId();
      if (!userId) {
        router.replace("/(auth)/login");
        return;
      }

      const response = await axios.get<UserData>(
        `http://localhost:5001/api/user/${userId}`
      );
      setUserData(response.data);
      if (response.data.matches.length > 0) {
        setCurrentMatch(response.data.matches[0]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          setError(
            `Unable to fetch your data. Please try again later. (Error: ${axiosError.response.status})`
          );
        } else if (axiosError.request) {
          setError(
            "We're having trouble connecting to our servers. Please check your internet connection and try again."
          );
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      Alert.alert(
        "Oops!",
        error instanceof Error ? error.message : String(error),
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const nextMatch = () => {
    if (userData && userData.matches) {
      const currentIndex = userData.matches.findIndex(
        (match) => match._id === currentMatch?._id
      );
      const nextIndex = (currentIndex + 1) % userData.matches.length;
      setCurrentMatch(userData.matches[nextIndex]);
    }
  };

  const handleLike = () => {
    console.log("Liked");
    nextMatch();
  };

  const handleSuperLike = () => {
    console.log("Super Liked");
    nextMatch();
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#4B0082" />
        <Text style={tw`mt-4 text-lg`}>Loading your perfect matches...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-lg text-red-500 mb-4 text-center`}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-indigo-900 py-2 px-4 rounded`}
          onPress={fetchUserData}
        >
          <Text style={tw`text-white font-bold`}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userData || !currentMatch) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg`}>
          No matches available at the moment. Check back soon!
        </Text>
      </View>
    );
  }

  const profileProps: ProfileProps = {
    name: currentMatch.name,
    age: currentMatch.age,
    location: currentMatch.location,
    profilePhoto: currentMatch.profilePhoto,
    school: currentMatch.school,
  };

  return (
    <SafeAreaView
      style={tw`flex-1 bg-white ${
        Platform.OS === "android" ? `pt-[${StatusBar.currentHeight}px]` : ""
      }`}
    >
      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex-row justify-between items-center p-4`}>
          <Text style={tw`text-2xl font-bold`}>Hi {userData.name}!</Text>
          <View style={tw`flex-row gap-4`}>
            <TouchableOpacity onPress={() => console.log("History pressed")}>
              <History size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("Menu pressed")}>
              <Menu size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <Profile {...profileProps} />

        <LikeBar
          onDislike={nextMatch}
          onLike={handleLike}
          onSuperLike={handleSuperLike}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
