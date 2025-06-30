// import { Ionicons } from "@expo/vector-icons";

import { Tabs } from "expo-router";
import { Home, User } from "lucide-react-native";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#07a",
        tabBarInactiveTintColor: "#000",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarActiveTintColor: "#07a",
          tabBarInactiveTintColor: "#000",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarActiveTintColor: "#07a",
          tabBarInactiveTintColor: "#000",
        }}
      />
    </Tabs>
  );
}
