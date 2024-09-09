import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ChevronRight, Check } from "lucide-react-native";
import { tailwind } from "../../../tailwind";
import PromptOverlay from "./PromptOverlay";

interface ProfilePromptsStepProps {
  onPromptAnswer: (prompt: string, answer: string) => void;
  onComplete: () => void;
}

const prompts = [
  "Unusual skills",
  "Dating me is like",
  "My greatest strength",
  "My most irrational fear",
  "My simple pleasures",
  "The way to win me over is",
  "A life goal of mine",
];

const ProfilePromptsStep: React.FC<ProfilePromptsStepProps> = ({
  onPromptAnswer,
  onComplete,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [answeredPrompts, setAnsweredPrompts] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (answeredPrompts.size > 0) {
      onComplete();
    }
  }, [answeredPrompts, onComplete]);

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  const handleOverlayClose = () => {
    setSelectedPrompt(null);
  };

  const handlePromptAnswer = (answer: string) => {
    if (selectedPrompt) {
      onPromptAnswer(selectedPrompt, answer);
      setAnsweredPrompts(new Set(answeredPrompts).add(selectedPrompt));
      setSelectedPrompt(null);
    }
  };

  return (
    <ScrollView style={tailwind`flex-1`}>
      <View style={tailwind`p-4 pt-0`}>
        <Text style={tailwind`text-base text-gray-600 mb-6`}>
          Write your profile answers. Help potential matches understand more
          about your personality by finishing the sentence.
        </Text>
        {prompts.map((prompt, index) => (
          <TouchableOpacity
            key={index}
            style={tailwind`flex-row justify-between items-center p-4 bg-white rounded-lg mb-2 shadow-sm ${
              answeredPrompts.has(prompt) ? "bg-indigo-100" : ""
            }`}
            onPress={() => handlePromptSelect(prompt)}
          >
            <Text
              style={tailwind`text-lg ${
                answeredPrompts.has(prompt) ? "font-semibold" : ""
              }`}
            >
              {prompt}
            </Text>
            {answeredPrompts.has(prompt) ? (
              <Check size={24} color="#4F46E5" />
            ) : (
              <ChevronRight size={24} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <PromptOverlay
        isVisible={!!selectedPrompt}
        prompt={selectedPrompt || ""}
        onClose={handleOverlayClose}
        onSubmit={handlePromptAnswer}
      />
    </ScrollView>
  );
};

export default ProfilePromptsStep;
