import React from "react";
import { View, Text, TextInput, Dimensions } from "react-native";
import { create } from "twrnc";
import DateTimePicker from "@react-native-community/datetimepicker";

const tw = create(require("../../tailwind.config.js"));

const screenWidth = Dimensions.get("window").width;

interface PersonalInfoStepProps {
  firstName: string;
  onFirstNameChange: (text: string) => void;
  birthday: Date;
  onBirthdayChange: (event: any, selectedDate?: Date) => void;
  getEighteenYearsAgo: () => Date;
  step: number;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  firstName,
  onFirstNameChange,
  birthday,
  onBirthdayChange,
  getEighteenYearsAgo,
  step,
}) => {
  if (step === 3) {
    return (
      <View style={tw`flex-1 justify-center`}>
        <TextInput
          style={tw`w-full border border-gray-300 rounded-md p-3 mb-4`}
          placeholder="First Name"
          value={firstName}
          onChangeText={onFirstNameChange}
        />
      </View>
    );
  } else if (step === 4) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <View style={tw`w-full items-center`}>
          <DateTimePicker
            value={birthday}
            mode="date"
            display="spinner"
            onChange={onBirthdayChange}
            maximumDate={getEighteenYearsAgo()}
            style={{ width: screenWidth - 32, height: 200 }}
          />
        </View>
        <Text style={tw`text-sm text-gray-500 mt-2 text-center`}>
          You must be at least 18 years old to sign up.
        </Text>
      </View>
    );
  }
  return null;
};

export default PersonalInfoStep;
