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
import { History, Menu, LogOut } from "lucide-react-native";
import { create } from "twrnc";
import axios from "axios";
import Profile from "../components/Profile";
import LikeBar from "../components/LikeBar";
import LoginScreen from "../(auth)/login";

const tw = create(require("../tailwind.config.js"));

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

export default function HomeScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentMatch, setCurrentMatch] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userData?._id) {
      fetchUserData();
    }
  }, [isLoggedIn, userData?._id]);

  const fetchUserData = async () => {
    if (!userData?._id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5001/api/user/${userData._id}`
      );
      setUserData(response.data);
      if (response.data.matches.length > 0) {
        setCurrentMatch(response.data.matches[0]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(
            `Unable to fetch your data. Please try again later. (Error: ${error.response.status})`
          );
        } else if (error.request) {
          setError(
            "We're having trouble connecting to our servers. Please check your internet connection and try again."
          );
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      Alert.alert("Oops!", error.toString(), [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (phoneNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        phoneNumber,
      });

      if (response.data && response.data._id) {
        setIsLoggedIn(true);
        setUserData(response.data);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "We couldn't log you in. Please check your phone number and try again."
      );
      Alert.alert("Login Error", "We couldn't log you in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    console.log("Navigating to account creation");
    Alert.alert(
      "Create Account",
      "We're excited to have you join! Account creation will be available soon."
    );
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentMatch(null);
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

  const renderMainContent = () => {
    if (!isLoggedIn) {
      return (
        <LoginScreen
          onLogin={handleLogin}
          onCreateAccount={handleCreateAccount}
        />
      );
    }

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

    return (
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
            <TouchableOpacity onPress={handleLogout}>
              <LogOut size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <Profile
          name={currentMatch.name}
          age={currentMatch.age}
          location={currentMatch.location}
          profilePhoto={currentMatch.profilePhoto}
          school={currentMatch.school}
        />

        <LikeBar
          onDislike={nextMatch}
          onLike={handleLike}
          onSuperLike={handleSuperLike}
        />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      style={tw`flex-1 bg-white ${
        Platform.OS === "android" ? `pt-[${StatusBar.currentHeight}px]` : ""
      }`}
    >
      <View style={tw`flex-1`}>{renderMainContent()}</View>
    </SafeAreaView>
  );
}
