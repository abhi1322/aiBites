import { router } from "expo-router";
import { useEffect } from "react";

export default function RootIndexRedirect() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/(auth)/sign-in");
    }, 0);
    return () => clearTimeout(timeout);
  }, []);
  return null;
}
