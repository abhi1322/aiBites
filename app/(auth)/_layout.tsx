import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function AuthRoutesLayout() {
  return (
    <>
      <StatusBar barStyle={"default"} backgroundColor={"auto"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
