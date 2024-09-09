import React from "react";
import { View } from "react-native";
import { create } from "twrnc";

const tw = create(require("../../../tailwind.config.js"));

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <View style={tw`w-full h-2 bg-gray-200 rounded-full mb-4`}>
      <View
        style={[
          tw`h-full bg-indigo-600 rounded-full`,
          { width: `${progress}%` },
        ]}
      />
    </View>
  );
};

export default ProgressBar;
