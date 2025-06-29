import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { api } from "../../convex/_generated/api";
import { LoadingScreen } from "../components/LoadingScreen";

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  // Create user in Convex if they don't exist at all
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const createMinimalUser = async () => {
        try {
          await createOrUpdateUser({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? "",
            profileCompleted: false,
          });
        } catch (error) {
          console.error("Failed to create user in Convex:", error);
        }
      };

      createMinimalUser();
    }
  }, [isLoaded, isSignedIn, user, createOrUpdateUser]);

  // Simplified profile check - just allow access to the app
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // For now, just allow access to the app
      setIsCheckingProfile(false);
    } else if (isLoaded && !isSignedIn) {
      // User is not signed in, stop checking
      setIsCheckingProfile(false);
    }
  }, [isLoaded, isSignedIn, user]);

  // Show loading screen while Clerk is loading
  if (!isLoaded || isCheckingProfile) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ headerShown: false }} />
        <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
