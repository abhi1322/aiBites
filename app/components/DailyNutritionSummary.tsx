import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import moment from "moment";
import React from "react";
import { Text, View } from "react-native";

interface DailyNutritionSummaryProps {
  userId: string;
  selectedDate: moment.Moment;
  userGoals?: {
    calorieGoal?: number;
    proteinGoal?: number;
    carbGoal?: number;
    fatGoal?: number;
  };
}

export default function DailyNutritionSummary({
  userId,
  selectedDate,
  userGoals,
}: DailyNutritionSummaryProps) {
  const dateString = selectedDate.format("YYYY-MM-DD");

  console.log("dateString", dateString);
  console.log("userId passed to component:", userId);

  // Fetch food items for the selected date and user
  const foodItems = useQuery(api.food.getFoodItemsByDateAndCreatedBy, {
    createdBy: userId,
    date: dateString,
  });

  console.log("foodItems", foodItems);
  console.log("foodItems length:", foodItems?.length);

  if (!foodItems) {
    return (
      <View className="bg-gray-100 rounded-lg p-4 mt-4">
        <Text className="text-gray-500 text-center">
          Loading nutrition data...
        </Text>
      </View>
    );
  }

  // Calculate daily totals
  const dailyTotals = foodItems.reduce(
    (totals, foodItem) => {
      return {
        calories: totals.calories + (foodItem.calories?.total || 0),
        protein: totals.protein + (foodItem.protein || 0),
        carbs: totals.carbs + (foodItem.carbs || 0),
        fat: totals.fat + (foodItem.fat || 0),
        fiber: totals.fiber + (foodItem.fiber || 0),
      };
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    }
  );

  // Calculate progress percentages
  const getProgressPercentage = (current: number, goal: number) => {
    if (!goal || goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <View className="mt-4">
      <Text className="text-lg font-semibold mb-3">
        Daily Summary - {selectedDate.format("MMM DD, YYYY")}
      </Text>

      <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        {/* Calories */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-sm font-medium text-gray-700">Calories</Text>
            <Text className="text-sm text-gray-600">
              {Math.round(dailyTotals.calories)} / {userGoals?.calorieGoal || 0}{" "}
              kcal
            </Text>
          </View>
          <View className="bg-gray-200 rounded-full h-2">
            <View
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${getProgressPercentage(dailyTotals.calories, userGoals?.calorieGoal || 0)}%`,
              }}
            />
          </View>
        </View>

        {/* Macronutrients */}
        <View className="space-y-3">
          {/* Protein */}
          <View>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm font-medium text-gray-700">Protein</Text>
              <Text className="text-sm text-gray-600">
                {Math.round(dailyTotals.protein)} /{" "}
                {userGoals?.proteinGoal || 0}g
              </Text>
            </View>
            <View className="bg-gray-200 rounded-full h-2">
              <View
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${getProgressPercentage(dailyTotals.protein, userGoals?.proteinGoal || 0)}%`,
                }}
              />
            </View>
          </View>

          {/* Carbs */}
          <View>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm font-medium text-gray-700">Carbs</Text>
              <Text className="text-sm text-gray-600">
                {Math.round(dailyTotals.carbs)} / {userGoals?.carbGoal || 0}g
              </Text>
            </View>
            <View className="bg-gray-200 rounded-full h-2">
              <View
                className="bg-yellow-500 h-2 rounded-full"
                style={{
                  width: `${getProgressPercentage(dailyTotals.carbs, userGoals?.carbGoal || 0)}%`,
                }}
              />
            </View>
          </View>

          {/* Fat */}
          <View>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm font-medium text-gray-700">Fat</Text>
              <Text className="text-sm text-gray-600">
                {Math.round(dailyTotals.fat)} / {userGoals?.fatGoal || 0}g
              </Text>
            </View>
            <View className="bg-gray-200 rounded-full h-2">
              <View
                className="bg-red-500 h-2 rounded-full"
                style={{
                  width: `${getProgressPercentage(dailyTotals.fat, userGoals?.fatGoal || 0)}%`,
                }}
              />
            </View>
          </View>

          {/* Fiber */}
          <View>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm font-medium text-gray-700">Fiber</Text>
              <Text className="text-sm text-gray-600">
                {Math.round(dailyTotals.fiber)}g
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
