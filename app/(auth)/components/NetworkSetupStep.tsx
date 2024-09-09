import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { tailwind } from "../../../tailwind";
import ContactAccessPopup from "./ContactAccessPopup";

interface NetworkSetupStepProps {
  profilePhoto: string | null;
  onContinue: () => void;
}

const NetworkSetupStep: React.FC<NetworkSetupStepProps> = ({
  profilePhoto,
  onContinue,
}) => {
  const [showContactAccess, setShowContactAccess] = useState(false);

  const handleLetGo = () => {
    setShowContactAccess(true);
  };

  const handleAllowContacts = () => {
    setShowContactAccess(false);
    onContinue();
  };

  const handleDismissContacts = () => {
    setShowContactAccess(false);
  };

  return (
    <LinearGradient colors={["#4F46E5", "#7C3AED"]} style={tailwind`flex-1`}>
      <SafeAreaView style={tailwind`flex-1 justify-between items-center`}>
        <View style={tailwind`items-center mt-12`}>
          {profilePhoto ? (
            <Image
              source={{ uri: profilePhoto }}
              style={tailwind`w-24 h-24 rounded-full mb-6`}
            />
          ) : (
            <View style={tailwind`w-24 h-24 rounded-full bg-gray-300 mb-6`} />
          )}
          <Text style={tailwind`text-2xl font-bold text-white mb-4`}>
            We're almost there!
          </Text>
          <Text style={tailwind`text-center text-white px-8`}>
            Now we need you to select the contacts you would like to be part of
            your network.
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLetGo}
          style={tailwind`bg-white rounded-full py-4 px-8 mb-12`}
        >
          <Text style={tailwind`text-indigo-600 font-semibold text-lg`}>
            Let's go
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <Modal
        visible={showContactAccess}
        transparent={true}
        animationType="fade"
      >
        <ContactAccessPopup
          onAllow={handleAllowContacts}
          onDismiss={handleDismissContacts}
        />
      </Modal>
    </LinearGradient>
  );
};

export default NetworkSetupStep;
