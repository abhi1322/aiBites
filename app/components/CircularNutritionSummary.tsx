import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import moment from "moment";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "./AppText";
import CircularProgressRing from "./CircularProgressRing";

interface CircularNutritionSummaryProps {
  userId: string;
  selectedDate: moment.Moment;
  userGoals?: {
    calorieGoal?: number;
    proteinGoal?: number;
    carbGoal?: number;
    fatGoal?: number;
  };
}

interface RingConfig {
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor: string;
}

export default function CircularNutritionSummary({
  userId,
  selectedDate,
  userGoals,
}: CircularNutritionSummaryProps) {
  const [selectedNutrient, setSelectedNutrient] = useState<string>("calories");
  const [ringConfig, setRingConfig] = useState<RingConfig>({
    size: 120,
    strokeWidth: 12,
    color: "#3b82f6",
    backgroundColor: "#f3f4f6",
  });

  const dateString = selectedDate.format("YYYY-MM-DD");

  console.log("CircularNutritionSummary - dateString:", dateString);
  console.log("CircularNutritionSummary - userId:", userId);

  // Fetch food items for the selected date and user
  const foodItems = useQuery(api.food.getFoodItemsByDateAndCreatedBy, {
    createdBy: userId,
    date: dateString,
  });

  console.log("CircularNutritionSummary - foodItems:", foodItems);
  console.log(
    "CircularNutritionSummary - foodItems length:",
    foodItems?.length
  );

  if (!foodItems) {
    return (
      <View className="bg-[#f3f3f3] rounded-lg p-4 mt-4">
        <MotiView
          transition={{ type: "timing" }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 24,
          }}
        >
          <Skeleton
            colorMode={"light"}
            colors={["#e8e8e8", "#fff"]}
            radius={37.5}
            height={75}
            width={75}
          />
          <View style={{ width: 16 }} />
          <Skeleton
            colors={["#e8e8e8", "#fff"]}
            radius={37.5}
            height={75}
            width={75}
          />
          <View style={{ width: 16 }} />
          <Skeleton
            colors={["#e8e8e8", "#fff"]}
            radius={37.5}
            height={75}
            width={75}
          />
          <View style={{ width: 16 }} />
          <Skeleton
            colors={["#e8e8e8", "#fff"]}
            radius={37.5}
            height={75}
            width={75}
          />
        </MotiView>
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

  const nutritionData = [
    {
      key: "calories",
      label: "Calories",
      current: dailyTotals.calories,
      goal: userGoals?.calorieGoal || 0,
      color: "#121212", // Blue
      unit: "",
    },
    {
      key: "protein",
      label: "Protein",
      current: dailyTotals.protein,
      goal: userGoals?.proteinGoal || 0,
      color: "#121212", // Green
      unit: "g",
    },
    {
      key: "carbs",
      label: "Carbs",
      current: dailyTotals.carbs,
      goal: userGoals?.carbGoal || 0,
      color: "#121212", // Yellow
      unit: "g",
    },
    {
      key: "fat",
      label: "Fat",
      current: dailyTotals.fat,
      goal: userGoals?.fatGoal || 0,
      color: "#121212", // Red
      unit: "g",
    },
  ];

  const selectedData = nutritionData.find(
    (item) => item.key === selectedNutrient
  );

  return (
    <View className="mt-6">
      {/* All Nutrition Rings */}
      <View
        className="bg-white rounded-2xl px-4 py-6 border border-[#EBEBEB]"
        style={styles.shadow}
      >
        <AppText className="text-md font-medium text-gray-700 mb-3">
          {/* add condition to check if the date is today then write today summary else write  Summary of date*/}
          {selectedDate.isSame(moment(), "day")
            ? "Today's Summary"
            : `Summary of ${selectedDate.format("MMM DD, YYYY")}`}
        </AppText>
        <View className="flex-row justify-around">
          {nutritionData.map((item) => (
            <View key={item.key} className="items-center">
              <CircularProgressRing
                progress={getProgressPercentage(item.current, item.goal)}
                size={60}
                strokeWidth={6}
                color={item.color}
                backgroundColor="#f3f4f6"
                showPercentage={false}
                value={`${Math.round(item.current)}`}
                label={item.unit}
              />
              <AppText className="text-xs text-gray-600 mt-1">
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// make a style for shadow class
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
});
