import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { create } from "twrnc";
import { User, Search, MessageCircle, UserCircle } from "lucide-react-native";

const tw = create(require("../../tailwind.config.js"));

interface NavItemProps {
  name: string;
  icon: React.ElementType;
  label: string;
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({
  name,
  icon: Icon,
  label,
  currentScreen,
  onNavigate,
}) => (
  <TouchableOpacity style={tw`items-center`} onPress={() => onNavigate(name)}>
    <Icon
      size={20}
      color={
        currentScreen === name ? tw.color("indigo-900") : tw.color("gray-600")
      }
    />
    <Text
      style={tw`text-xs ${
        currentScreen === name ? "text-indigo-900" : "text-gray-600"
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

interface NavigationBarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export default function NavigationBar({
  currentScreen,
  onNavigate,
}: NavigationBarProps) {
  return (
    <View
      style={tw`flex-row justify-around py-4 bg-white border-t border-gray-200`}
    >
      <NavItem
        name="discover"
        icon={User}
        label="Discover"
        currentScreen={currentScreen}
        onNavigate={onNavigate}
      />
      <NavItem
        name="search"
        icon={Search}
        label="Search"
        currentScreen={currentScreen}
        onNavigate={onNavigate}
      />
      <NavItem
        name="chat"
        icon={MessageCircle}
        label="Chat"
        currentScreen={currentScreen}
        onNavigate={onNavigate}
      />
      <NavItem
        name="profile"
        icon={UserCircle}
        label="Profile"
        currentScreen={currentScreen}
        onNavigate={onNavigate}
      />
    </View>
  );
}
