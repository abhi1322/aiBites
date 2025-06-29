import { SignOutButton } from "@/app/components/SignOutButton";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileTab() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  const navigateToProfileSetup = () => {
    router.push("/(app)/profile-setup");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Profile Section
        </Text>
        <View className="bg-gray-100 p-6 rounded-lg w-full max-w-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Welcome,{" "}
            {user?.firstName || user?.emailAddresses[0]?.emailAddress || "User"}
            !
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            This is where your profile information and settings will be
            displayed.
          </Text>

          {/* Profile Setup Button */}
          <TouchableOpacity
            onPress={navigateToProfileSetup}
            className="bg-blue-500 py-3 px-6 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">
              Complete Profile Setup
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-end">
          <SignOutButton />
        </View>
      </View>
    </SafeAreaView>
  );
}
