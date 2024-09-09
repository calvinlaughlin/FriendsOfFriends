import React from "react";
import { View } from "react-native";
import { create } from "twrnc";
import { Picker } from "@react-native-picker/picker";

const tw = create(require("../../../tailwind.config.js"));

interface GenderSelectionStepProps {
  gender: string;
  onGenderChange: (itemValue: string) => void;
  desiredGender: string;
  onDesiredGenderChange: (itemValue: string) => void;
  step: number;
}

const GenderSelectionStep: React.FC<GenderSelectionStepProps> = ({
  gender,
  onGenderChange,
  desiredGender,
  onDesiredGenderChange,
  step,
}) => {
  return (
    <View style={tw`flex-1 justify-center`}>
      <Picker
        selectedValue={step === 5 ? gender : desiredGender}
        style={tw`w-full border border-gray-300 rounded-md mb-4`}
        onValueChange={step === 5 ? onGenderChange : onDesiredGenderChange}
      >
        <Picker.Item
          label={`Select ${step === 5 ? "Gender" : "Desired Gender"}`}
          value=""
        />
        <Picker.Item label="Woman" value="woman" />
        <Picker.Item label="Man" value="man" />
        <Picker.Item label="Nonbinary" value="nonbinary" />
      </Picker>
    </View>
  );
};

export default GenderSelectionStep;
