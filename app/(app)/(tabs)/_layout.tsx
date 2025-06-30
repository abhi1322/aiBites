// import { Ionicons } from "@expo/vector-icons";

import { Tabs } from "expo-router";
import { Camera, Home, User } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import CustomTabBar from "../components/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "relative",
        },
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
        name="camera"
        options={{
          headerShown: false,
          title: "Camera",
          tabBarLabel: "Camera",
          tabBarIcon: ({ color, size }) => (
            <Camera color={"#fff"} size={size} />
          ),
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#f7f2f2",
          tabBarLabelStyle: {
            color: "#fff",
          },
          tabBarButton: ({ children, disabled, onPress, ...props }) => {
            const filteredProps = Object.fromEntries(
              Object.entries(props).filter(([_, v]) => v !== null)
            );
            return (
              <TouchableOpacity
                {...filteredProps}
                disabled={!!disabled}
                delayLongPress={0}
                activeOpacity={1}
                onPress={onPress}
                style={{
                  position: "absolute",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  top: 0,
                  right: "50%",
                  transform: [{ translateX: 50 }, { translateY: -50 }],
                  backgroundColor: "#000",
                  padding: 20,
                  borderRadius: 100,
                }}
              >
                {children}
              </TouchableOpacity>
            );
          },
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
