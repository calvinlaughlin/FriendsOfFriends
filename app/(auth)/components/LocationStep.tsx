import React from "react";
import { View, Text, TextInput } from "react-native";
import { MapPin } from "lucide-react-native";
import { tailwind } from "../../../tailwind";

interface LocationStepProps {
  location: string;
  onLocationChange: (location: string) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({
  location,
  onLocationChange,
}) => {
  return (
    <View style={tailwind`flex-1 justify-start`}>
      <View
        style={tailwind`flex-row items-center bg-white rounded-lg p-3 mb-4`}
      >
        <MapPin size={24} color="#4F46E5" style={tailwind`mr-2`} />
        <TextInput
          style={tailwind`flex-1 text-lg`}
          placeholder="Enter your location"
          value={location}
          onChangeText={onLocationChange}
          autoFocus
        />
      </View>
      <Text style={tailwind`text-sm text-gray-500`}>
        Enter the name of your city, town, or neighborhood
      </Text>
    </View>
  );
};

export default LocationStep;
