import { SignedIn, useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { StatusBar } from "react-native";
import { api } from "../../convex/_generated/api";
import LoadingScreen from "../components/LoadingScreen";

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const hasAttemptedCreation = useRef(false);

  // Fetch user from Convex
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  console.log("App Layout Debug:", {
    isLoaded,
    isSignedIn,
    userId: user?.id,
    convexUser: convexUser
      ? { profileCompleted: convexUser.profileCompleted }
      : convexUser,
  });

  // Create user in Convex if they don't exist
  useEffect(() => {
    if (
      isLoaded &&
      isSignedIn &&
      user?.id &&
      convexUser === null &&
      !hasAttemptedCreation.current
    ) {
      console.log("Creating user in Convex:", user.id);
      hasAttemptedCreation.current = true;
      createOrUpdateUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        profileCompleted: false,
      }).catch((error) => {
        console.error("Failed to create user in Convex:", error);
        hasAttemptedCreation.current = false;
      });
    }
  }, [isLoaded, isSignedIn, user?.id, convexUser, createOrUpdateUser]);

  // Redirect to auth if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/(auth)/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  // Show loading while fetching user data
  if (isSignedIn && user?.id && convexUser === undefined) {
    return <LoadingScreen />;
  }

  return (
    <SignedIn>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
      </Stack>
    </SignedIn>
  );
}
