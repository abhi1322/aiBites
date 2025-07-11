// import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/app/components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { Home, User } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "relative",
          height: 90,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          // paddingBottom: 10,
          paddingTop: 10,
          // Hide tab bar when camera is focused
          display: route.name === "camera" ? "none" : "flex",

          shadowColor: "#000000",
          shadowOffset: {
            width: -14,
            height: -10,
          },
          shadowOpacity: 0.05,
          shadowRadius: 39,
          elevation: 10,
        },
        tabBarActiveTintColor: "#333333",
        tabBarInactiveTintColor: "#A8A8A8",
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
          tabBarButton: ({ children, onPress, ...props }) => (
            <TouchableOpacity
              onPress={onPress}
              accessibilityLabel={props.accessibilityLabel}
              testID={props.testID}
              className="border border-[#2D2D2D] rounded-full"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: -40,
                left: "50%",
                transform: [{ translateX: "-50%" }],
                backgroundColor: "transparent",
                width: 180,
                height: 60,
                borderRadius: 30,
                // overflow: "hidden", // Ensures gradient is clipped
                // zIndex: 1000,
                // add shadow
                shadowColor: "#000000",
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                // elevation: 10,
              }}
            >
              <LinearGradient
                colors={["#202020", "#121212"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0, y: 1 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: 30,
                }}
                className=""
              />
              <Image
                source={require("@/assets/icons/scan-camera.png")}
                className="w-8 h-8 mr-1 "
                resizeMode="contain"
                style={{ zIndex: 1 }}
              />
              <AppText
                className="text-[#CDCDCD] capitalize"
                style={{ zIndex: 1 }}
              >
                Scan your meal
              </AppText>
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
