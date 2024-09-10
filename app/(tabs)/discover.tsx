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
    const tabBarHeight = 148; // Approximate height of the tab bar
    const headerHeight = 60; // Approximate height of the "Hi [username]!" header
    const buttonAreaHeight = 80; // Height for like/dislike buttons
    setViewportHeight(height - tabBarHeight - headerHeight - buttonAreaHeight);
  }, []);

  return viewportHeight;
};

export default function Component() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loggedInUserName, setLoggedInUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const viewportHeight = useViewportHeight();

  useEffect(() => {
    const initializeUser = async () => {
      if (params.newUser) {
        const newUserData = JSON.parse(params.newUser as string);
        setUserData(newUserData);
        setLoading(false);
      } else {
        fetchUserData();
      }
    };

    const fetchLoggedInUserName = async () => {
      try {
        const userId = await getUserId();
        if (!userId) {
          throw new Error("No user ID found. Please log in again.");
        }
        const response = await axios.get(
          `http://localhost:5001/api/user/${userId}`
        );
        setLoggedInUserName(response.data.firstName);
      } catch (error) {
        console.error("Error fetching logged-in user data:", error);
        setError("Failed to fetch user data. Please try again.");
      }
    };

    initializeUser();
    fetchLoggedInUserName();
  }, [params.newUser]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulating API call with dummy data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const dummyUserData: UserData = {
        _id: "66e0c8142948e18efc2b6a4a",
        firstName: "Victoria",
        age: 23,
        location: "Los Angeles",
        profilePhoto:
          "https://media.istockphoto.com/id/1317323736/photo/a-view-up-into-the-trees-direction-sky.webp?b=1&s=612x612&w=0&k=20&c=8xbZvMyptEaqMW46diKakhVgkPkAzBi5l7J1yveCZFk=",
        college: "Stanford University",
        job: "Technology Entrepreneur",
        promptAnswers: {
          "Unusual skills":
            "I can paint a watermelon with my right foot and I know a ridiculous amount of good Korean movies",
        },
        additionalPhotos: [
          "https://www.stockvault.net/data/2007/03/01/99589/thumb16.jpg",
          "https://st2.depositphotos.com/3651191/7410/i/450/depositphotos_74106203-stock-photo-blossom-carpet-of-pink-rhododendron.jpg",
          "https://media.istockphoto.com/id/154232673/photo/blue-ridge-parkway-scenic-landscape-appalachian-mountains-ridges-sunset-layers.jpg?s=612x612&w=0&k=20&c=m2LZsnuJl6Un7oW4pHBH7s6Yr9-yB6pLkZ-8_vTj2M0=",
        ],
        mutualConnections: 11,
      };
      setUserData(dummyUserData);
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

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#4B0082" />
        <Text style={tw`mt-4 text-lg`}>Loading profile...</Text>
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

  if (!userData) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg`}>
          No profile available at the moment. Check back soon!
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={tw`flex-1 bg-white ${
        Platform.OS === "android" ? `pt-[${StatusBar.currentHeight}px]` : ""
      }`}
    >
      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex-row justify-between items-center p-4`}>
          <Text style={tw`text-2xl font-bold`}>Hi, {loggedInUserName}!</Text>
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
            source={{ uri: userData.profilePhoto }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
          <View style={tw`absolute bottom-4 left-4 right-4`}>
            <Text style={tw`text-white text-3xl font-bold`}>
              {userData.firstName}, {userData.age}
            </Text>
            <View style={tw`flex-row items-center mt-1`}>
              <MapPin size={16} color="#fff" />
              <Text style={tw`text-white ml-1`}>{userData.location}</Text>
            </View>
            <View style={tw`flex-row items-center mt-1`}>
              <Heart size={16} color="#fff" />
              <Text style={tw`text-white ml-1`}>
                {userData.mutualConnections} mutual connections
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`flex-row justify-around py-4 bg-white`}>
          <TouchableOpacity
            style={tw`bg-gray-200 p-4 rounded-full`}
            onPress={() => console.log("Dislike")}
          >
            <X size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-indigo-900 p-4 rounded-full`}
            onPress={() => console.log("Like")}
          >
            <Heart size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={tw`p-4`}>
          <View style={tw`mb-4`}>
            <View style={tw`flex-row items-center mb-2`}>
              <GraduationCap size={20} color="#4B0082" />
              <Text style={tw`ml-2`}>{userData.college}</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <MapPin size={20} color="#4B0082" />
              <Text style={tw`ml-2`}>{userData.location}</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Briefcase size={20} color="#4B0082" />
              <Text style={tw`ml-2`}>{userData.job}</Text>
            </View>
          </View>

          {Object.entries(userData.promptAnswers).map(
            ([prompt, answer], index) => (
              <View key={index} style={tw`mb-4`}>
                <Text style={tw`font-bold mb-1`}>{prompt}</Text>
                <Text>{answer}</Text>
              </View>
            )
          )}

          {userData.additionalPhotos.map((photo, index) => (
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
