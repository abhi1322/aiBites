import { router } from "expo-router";
import { useEffect } from "react";

export default function AppIndexRedirect() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/(app)/(tabs)/home");
    }, 0);
    return () => clearTimeout(timeout);
  }, []);
  return null;
}
