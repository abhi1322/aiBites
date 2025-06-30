import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { Redirect } from "expo-router";
import React from "react";
import { api } from "../../convex/_generated/api";
import LoadingScreen from "../components/LoadingScreen";

export default function AppIndex() {
  const { user } = useUser();

  // Fetch user from Convex
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Show loading while fetching user data
  if (user?.id && convexUser === undefined) {
    return <LoadingScreen />;
  }

  // Show profile setup if user doesn't exist in Convex OR profile is not completed
  if (convexUser === null || convexUser?.profileCompleted === false) {
    return <Redirect href="/(app)/profile-setup" />;
  }

  // Show main app if user exists and profile is completed
  if (convexUser && convexUser.profileCompleted === true) {
    return <Redirect href="/(app)/home" />;
  }

  // Fallback - show loading
  return <LoadingScreen />;
}
