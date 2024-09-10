import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false, // This line hides the header for all tab screens
        tabBarIcon: ({ color, size }) => {
          let iconName: IconName;

          switch (route.name) {
            case "discover":
              iconName = "compass";
              break;
            case "search":
              iconName = "search";
              break;
            case "likes":
              iconName = "heart";
              break;
            case "matches":
              iconName = "chatbubbles";
              break;
            case "profile":
              iconName = "person";
              break;
            default:
              iconName = "alert-circle"; // Default icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: "Likes",
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
