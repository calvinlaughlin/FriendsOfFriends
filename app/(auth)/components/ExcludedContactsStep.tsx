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

interface ExcludedContactsStepProps {
  onComplete: (selectedContacts: Contact[]) => void;
  closestContacts: Contact[];
}

export default function ExcludedContactsStep({
  onComplete,
  closestContacts,
}: ExcludedContactsStepProps) {
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
          }))
          .filter(
            (contact) =>
              !closestContacts.some(
                (c) => c.phoneNumber === contact.phoneNumber
              )
          );

        console.log("Valid contacts for exclusion:", validContacts.length);

        setContacts(validContacts);
        setFilteredContacts(validContacts);
      } else {
        console.log("Contacts permission denied");
        Alert.alert(
          "Contact Access Required",
          "We need access to your contacts to help you exclude people from your network. Would you like to give us access?",
          [
            { text: "Give access", onPress: () => fetchContacts() },
            { text: "Skip", onPress: () => onComplete([]) },
          ]
        );
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      Alert.alert("Error", "Failed to fetch contacts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [closestContacts, onComplete]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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
      } else {
        return [...prev, contact];
      }
    });
  }, []);

  const renderContact = useCallback(
    ({ item }: { item: Contact }) => (
      <TouchableOpacity
        onPress={() => toggleContactSelection(item)}
        style={tailwind`flex-row items-center p-4 border-b border-gray-200 ${
          selectedContacts.some((c) => c.id === item.id) ? "bg-red-100" : ""
        }`}
      >
        <User size={24} color="#EF4444" style={tailwind`mr-4`} />
        <Text style={tailwind`text-lg`}>{item.name}</Text>
      </TouchableOpacity>
    ),
    [selectedContacts, toggleContactSelection]
  );

  if (isLoading) {
    return (
      <View style={tailwind`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#EF4444" />
        <Text style={tailwind`mt-4 text-lg`}>Loading contacts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tailwind`flex-1 bg-white`}>
      <Text style={tailwind`text-2xl font-bold p-4`}>
        Select Contacts to Exclude
      </Text>
      <Text style={tailwind`text-base px-4 mb-4`}>
        These contacts will not be part of your network and won't see your
        profile.
      </Text>
      <View
        style={tailwind`flex-row items-center bg-gray-100 mx-4 my-2 p-2 rounded-full`}
      >
        <Search size={20} color="#EF4444" style={tailwind`mr-2`} />
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
            style={tailwind`mt-4 bg-red-600 px-4 py-2 rounded-md`}
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
          console.log("Excluded contacts:", selectedContacts);
          onComplete(selectedContacts);
        }}
        style={tailwind`bg-red-600 m-4 rounded-full py-4 px-8`}
      >
        <Text style={tailwind`text-white font-semibold text-center text-lg`}>
          {selectedContacts.length > 0
            ? `Exclude ${selectedContacts.length} contact${
                selectedContacts.length === 1 ? "" : "s"
              }`
            : "Skip Exclusion"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
