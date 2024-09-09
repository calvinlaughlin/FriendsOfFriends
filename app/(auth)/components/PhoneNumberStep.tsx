import React from "react";
import { View, Text, TextInput } from "react-native";
import { create } from "twrnc";

const tw = create(require("../../../tailwind.config.js"));

interface PhoneNumberStepProps {
  phoneNumber: string;
  onPhoneNumberChange: (text: string) => void;
}

const PhoneNumberStep: React.FC<PhoneNumberStepProps> = ({
  phoneNumber,
  onPhoneNumberChange,
}) => {
  return (
    <View style={tw`flex-1 justify-center`}>
      <View style={tw`flex-row items-center`}>
        <View
          style={tw`bg-gray-100 p-3 rounded-l-md border border-r-0 border-gray-300`}
        >
          <Text>🇺🇸 +1</Text>
        </View>
        <TextInput
          style={tw`flex-1 border border-l-0 border-gray-300 rounded-r-md p-3`}
          placeholder="123-456-7890"
          keyboardType="number-pad"
          value={phoneNumber}
          onChangeText={onPhoneNumberChange}
          maxLength={12}
        />
      </View>
      <Text style={tw`text-sm text-gray-500 mt-2`}>
        10-digit US phone number.
      </Text>
    </View>
  );
};

export default PhoneNumberStep;
