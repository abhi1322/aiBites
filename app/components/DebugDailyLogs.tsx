import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function DebugDailyLogs() {
  const allDailyLogs = useQuery(api.food.getAllDailyLogs);

  if (!allDailyLogs) {
    return (
      <View className="bg-yellow-100 rounded-lg p-4 mt-4">
        <Text className="text-yellow-800 text-center">
          Loading all daily logs...
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <Text className="text-lg font-semibold mb-3 text-red-600">
        Debug: All Daily Logs ({allDailyLogs.length})
      </Text>

      <ScrollView className="max-h-40">
        {allDailyLogs.map((log, index) => (
          <View
            key={log._id}
            className="bg-red-50 rounded-lg p-3 mb-2 border border-red-200"
          >
            <Text className="text-sm font-medium text-red-800">
              Log {index + 1}: {log._id}
            </Text>
            <Text className="text-xs text-red-600">User: {log.userId}</Text>
            <Text className="text-xs text-red-600">Date: {log.date}</Text>
            <Text className="text-xs text-red-600">Meal: {log.mealType}</Text>
            <Text className="text-xs text-red-600">
              Quantity: {log.quantity}
            </Text>
            <Text className="text-xs text-red-600">
              Food Item ID: {log.foodItemId}
            </Text>
          </View>
        ))}
      </ScrollView>

      {allDailyLogs.length === 0 && (
        <View className="bg-red-50 rounded-lg p-4">
          <Text className="text-red-800 text-center">
            No daily logs found in database
          </Text>
        </View>
      )}
    </View>
  );
}
