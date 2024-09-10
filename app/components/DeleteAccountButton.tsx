import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { removeUserId } from "../../backend/userStorage";

interface DeleteAccountButtonProps {
  userId: string;
}

export default function DeleteAccountButton({
  userId,
}: DeleteAccountButtonProps) {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await axios.delete(`http://localhost:5001/api/user/${userId}`);
              await removeUserId();
              router.replace("/login");
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
      <Text style={styles.buttonText}>Delete Account</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
