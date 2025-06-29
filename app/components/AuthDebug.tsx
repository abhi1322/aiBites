import { useAuth, useUser } from "@clerk/clerk-expo";
import React from "react";
import { Text, View } from "react-native";

export const AuthDebug = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <View className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <Text className="text-yellow-800 font-semibold">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="p-4 bg-blue-100 border border-blue-400 rounded m-4">
      <Text className="text-blue-800 font-semibold mb-2">Auth Debug Info:</Text>
      <Text className="text-blue-700">
        Is Loaded: {isLoaded ? "Yes" : "No"}
      </Text>
      <Text className="text-blue-700">
        Is Signed In: {isSignedIn ? "Yes" : "No"}
      </Text>
      {user && (
        <Text className="text-blue-700">
          User: {user.firstName || user.emailAddresses[0]?.emailAddress}
        </Text>
      )}
    </View>
  );
};
