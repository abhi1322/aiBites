import { useClerk, useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../convex/_generated/api";

export default function HomeScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();

  // Fetch user data from Convex
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Welcome back!
            </Text>
            <Text className="text-gray-600">
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            className="px-4 py-2 bg-red-500 rounded-lg"
          >
            <Text className="text-white font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View className="bg-blue-50 rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Your Profile
          </Text>
          {convexUser ? (
            <View className="space-y-2">
              <Text className="text-gray-700">
                Height: {convexUser.height} cm
              </Text>
              <Text className="text-gray-700">
                Weight: {convexUser.weight} kg
              </Text>
              <Text className="text-gray-700">Gender: {convexUser.gender}</Text>
              <Text className="text-gray-700">
                Daily Calorie Goal: {convexUser.calorieGoal} calories
              </Text>
              {convexUser.proteinGoal && (
                <Text className="text-gray-700">
                  Protein Goal: {convexUser.proteinGoal}g
                </Text>
              )}
              {convexUser.carbGoal && (
                <Text className="text-gray-700">
                  Carb Goal: {convexUser.carbGoal}g
                </Text>
              )}
              {convexUser.fatGoal && (
                <Text className="text-gray-700">
                  Fat Goal: {convexUser.fatGoal}g
                </Text>
              )}
            </View>
          ) : (
            <Text className="text-gray-600">Loading profile...</Text>
          )}
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center items-center">
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Profile Complete!
          </Text>
          <Text className="text-gray-600 text-center text-lg">
            You have successfully completed your profile setup and can now
            access the full app.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
