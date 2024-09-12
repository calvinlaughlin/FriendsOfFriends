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
  Image,
  Dimensions,
} from "react-native";
import {
  History,
  Menu,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  X,
} from "lucide-react-native";
import { create } from "twrnc";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { getUserId } from "../../backend/userStorage";

const tw = create(require("../../tailwind.config.js"));

interface UserData {
  _id: string;
  firstName: string;
  age: number;
  location: string;
  profilePhoto: string;
  college: string;
  job: string;
  promptAnswers: Record<string, string>;
  additionalPhotos: string[];
  mutualConnections: number;
}

const useViewportHeight = () => {
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const { height } = Dimensions.get("window");
    const tabBarHeight = 148;
    const headerHeight = 60;
    const buttonAreaHeight = 80;
    setViewportHeight(height - tabBarHeight - headerHeight - buttonAreaHeight);
  }, []);

  return viewportHeight;
};

export default function Component() {
  const [potentialMatches, setPotentialMatches] = useState<UserData[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [loggedInUserName, setLoggedInUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const viewportHeight = useViewportHeight();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userId = await getUserId();
        if (!userId) {
          throw new Error("No user ID found. Please log in again.");
        }
        const [userResponse, matchesResponse] = await Promise.all([
          axios.get(`http://localhost:5001/api/user/${userId}`),
          axios.get(
            `http://localhost:5001/api/users/${userId}/potential-matches`
          ),
        ]);
        setLoggedInUserName(userResponse.data.firstName);
        setPotentialMatches(matchesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing user data:", error);
        setError("Failed to fetch user data. Please try again.");
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const handleLikeDislike = (action: "like" | "dislike") => {
    console.log(`${action} user: ${potentialMatches[currentMatchIndex]?._id}`);

    // Move to the next match
    setCurrentMatchIndex(
      (prevIndex) => (prevIndex + 1) % potentialMatches.length
    );
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#4B0082" />
        <Text style={tw`mt-4 text-lg`}>Loading profiles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-lg text-red-500 mb-4 text-center`}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-indigo-900 py-2 px-4 rounded`}
          onPress={() => router.replace("/")}
        >
          <Text style={tw`text-white font-bold`}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (potentialMatches.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg`}>
          No profiles available at the moment. Check back soon!
        </Text>
      </View>
    );
  }

  const currentMatch = potentialMatches[currentMatchIndex];

  return (
    <SafeAreaView
      style={tw`flex-1 bg-white ${
        Platform.OS === "android" ? `pt-[${StatusBar.currentHeight}px]` : ""
      }`}
    >
      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex-row justify-between items-center p-4`}>
          <Text style={tw`text-2xl font-bold`}>Hi {loggedInUserName}!</Text>
          <View style={tw`flex-row gap-4`}>
            <TouchableOpacity onPress={() => console.log("History pressed")}>
              <History size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("Menu pressed")}>
              <Menu size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: viewportHeight }}>
          <Image
            source={{ uri: currentMatch.profilePhoto }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
          <View style={tw`absolute bottom-4 left-4 right-4`}>
            <Text style={tw`text-white text-3xl font-bold`}>
              {currentMatch.firstName}, {currentMatch.age}
            </Text>
            <View style={tw`flex-row items-center mt-1`}>
              <MapPin size={16} color="#fff" />
              <Text style={tw`text-white ml-1`}>{currentMatch.location}</Text>
            </View>
            <View style={tw`flex-row items-center mt-1`}>
              <Heart size={16} color="#fff" />
              <Text style={tw`text-white ml-1`}>
                {currentMatch.mutualConnections} mutual connection
                {currentMatch.mutualConnections !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`flex-row justify-around py-4 bg-white`}>
          <TouchableOpacity
            style={tw`bg-gray-200 p-4 rounded-full`}
            onPress={() => handleLikeDislike("dislike")}
          >
            <X size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-indigo-900 p-4 rounded-full`}
            onPress={() => handleLikeDislike("like")}
          >
            <Heart size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={tw`p-4`}>
          <View style={tw`mb-4`}>
            <View style={tw`flex-row items-center mb-2`}>
              <GraduationCap size={20} color="#4B0082" />
              <Text style={tw`ml-2`}>{currentMatch.college}</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <MapPin size={20} color="#4B0082" />
              <Text style={tw`ml-2`}>{currentMatch.location}</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Briefcase size={20} color="#4B0082" />
              <Text style={tw`ml-2`}>{currentMatch.job}</Text>
            </View>
          </View>

          {Object.entries(currentMatch.promptAnswers).map(
            ([prompt, answer], index) => (
              <View key={index} style={tw`mb-4`}>
                <Text style={tw`font-bold mb-1`}>{prompt}</Text>
                <Text>{answer}</Text>
              </View>
            )
          )}

          {currentMatch.additionalPhotos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={tw`w-full h-64 mb-4 rounded-lg`}
              resizeMode="cover"
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
