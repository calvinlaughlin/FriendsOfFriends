import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Contacts from "expo-contacts";
import { tailwind } from "../../../tailwind";
import { User, Search } from "lucide-react-native";

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

interface ClosestContactsStepProps {
  onComplete: (selectedContacts: Contact[]) => void;
}

export default function ClosestContactsStep({
  onComplete,
}: ClosestContactsStepProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        console.log("Fetched contacts:", data.length);

        const validContacts: Contact[] = data
          .filter(
            (contact): contact is Contacts.Contact =>
              !!contact.name &&
              !!contact.phoneNumbers &&
              contact.phoneNumbers.length > 0
          )
          .map((contact) => ({
            id: contact.id ?? `temp-${Math.random().toString(36).substr(2, 9)}`,
            name: contact.name ?? "Unknown",
            phoneNumber: contact.phoneNumbers![0].number ?? "",
          }));

        console.log("Valid contacts:", validContacts.length);

        setContacts(validContacts);
        setFilteredContacts(validContacts);
      } else {
        console.log("Contacts permission denied");
        showContactsDeniedAlert();
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      Alert.alert("Error", "Failed to fetch contacts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const showContactsDeniedAlert = useCallback(() => {
    Alert.alert(
      "Contact Access Required",
      "Hey, the truth is we can only make this thing work for you if we know who some of your friends are...would you reconsider giving us access to contacts?",
      [
        { text: "Give access", onPress: () => fetchContacts() },
        { text: "Proceed without contacts", onPress: () => onComplete([]) },
      ]
    );
  }, [fetchContacts, onComplete]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredContacts(filtered);
    },
    [contacts]
  );

  const toggleContactSelection = useCallback((contact: Contact) => {
    setSelectedContacts((prev) => {
      if (prev.some((c) => c.id === contact.id)) {
        return prev.filter((c) => c.id !== contact.id);
      } else if (prev.length < 10) {
        return [...prev, contact];
      } else {
        Alert.alert(
          "Maximum Contacts",
          "You can only select up to 10 closest contacts."
        );
        return prev;
      }
    });
  }, []);

  const renderContact = useCallback(
    ({ item }: { item: Contact }) => (
      <TouchableOpacity
        onPress={() => toggleContactSelection(item)}
        style={tailwind`flex-row items-center p-4 border-b border-gray-200 ${
          selectedContacts.some((c) => c.id === item.id) ? "bg-indigo-100" : ""
        }`}
      >
        <User size={24} color="#4F46E5" style={tailwind`mr-4`} />
        <Text style={tailwind`text-lg`}>{item.name}</Text>
      </TouchableOpacity>
    ),
    [selectedContacts, toggleContactSelection]
  );

  if (isLoading) {
    return (
      <View style={tailwind`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={tailwind`mt-4 text-lg`}>Loading contacts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tailwind`flex-1 bg-white`}>
      <Text style={tailwind`text-2xl font-bold p-4`}>
        Select Your Closest Contacts
      </Text>
      <View
        style={tailwind`flex-row items-center bg-gray-100 mx-4 my-2 p-2 rounded-full`}
      >
        <Search size={20} color="#4F46E5" style={tailwind`mr-2`} />
        <TextInput
          placeholder="Search contacts"
          value={searchQuery}
          onChangeText={handleSearch}
          style={tailwind`flex-1`}
        />
      </View>
      {contacts.length === 0 ? (
        <View style={tailwind`flex-1 justify-center items-center`}>
          <Text style={tailwind`text-lg text-gray-600`}>No contacts found</Text>
          <TouchableOpacity
            onPress={fetchContacts}
            style={tailwind`mt-4 bg-indigo-600 px-4 py-2 rounded-md`}
          >
            <Text style={tailwind`text-white font-semibold`}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          contentContainerStyle={tailwind`flex-grow`}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          console.log(
            "Selected contacts in ClosestContactsStep:",
            selectedContacts
          );
          onComplete(selectedContacts);
        }}
        style={tailwind`bg-indigo-600 m-4 rounded-full py-4 px-8`}
      >
        <Text style={tailwind`text-white font-semibold text-center text-lg`}>
          Continue with {selectedContacts.length} selected
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
