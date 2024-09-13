import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { create } from "twrnc";
import axios from "axios";
import { getUserId } from "../../backend/userStorage";
import { Search } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";

const tw = create(require("../../tailwind.config.js"));

interface LikedUser {
  _id: string;
  firstName: string;
  profilePhoto: string;
}

export default function MatchesScreen() {
  const [likedUsers, setLikedUsers] = useState<LikedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikedUsers = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      if (!userId) {
        throw new Error("No user ID found. Please log in again.");
      }
      const response = await axios.get(
        `http://localhost:5001/api/user/${userId}/liked-users`
      );
      setLikedUsers(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching liked users:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setError("User not found. Please log in again.");
        } else {
          setError(`Failed to fetch liked users. ${error.message}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLikedUsers();
    }, [fetchLikedUsers])
  );

  const retryFetch = () => {
    fetchLikedUsers();
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#4B0082" />
        <Text style={tw`mt-4 text-lg`}>Loading matches...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center p-4 bg-white`}>
        <Text style={tw`text-lg text-red-500 mb-4 text-center`}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-indigo-900 py-2 px-4 rounded`}
          onPress={retryFetch}
        >
          <Text style={tw`text-white font-bold`}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
          <Text style={tw`text-3xl font-bold`}>Matches</Text>
          <TouchableOpacity>
            <Search size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={tw`px-4`}>
          <Text style={tw`text-xl text-gray-500 mb-4`}>
            New matches ({likedUsers.length})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {likedUsers.map((user) => (
              <View key={user._id} style={tw`mr-4 items-center`}>
                <Image
                  source={{ uri: user.profilePhoto }}
                  style={tw`w-20 h-20 rounded-full mb-2`}
                />
                <Text style={tw`text-center`}>{user.firstName}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {likedUsers.length === 0 && (
          <Text style={tw`text-lg text-center text-gray-500 mt-4 px-4`}>
            You haven't liked anyone yet. Start swiping to find matches!
          </Text>
        )}

        {/* Messages section can be added here if needed */}
      </ScrollView>
    </SafeAreaView>
  );
}
