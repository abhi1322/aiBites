// import { Ionicons } from "@expo/vector-icons";

import { Tabs } from "expo-router";
import { Camera, Home, User } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "relative",
          height: 70,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          paddingBottom: 10,
          // Hide tab bar when camera is focused
          display: route.name === "camera" ? "none" : "flex",
        },
        tabBarActiveTintColor: "#07a",
        tabBarInactiveTintColor: "#000",
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          headerShown: false,
          title: "Camera",
          tabBarLabel: "Camera",
          tabBarIcon: ({ color, size }) => (
            <Camera color={"#fff"} size={size} />
          ),
          tabBarButton: ({ children, onPress, ...props }) => (
            <TouchableOpacity
              {...props}
              onPress={onPress}
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: [{ translateX: -30 }],
                backgroundColor: "#000",
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 5,
              }}
            >
              {children}
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
