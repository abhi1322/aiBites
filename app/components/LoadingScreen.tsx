import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export const LoadingScreen = () => {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-gray-600 mt-4 text-base">Loading...</Text>
    </View>
  );
};
