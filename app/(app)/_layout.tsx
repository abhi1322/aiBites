import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="camera" options={{ title: "Camera" }} />
      <Stack.Screen
        name="profile-setup"
        options={{ title: "Complete Profile" }}
      />
    </Stack>
  );
}
