import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { create } from "twrnc";
import { X } from "lucide-react-native";
import axios from "axios";
import { getUserId } from "../../backend/userStorage";

const tw = create(require("../../tailwind.config.js"));

interface User {
  _id: string;
  firstName: string;
  profilePhoto: string;
  mutualConnections: number;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 0) {
        searchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = await getUserId();
      const response = await axios.get(
        `http://localhost:5001/api/users/search`,
        {
          params: { query: searchQuery, userId },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
      setError("Failed to search users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={tw`flex-row items-center p-2 border-b border-gray-200`}>
      <Image
        source={{ uri: item.profilePhoto }}
        style={tw`w-12 h-12 rounded-full mr-3`}
      />
      <View>
        <Text style={tw`font-semibold text-lg`}>{item.firstName}</Text>
        {item.mutualConnections > 0 && (
          <Text style={tw`text-sm text-gray-600`}>
            Mutual connections: {item.mutualConnections}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <View style={tw`p-4`}>
          <Text style={tw`text-2xl font-bold mb-4`}>Search</Text>
          <View
            style={tw`flex-row items-center bg-gray-100 rounded-full px-4 py-2`}
          >
            <TextInput
              style={tw`flex-1 text-base`}
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <X size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4B0082" style={tw`mt-4`} />
        ) : error ? (
          <Text style={tw`text-red-500 text-center mt-4`}>{error}</Text>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id}
            style={tw`flex-1`}
            contentContainerStyle={tw`pb-4`}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
