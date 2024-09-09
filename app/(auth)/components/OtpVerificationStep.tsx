import React from "react";
import { View, Text, TextInput } from "react-native";
import { create } from "twrnc";

const tw = create(require("../../tailwind.config.js"));

interface OtpVerificationStepProps {
  otp: string;
  onOtpChange: (text: string) => void;
  bypassVerification: boolean;
}

const OtpVerificationStep: React.FC<OtpVerificationStepProps> = ({
  otp,
  onOtpChange,
  bypassVerification,
}) => {
  return (
    <View style={tw`flex-1 justify-center`}>
      <TextInput
        style={tw`w-full border border-gray-300 rounded-md p-3 mb-4`}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={onOtpChange}
      />
      {bypassVerification && (
        <Text style={tw`text-sm text-gray-500 mt-2`}>
          Bypass mode: Enter 123456 to proceed
        </Text>
      )}
    </View>
  );
};

export default OtpVerificationStep;
