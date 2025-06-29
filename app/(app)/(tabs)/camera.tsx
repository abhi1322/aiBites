import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraTab() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Camera Section
        </Text>
        <Text className="text-gray-600 text-center px-4">
          This is where your camera functionality will be implemented.
        </Text>
      </View>
    </SafeAreaView>
  );
}
