import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { GraduationCap } from "lucide-react-native";
import { tailwind } from "../../../tailwind";

interface CollegeStepProps {
  college: string | null;
  onCollegeChange: (college: string | null) => void;
  onSkip: () => void;
}

const CollegeStep: React.FC<CollegeStepProps> = ({
  college,
  onCollegeChange,
  onSkip,
}) => {
  const handleSkip = () => {
    onCollegeChange(null);
    onSkip();
  };

  return (
    <View style={tailwind`flex-1 justify-start`}>
      <View
        style={tailwind`flex-row items-center bg-white rounded-lg p-3 mb-4`}
      >
        <GraduationCap size={24} color="#4F46E5" style={tailwind`mr-2`} />
        <TextInput
          style={tailwind`flex-1 text-lg`}
          placeholder="Enter your college name"
          value={college || ""}
          onChangeText={(text) => onCollegeChange(text || null)}
          autoFocus
        />
      </View>
      <Text style={tailwind`text-sm text-gray-500 mb-4`}>
        Enter the name of the college you attend or attended
      </Text>
      <TouchableOpacity onPress={handleSkip}>
        <Text style={tailwind`text-indigo-600 text-center`}>
          Skip this step
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CollegeStep;
