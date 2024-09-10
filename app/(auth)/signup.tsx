import React, { useState, useCallback, useEffect } from "react";
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
import ProfilePromptsStep from "./components/ProfilePromptsStep";
import LocationStep from "./components/LocationStep";
import CollegeStep from "./components/CollegeStep";
import JobStep from "./components/JobStep";
import NetworkSetupStep from "./components/NetworkSetupStep";
import ClosestContactsStep from "./components/ClosestContactsStep";
import CongratsScreen from "./components/CongratsScreen";

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
  "Add a profile prompt",
  "Where are you from?",
  "College you attend or attended",
  "What do you do?",
  "Set up your network",
  "Choose your closest contacts",
  "Congratulations!",
];

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

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
  const [promptAnswers, setPromptAnswers] = useState<{ [key: string]: string }>(
    {}
  );
  const [isPromptStepComplete, setIsPromptStepComplete] = useState(false);
  const [location, setLocation] = useState("");
  const [college, setCollege] = useState<string | null>(null);
  const [job, setJob] = useState("");
  const [closestContacts, setClosestContacts] = useState<Contact[]>([]);
  const [bypassVerification, setBypassVerification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Current step:", step);
  }, [step]);

  function getEighteenYearsAgo() {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date;
  }

  const formatPhoneNumber = useCallback((number: string) => {
    const cleaned = number.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return number;
  }, []);

  const handlePhoneNumberChange = useCallback(
    (text: string) => {
      const formatted = formatPhoneNumber(text);
      setPhoneNumber(formatted);
      console.log("Phone number changed:", formatted);
    },
    [formatPhoneNumber]
  );

  const isPhoneNumberValid = useCallback(() => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    return cleaned.length === 10;
  }, [phoneNumber]);

  const handlePromptAnswer = useCallback((prompt: string, answer: string) => {
    setPromptAnswers((prev) => ({ ...prev, [prompt]: answer }));
  }, []);

  const handlePromptStepComplete = useCallback(() => {
    setIsPromptStepComplete(true);
  }, []);

  const handleSkipCollege = useCallback(() => {
    setCollege(null);
    setStep((prevStep) => prevStep + 1);
  }, []);

  const handleCollegeChange = useCallback((value: string | null) => {
    setCollege(value);
  }, []);

  const handleClosestContactsComplete = useCallback(
    (selectedContacts: Contact[]) => {
      console.log("Received contacts in SignUpScreen:", selectedContacts);
      setClosestContacts(selectedContacts);
      handleNext();
    },
    []
  );

  const handleNext = useCallback(async () => {
    console.log("Attempting to move to next step. Current step:", step);
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
    } else if (step < 14) {
      setStep((prevStep) => prevStep + 1);
    } else if (step === 14) {
      // Final step: create account
      const accountData = {
        phoneNumber: "+1" + phoneNumber.replace(/\D/g, ""),
        firstName,
        birthday,
        gender,
        desiredGender,
        profilePhoto,
        additionalPhotos,
        promptAnswers,
        location,
        college,
        job,
        closestContacts: closestContacts.map((contact) => ({
          name: contact.name,
          phoneNumber: contact.phoneNumber,
        })),
      };
      console.log("Account created:", accountData);
      router.replace("/(tabs)/discover");
    }
  }, [
    step,
    phoneNumber,
    otp,
    firstName,
    birthday,
    gender,
    desiredGender,
    profilePhoto,
    additionalPhotos,
    promptAnswers,
    location,
    college,
    job,
    closestContacts,
    bypassVerification,
    isPhoneNumberValid,
    router,
  ]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    } else {
      router.back();
    }
  }, [step, router]);

  const handleBirthdayChange = useCallback(
    (event: any, selectedDate?: Date) => {
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
    },
    [birthday]
  );

  const handleImageUpload = useCallback(
    (uri: string, isProfilePhoto: boolean) => {
      if (isProfilePhoto) {
        setProfilePhoto(uri);
      } else {
        setAdditionalPhotos((prev) => [...prev, uri].slice(0, 6));
      }
    },
    []
  );

  const handleDeletePhoto = useCallback((index: number) => {
    if (index === -1) {
      setProfilePhoto(null);
    } else {
      setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
    }
  }, []);

  const renderStep = useCallback(() => {
    console.log("Rendering step:", step);
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
      case 8:
        return (
          <ProfilePromptsStep
            onPromptAnswer={handlePromptAnswer}
            onComplete={handlePromptStepComplete}
          />
        );
      case 9:
        return (
          <LocationStep location={location} onLocationChange={setLocation} />
        );
      case 10:
        return (
          <CollegeStep
            college={college}
            onCollegeChange={handleCollegeChange}
            onSkip={handleSkipCollege}
          />
        );
      case 11:
        return <JobStep job={job} onJobChange={setJob} />;
      case 12:
        return (
          <NetworkSetupStep
            profilePhoto={profilePhoto}
            onContinue={handleNext}
          />
        );
      case 13:
        return (
          <ClosestContactsStep onComplete={handleClosestContactsComplete} />
        );
      case 14:
        return <CongratsScreen onContinue={handleNext} />;
      default:
        return <Text>Unknown step</Text>;
    }
  }, [
    step,
    phoneNumber,
    otp,
    firstName,
    birthday,
    gender,
    desiredGender,
    profilePhoto,
    additionalPhotos,
    location,
    college,
    job,
    bypassVerification,
    handlePhoneNumberChange,
    handleBirthdayChange,
    handleImageUpload,
    handleDeletePhoto,
    handlePromptAnswer,
    handlePromptStepComplete,
    handleCollegeChange,
    handleSkipCollege,
    handleClosestContactsComplete,
    handleNext,
  ]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style={step >= 12 ? "light" : "dark"} />
      {step >= 12 ? (
        renderStep()
      ) : (
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
                  <View
                    style={tailwind`flex-row items-center justify-end mb-4`}
                  >
                    <Text style={tailwind`mr-2`}>Bypass Verification</Text>
                    <Switch
                      value={bypassVerification}
                      onValueChange={setBypassVerification}
                    />
                  </View>
                )}
                {renderStep()}
                {step < 12 && (
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
                        (step === 8 && !isPromptStepComplete) ||
                        (step === 9 && !location.trim())
                          ? "opacity-50"
                          : ""
                      }`}
                      disabled={
                        (step === 1 && !isPhoneNumberValid()) ||
                        (step === 8 && !isPromptStepComplete) ||
                        (step === 9 && !location.trim())
                      }
                    >
                      <Text style={tailwind`text-white font-semibold`}>
                        Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </>
  );
}
