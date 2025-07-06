import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

export default function ProtectedLayout() {
  const { user, isLoaded } = useUser();
  const { isLoading } = useAuthRedirect();
  const [isReady, setIsReady] = useState(false);

  // Show loading screen while Clerk is loading, auth redirect is processing, or delay is active
  if (!isLoaded || !isReady || isLoading) {
    return (
      <LoadingScreen
        delay={1000} // 1 second delay for app screens
        onDelayComplete={() => setIsReady(true)}
      />
    );
  }

  // If user is not signed in, redirect to sign-in
  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="camera" options={{ title: "Camera" }} />
      <Stack.Screen
        name="profile-setup"
        options={{ title: "Complete Profile" }}
      />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
}
