import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

export default function AppIndexRedirect() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (!user) return;

    // If user data is still loading, wait
    if (userData === undefined) return;

    const timeout = setTimeout(() => {
      // If no user data exists or profile is not completed, redirect to profile setup
      if (userData === null || !userData.profileCompleted) {
        router.replace("/(app)/profile-setup");
      } else {
        // If user exists and profile is completed, redirect to home
        router.replace("/(app)/(tabs)/home");
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [user, userData]);

  return null;
}
