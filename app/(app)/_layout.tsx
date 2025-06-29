import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";
import { LoadingScreen } from "../components/LoadingScreen";

export default function AppLayout() {
  const { isLoaded } = useAuth();

  // Show loading screen while Clerk is loading
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
