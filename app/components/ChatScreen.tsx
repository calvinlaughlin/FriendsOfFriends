import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Search } from "lucide-react-native";
import { create } from "twrnc";

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

interface ChatScreenProps {
  userData: UserData;
}

export default function ChatScreen({ userData }: ChatScreenProps) {
  const newMatches = userData.matches.slice(0, 5); // Display only the first 5 matches as new
  const messages = userData.matches; // All matches are potential message threads

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <View style={tw`p-4`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-2xl font-bold`}>Matches</Text>
            <TouchableOpacity>
              <Search size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={tw`text-lg font-semibold mb-2`}>
            New matches ({newMatches.length})
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tw`mb-6`}
          >
            {newMatches.map((match) => (
              <View key={match._id} style={tw`mr-4 items-center`}>
                <View style={tw`relative`}>
                  <Image
                    source={{ uri: match.profilePhoto }}
                    style={tw`w-15 h-15 rounded-full`}
                  />
                  <View
                    style={tw`absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white`}
                  />
                </View>
                <Text style={tw`text-xs mt-1`}>{match.name}</Text>
              </View>
            ))}
          </ScrollView>

          <Text style={tw`text-lg font-semibold mb-2`}>Messages</Text>
          {messages.map((message) => (
            <TouchableOpacity
              key={message._id}
              style={tw`flex-row items-center mb-4`}
            >
              <View style={tw`relative`}>
                <Image
                  source={{ uri: message.profilePhoto }}
                  style={tw`w-12 h-12 rounded-full`}
                />
                {newMatches.some((match) => match._id === message._id) && (
                  <View
                    style={tw`absolute top-0 left-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white`}
                  />
                )}
              </View>
              <View style={tw`ml-3 flex-1`}>
                <Text style={tw`font-semibold`}>{message.name}</Text>
                <Text style={tw`text-gray-500`} numberOfLines={1}>
                  {`${message.name} is ${message.age} years old and from ${message.location}`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
