import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { View } from "react-native";
import { api } from "../../convex/_generated/api";
import { AppText } from "../components/AppText";

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

  // Show Lottie loading animation instead of skeleton
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <LottieView
        source={require("@/assets/lottie/user_loading.json")}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
      <AppText tweight="regular" className="text-center text-neutral-400 mt-4">
        Loading your data...
      </AppText>
    </View>
  );
}
