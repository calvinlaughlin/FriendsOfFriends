import React from "react";
import { View, Text, TextInput } from "react-native";
import { Briefcase } from "lucide-react-native";
import { tailwind } from "../../../tailwind";

interface JobStepProps {
  job: string;
  onJobChange: (job: string) => void;
}

const JobStep: React.FC<JobStepProps> = ({ job, onJobChange }) => {
  return (
    <View style={tailwind`flex-1 justify-start`}>
      <View
        style={tailwind`flex-row items-center bg-white rounded-lg p-3 mb-4`}
      >
        <Briefcase size={24} color="#4F46E5" style={tailwind`mr-2`} />
        <TextInput
          style={tailwind`flex-1 text-lg`}
          placeholder="e.g: Consulting / Product @ Google"
          value={job}
          onChangeText={onJobChange}
          autoFocus
        />
      </View>
      <Text style={tailwind`text-sm text-gray-500`}>
        Enter your job title, role, or company
      </Text>
    </View>
  );
};

export default JobStep;
