import React from "react";
import ChatScreen from "../components/ChatScreen";
import { create } from "twrnc";

const tw = create(require("../tailwind.config.js"));

// Mock user data
const mockUserData = {
  _id: "1",
  name: "John Doe",
  location: "New York",
  profilePhoto: "https://randomuser.me/api/portraits/men/1.jpg",
  age: 28,
  sex: "Male",
  preference: "Female",
  school: "NYU",
  matches: [
    {
      _id: "2",
      name: "Jane Smith",
      location: "Los Angeles",
      profilePhoto: "https://randomuser.me/api/portraits/women/1.jpg",
      age: 26,
      sex: "Female",
      preference: "Male",
      school: "UCLA",
      matches: [],
    },
    {
      _id: "3",
      name: "Alice Johnson",
      location: "Chicago",
      profilePhoto: "https://randomuser.me/api/portraits/women/2.jpg",
      age: 27,
      sex: "Female",
      preference: "Male",
      school: "UChicago",
      matches: [],
    },
    {
      _id: "4",
      name: "Bob Williams",
      location: "San Francisco",
      profilePhoto: "https://randomuser.me/api/portraits/men/2.jpg",
      age: 29,
      sex: "Male",
      preference: "Female",
      school: "Stanford",
      matches: [],
    },
    {
      _id: "5",
      name: "Emma Brown",
      location: "Miami",
      profilePhoto: "https://randomuser.me/api/portraits/women/3.jpg",
      age: 25,
      sex: "Female",
      preference: "Male",
      school: "University of Miami",
      matches: [],
    },
    {
      _id: "6",
      name: "Michael Davis",
      location: "Seattle",
      profilePhoto: "https://randomuser.me/api/portraits/men/3.jpg",
      age: 30,
      sex: "Male",
      preference: "Female",
      school: "University of Washington",
      matches: [],
    },
  ],
};

export default function MatchesScreen() {
  return <ChatScreen userData={mockUserData} />;
}
