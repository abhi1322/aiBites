import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

export const useAuthRedirect = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const segments = useSegments();

  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (!isLoaded || !user) return;

    // If user data is still loading, wait
    if (userData === undefined) return;

    // Check if we're already on profile-setup screen
    const isOnProfileSetup = segments.some(
      (segment) => segment === "profile-setup"
    );

    // If no user data exists, redirect to profile setup (unless already there)
    if (userData === null) {
      if (!isOnProfileSetup) {
        router.replace("/(app)/profile-setup");
      }
      return;
    }

    // If user exists but profile is not completed, redirect to profile setup (unless already there)
    if (!userData.profileCompleted) {
      if (!isOnProfileSetup) {
        router.replace("/(app)/profile-setup");
      }
      return;
    }

    // If user exists and profile is completed, redirect to home (unless already there)
    const isOnHome =
      segments.some((segment) => segment === "(tabs)") &&
      segments.some((segment) => segment === "home");
    if (!isOnHome) {
      router.replace("/(app)/(tabs)/home");
    }
  }, [user, isLoaded, userData, router, segments]);

  return {
    user,
    userData,
    isLoaded,
    isLoading: userData === undefined,
  };
};
