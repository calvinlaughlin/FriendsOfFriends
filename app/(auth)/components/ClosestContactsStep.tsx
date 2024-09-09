import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { tailwind } from "../../../tailwind";
import { User } from "lucide-react-native";

interface Contact {
  id: string;
  name: string;
}

interface ClosestContactsStepProps {
  onComplete: () => void;
}

const ClosestContactsStep: React.FC<ClosestContactsStepProps> = ({
  onComplete,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // Simulating fetching contacts
    const fetchedContacts = [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Alice Johnson" },
      { id: "4", name: "Bob Williams" },
      { id: "5", name: "Emma Brown" },
    ];
    setContacts(fetchedContacts);
  }, []);

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={tailwind`flex-row items-center p-4 border-b border-gray-200`}>
      <User size={24} color="#4F46E5" style={tailwind`mr-4`} />
      <Text style={tailwind`text-lg`}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={tailwind`flex-1 bg-white`}>
      <Text style={tailwind`text-2xl font-bold p-4`}>Your Contacts</Text>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tailwind`flex-grow`}
      />
      <TouchableOpacity
        onPress={onComplete}
        style={tailwind`bg-indigo-600 m-4 rounded-full py-4 px-8`}
      >
        <Text style={tailwind`text-white font-semibold text-center text-lg`}>
          Continue
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ClosestContactsStep;
