import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { useState } from "react";
import LoadingScreen from "../components/LoadingScreen";

export default function AuthLayout() {
  const { user, isLoaded } = useUser();
  const [isReady, setIsReady] = useState(false);

  // Show loading screen while Clerk is loading or delay is active
  if (!isLoaded || !isReady) {
    return (
      <LoadingScreen
        delay={1000} // 1 second delay for auth screens
        onDelayComplete={() => setIsReady(true)}
      />
    );
  }

  // If user is already signed in, redirect to home
  if (user) {
    return <Redirect href="/(app)/(tabs)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
