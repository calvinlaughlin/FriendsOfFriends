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

// Dummy data for visualization
const dummyMatches: UserData[] = [
  {
    _id: "1",
    name: "Alice",
    location: "New York, NY",
    profilePhoto:
      "https://st3.depositphotos.com/9998432/13335/v/380/depositphotos_133351974-stock-illustration-default-placeholder-woman.jpg",
    age: 25,
    sex: "Female",
    preference: "Male",
    school: "NYU",
    matches: [],
  },
  {
    _id: "2",
    name: "Bob",
    location: "Los Angeles, CA",
    profilePhoto:
      "https://media.istockphoto.com/id/1130424979/vector/person-gray-photo-placeholder-man.jpg?s=612x612&w=0&k=20&c=Oc5r-nuA8FxnBBFSa6azLq5bWDyPZlKNu-8qFrUDy5I=",
    age: 28,
    sex: "Male",
    preference: "Female",
    school: "UCLA",
    matches: [],
  },
  {
    _id: "3",
    name: "Charlie",
    location: "Chicago, IL",
    profilePhoto:
      "https://iidamidamerica.org/wp-content/uploads/2020/12/male-placeholder-image.jpeg",
    age: 23,
    sex: "Male",
    preference: "Female",
    school: "University of Chicago",
    matches: [],
  },
];

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
        setUserData({ ...newUserData, matches: dummyMatches });
        setCurrentMatch(dummyMatches[0]);
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

      // Simulating API call with dummy data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const dummyUserData: UserData = {
        _id: userId,
        name: "Calvin",
        location: "San Francisco, CA",
        profilePhoto:
          "https://st3.depositphotos.com/9998432/13335/v/380/depositphotos_133351974-stock-illustration-default-placeholder-woman.jpg",
        age: 30,
        sex: "Male",
        preference: "Female",
        school: "Stanford",
        matches: dummyMatches,
      };
      setUserData(dummyUserData);
      setCurrentMatch(dummyMatches[0]);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("An unexpected error occurred. Please try again.");
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
