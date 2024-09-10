// profile.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { getUserId } from "../../backend/userStorage";

interface Contact {
  name: string;
  phoneNumber: string;
}

interface UserData {
  _id: string;
  phoneNumber: string;
  firstName: string;
  location: string;
  profilePhoto: string;
  additionalPhotos: string[];
  birthday: string;
  age: number;
  gender: string;
  desiredGender: string;
  college: string;
  job: string;
  promptAnswers: { [key: string]: string };
  closestContacts: Contact[];
  excludedContacts: Contact[];
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await getUserId();
      if (!userId) {
        setError("No user ID found. Please log in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<UserData>(
          `http://localhost:5001/api/user/${userId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            setError(
              `Unable to fetch your data. Please try again later. (Error: ${axiosError.response.status})`
            );
          } else if (axiosError.request) {
            setError(
              "We're having trouble connecting to our servers. Please check your internet connection and try again."
            );
          } else {
            setError("Something went wrong. Please try again.");
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        Alert.alert(
          "Oops!",
          error instanceof Error ? error.message : String(error),
          [{ text: "OK" }]
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No user data found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: userData.profilePhoto }}
          style={styles.profilePhoto}
        />
        <Text style={styles.name}>{userData.firstName}</Text>
        <Text style={styles.location}>{userData.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Info</Text>
        <Text style={styles.text}>Age: {userData.age}</Text>
        <Text style={styles.text}>Gender: {userData.gender}</Text>
        <Text style={styles.text}>
          Desired Gender: {userData.desiredGender}
        </Text>
        <Text style={styles.text}>
          Birthday: {format(new Date(userData.birthday), "MMMM d, yyyy")}
        </Text>
        <Text style={styles.text}>Phone: {userData.phoneNumber}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education and Work</Text>
        <Text style={styles.text}>
          College: {userData.college || "Not specified"}
        </Text>
        <Text style={styles.text}>Job: {userData.job || "Not specified"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Prompts</Text>
        {Object.entries(userData.promptAnswers).map(([prompt, answer]) => (
          <View key={prompt} style={styles.promptContainer}>
            <Text style={styles.promptText}>{prompt}</Text>
            <Text style={styles.text}>{answer}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {userData.additionalPhotos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={styles.additionalPhoto}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Closest Contacts</Text>
        {userData.closestContacts.map((contact, index) => (
          <Text key={index} style={styles.text}>
            {contact.name} - {contact.phoneNumber}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Excluded Contacts</Text>
        {userData.excludedContacts.map((contact, index) => (
          <Text key={index} style={styles.text}>
            {contact.name} - {contact.phoneNumber}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 24,
  },
  profilePhoto: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  location: {
    fontSize: 18,
    color: "#666",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  promptContainer: {
    marginBottom: 8,
  },
  promptText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  additionalPhoto: {
    width: 96,
    height: 96,
    borderRadius: 8,
    marginRight: 8,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});
