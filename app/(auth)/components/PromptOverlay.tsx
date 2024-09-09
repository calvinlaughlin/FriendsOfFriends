import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { X } from "lucide-react-native";
import { tailwind } from "../../../tailwind";

interface PromptOverlayProps {
  isVisible: boolean;
  prompt: string;
  onClose: () => void;
  onSubmit: (answer: string) => void;
}

const PromptOverlay: React.FC<PromptOverlayProps> = ({
  isVisible,
  prompt,
  onClose,
  onSubmit,
}) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer("");
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable
        style={tailwind`flex-1 bg-black bg-opacity-50 justify-center items-center`}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={tailwind`w-full max-w-md`}
        >
          <Pressable style={tailwind`bg-white rounded-3xl m-4 shadow-xl`}>
            <View style={tailwind`p-6`}>
              <View
                style={tailwind`flex-row justify-between items-center mb-4`}
              >
                <Text style={tailwind`text-xl font-bold`}>
                  Write your profile answers
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <Text style={tailwind`text-lg font-semibold mb-2`}>{prompt}</Text>
              <TextInput
                style={tailwind`border border-gray-300 rounded-lg p-3 h-32 text-base bg-white`}
                multiline
                placeholder="Type your answer here..."
                value={answer}
                onChangeText={setAnswer}
                onSubmitEditing={handleSubmit}
              />
              <TouchableOpacity
                style={tailwind`bg-indigo-600 rounded-lg p-3 mt-4`}
                onPress={handleSubmit}
              >
                <Text style={tailwind`text-white text-center font-semibold`}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export default PromptOverlay;
