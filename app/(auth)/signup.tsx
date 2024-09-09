import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Auth0 from "react-native-auth0";
import { tailwind } from "../../tailwind";

import ProgressBar from "./components/ProgressBar";
import PhoneNumberStep from "./components/PhoneNumberStep";
import OtpVerificationStep from "./components/OtpVerificationStep";
import PersonalInfoStep from "./components/PersonalInfoStep";
import GenderSelectionStep from "./components/GenderSelectionStep";
import ProfilePhotoStep from "./components/ProfilePhotoStep";

const auth0 = new Auth0({
  domain: "dev-t5rnx1ug8uns7sxt.us.auth0.com",
  clientId: "mOr4wis0K462e0t2IT4GIA2tgpYD0vBJ",
});

const steps = [
  "What's your number?",
  "Verify your number",
  "What's your first name?",
  "When's your birthday?",
  "What's your gender?",
  "What's your desired gender?",
  "Add your photos",
];

export default function SignUpScreen() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [birthday, setBirthday] = useState(getEighteenYearsAgo());
  const [gender, setGender] = useState("");
  const [desiredGender, setDesiredGender] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [bypassVerification, setBypassVerification] = useState(false);
  const router = useRouter();

  function getEighteenYearsAgo() {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date;
  }

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return number;
  };

  const handlePhoneNumberChange = useCallback((text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  }, []);

  const isPhoneNumberValid = () => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    return cleaned.length === 10;
  };

  const handleNext = async () => {
    if (step === 1 && isPhoneNumberValid()) {
      if (bypassVerification) {
        setStep(2);
      } else {
        try {
          const formattedNumber = "+1" + phoneNumber.replace(/\D/g, "");
          await auth0.auth.passwordlessWithSMS({
            phoneNumber: formattedNumber,
          });
          setStep(2);
        } catch (error) {
          console.error("Error sending OTP:", error);
          Alert.alert("Error", "Failed to send OTP. Please try again.");
        }
      }
    } else if (step === 2) {
      if (bypassVerification && otp === "123456") {
        setStep(3);
      } else if (!bypassVerification) {
        try {
          const formattedNumber = "+1" + phoneNumber.replace(/\D/g, "");
          await auth0.auth.loginWithSMS({
            phoneNumber: formattedNumber,
            code: otp,
          });
          setStep(3);
        } catch (error) {
          console.error("Error verifying OTP:", error);
          Alert.alert("Error", "Failed to verify OTP. Please try again.");
        }
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
    } else if (step < 7) {
      setStep(step + 1);
    } else if (step === 7 && profilePhoto) {
      // Final step: create account
      console.log("Account created:", {
        phoneNumber: "+1" + phoneNumber.replace(/\D/g, ""),
        firstName,
        birthday,
        gender,
        desiredGender,
        profilePhoto,
        additionalPhotos,
      });
      router.replace("/(tabs)/discover");
    } else {
      Alert.alert("Error", "Please upload a profile photo before proceeding.");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleBirthdayChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthday;
    const eighteenYearsAgo = getEighteenYearsAgo();

    if (currentDate > eighteenYearsAgo) {
      Alert.alert(
        "Invalid Date",
        "You must be at least 18 years old to sign up."
      );
    } else {
      setBirthday(currentDate);
    }
  };

  const handleImageUpload = (uri: string, isProfilePhoto: boolean) => {
    if (isProfilePhoto) {
      setProfilePhoto(uri);
    } else {
      setAdditionalPhotos((prev) => [...prev, uri].slice(0, 6));
    }
  };

  const handleDeletePhoto = (index: number) => {
    if (index === -1) {
      setProfilePhoto(null);
    } else {
      setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PhoneNumberStep
            phoneNumber={phoneNumber}
            onPhoneNumberChange={handlePhoneNumberChange}
          />
        );
      case 2:
        return (
          <OtpVerificationStep
            otp={otp}
            onOtpChange={setOtp}
            bypassVerification={bypassVerification}
          />
        );
      case 3:
      case 4:
        return (
          <PersonalInfoStep
            firstName={firstName}
            onFirstNameChange={setFirstName}
            birthday={birthday}
            onBirthdayChange={handleBirthdayChange}
            getEighteenYearsAgo={getEighteenYearsAgo}
            step={step}
          />
        );
      case 5:
      case 6:
        return (
          <GenderSelectionStep
            gender={gender}
            onGenderChange={setGender}
            desiredGender={desiredGender}
            onDesiredGenderChange={setDesiredGender}
            step={step}
          />
        );
      case 7:
        return (
          <ProfilePhotoStep
            profilePhoto={profilePhoto}
            additionalPhotos={additionalPhotos}
            onImageUpload={handleImageUpload}
            onDeletePhoto={handleDeletePhoto}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <SafeAreaView style={tailwind`flex-1 bg-white`}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={tailwind`flex-1`}
        >
          <ScrollView contentContainerStyle={tailwind`flex-grow`}>
            <View style={tailwind`flex-1 p-4 justify-between`}>
              <View>
                <ProgressBar currentStep={step} totalSteps={steps.length} />
                <Text style={tailwind`text-2xl font-bold mb-8`}>
                  {steps[step - 1]}
                </Text>
              </View>
              {step < 7 && (
                <View style={tailwind`flex-row items-center justify-end mb-4`}>
                  <Text style={tailwind`mr-2`}>Bypass Verification</Text>
                  <Switch
                    value={bypassVerification}
                    onValueChange={setBypassVerification}
                  />
                </View>
              )}
              {renderStep()}
              <View style={tailwind`flex-row justify-between mt-4`}>
                <TouchableOpacity
                  onPress={handleBack}
                  style={tailwind`bg-gray-200 rounded-md p-3`}
                >
                  <Text style={tailwind`text-gray-800 font-semibold`}>
                    Back
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNext}
                  style={tailwind`bg-indigo-600 rounded-md p-3 ${
                    (step === 1 && !isPhoneNumberValid()) ||
                    (step === 7 && !profilePhoto)
                      ? "opacity-50"
                      : ""
                  }`}
                  disabled={
                    (step === 1 && !isPhoneNumberValid()) ||
                    (step === 7 && !profilePhoto)
                  }
                >
                  <Text style={tailwind`text-white font-semibold`}>
                    {step === 7 ? "Create Account" : "Next"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
