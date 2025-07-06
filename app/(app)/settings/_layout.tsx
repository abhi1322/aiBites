import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="nutrition-goals" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="data-privacy" />
      <Stack.Screen name="health-insights" />
      <Stack.Screen name="help-support" />
      <Stack.Screen name="privacy-policy" />
    </Stack>
  );
}
