import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { tailwind } from "../../../tailwind";
import { User } from "lucide-react-native";

interface ContactAccessPopupProps {
  onAllow: () => void;
  onDismiss: () => void;
}

const ContactAccessPopup: React.FC<ContactAccessPopupProps> = ({
  onAllow,
  onDismiss,
}) => {
  return (
    <View
      style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-50`}
    >
      <View style={tailwind`bg-white rounded-lg p-6 w-80`}>
        <View style={tailwind`items-center mb-4`}>
          <User size={32} color="#4F46E5" />
        </View>
        <Text style={tailwind`text-xl font-bold mb-2 text-center`}>
          Access to Contacts
        </Text>
        <Text style={tailwind`text-gray-600 mb-6 text-center`}>
          We need access to your contacts to help you connect with friends and
          find potential matches.
        </Text>
        <View style={tailwind`flex-row justify-between`}>
          <TouchableOpacity
            onPress={onDismiss}
            style={tailwind`bg-gray-200 rounded-full py-2 px-6`}
          >
            <Text style={tailwind`text-gray-800 font-semibold`}>Dismiss</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAllow}
            style={tailwind`bg-indigo-600 rounded-full py-2 px-6`}
          >
            <Text style={tailwind`text-white font-semibold`}>Allow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ContactAccessPopup;
