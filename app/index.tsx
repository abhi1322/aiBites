import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";

export default function Index() {
  const { user, isLoaded } = useUser();
  const [isReady, setIsReady] = useState(false);

  // Show loading screen while Clerk is loading or delay is active
  if (!isLoaded || !isReady) {
    return (
      <LoadingScreen
        delay={2000} // 2 seconds delay for smooth transition
        onDelayComplete={() => setIsReady(true)}
      />
    );
  }

  // If user is signed in, redirect to home
  if (user) {
    return <Redirect href="/(app)/(tabs)/home" />;
  }

  // If user is not signed in, redirect to sign-in
  return <Redirect href="/(auth)/sign-in" />;
}
