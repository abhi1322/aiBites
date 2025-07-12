import { AppText } from "@/app/components/AppText";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";
import { api } from "../../../convex/_generated/api";

export default function NutritionGoalsScreen() {
  const { user } = useUser();
  const router = useRouter();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const updateUserGoals = useMutation(api.users.updateUserGoals);

  const [isSaving, setIsSaving] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState(
    userData?.calorieGoal?.toString() || ""
  );
  const [proteinGoal, setProteinGoal] = useState(
    userData?.proteinGoal?.toString() || ""
  );
  const [carbGoal, setCarbGoal] = useState(
    userData?.carbGoal?.toString() || ""
  );
  const [fatGoal, setFatGoal] = useState(userData?.fatGoal?.toString() || "");

  // Update local state when userData changes
  React.useEffect(() => {
    if (userData) {
      setCalorieGoal(userData.calorieGoal?.toString() || "");
      setProteinGoal(userData.proteinGoal?.toString() || "");
      setCarbGoal(userData.carbGoal?.toString() || "");
      setFatGoal(userData.fatGoal?.toString() || "");
    }
  }, [userData]);

  if (!user) return null;
  if (userData === undefined)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-neutral-500">Loading...</Text>
      </View>
    );
  if (userData === null)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-neutral-500">No user data found.</Text>
      </View>
    );

  const handleSave = async () => {
    if (!user?.id) {
      Toast.error("User not authenticated");
      return;
    }

    // Validate inputs
    const calorieValue = parseFloat(calorieGoal);
    const proteinValue = parseFloat(proteinGoal);
    const carbValue = parseFloat(carbGoal);
    const fatValue = parseFloat(fatGoal);

    if (isNaN(calorieValue) || calorieValue <= 0) {
      Toast.error("Please enter a valid calorie goal");
      return;
    }

    if (isNaN(proteinValue) || proteinValue < 0) {
      Toast.error("Please enter a valid protein goal");
      return;
    }

    if (isNaN(carbValue) || carbValue < 0) {
      Toast.error("Please enter a valid carbohydrate goal");
      return;
    }

    if (isNaN(fatValue) || fatValue < 0) {
      Toast.error("Please enter a valid fat goal");
      return;
    }

    setIsSaving(true);
    try {
      await updateUserGoals({
        clerkId: user.id,
        calorieGoal: calorieValue,
        proteinGoal: proteinValue,
        carbGoal: carbValue,
        fatGoal: fatValue,
      });

      Toast.success("Nutrition goals updated successfully!");

      // Navigate back after a short delay to show the toast
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Error updating nutrition goals:", error);
      Toast.error("Failed to update nutrition goals. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case "weightLoss":
        setCalorieGoal("1800");
        setProteinGoal("150g");
        setCarbGoal("180g");
        setFatGoal("60g");
        Toast.info("Weight Loss preset applied!");
        break;
      case "maintenance":
        setCalorieGoal("2000");
        setProteinGoal("120g");
        setCarbGoal("250g");
        setFatGoal("67g");
        Toast.info("Maintenance preset applied!");
        break;
      case "muscleGain":
        setCalorieGoal("2200");
        setProteinGoal("180g");
        setCarbGoal("220g");
        setFatGoal("73g");
        Toast.info("Muscle Gain preset applied!");
        break;
    }
  };

  const hasChanges = () => {
    return (
      calorieGoal !== (userData?.calorieGoal?.toString() || "") ||
      proteinGoal !== (userData?.proteinGoal?.toString() || "") ||
      carbGoal !== (userData?.carbGoal?.toString() || "") ||
      fatGoal !== (userData?.fatGoal?.toString() || "")
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white mt-4 pb-4 px-4 ">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <AppText className="text-lg font-semibold text-neutral-900 ml-2">
            Nutrition Goals
          </AppText>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving || !hasChanges()}
            className={`px-4 py-2 rounded-full ${
              isSaving || !hasChanges() ? "bg-gray-300" : "bg-neutral-800"
            }`}
          >
            {isSaving ? (
              <ActivityIndicator size={16} color="white" />
            ) : (
              <AppText className="text-white font-semibold">Save</AppText>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        className="flex-col gap-6 px-4 pt-6"
      >
        {/* Daily Calories */}
        <View
          className="bg-white rounded-3xl border border-neutral-200"
          style={styles.shadow}
        >
          <View className=" border-b border-neutral-200 py-8 px-8">
            <AppText className="text-lg font-semibold text-neutral-900 mb-4">
              Daily Calories
            </AppText>
            <View className="mb-4">
              <AppText className="text-sm font-medium text-neutral-700 mb-2">
                Target Calories
              </AppText>
              <TextInput
                className="border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900"
                placeholder="Enter daily calorie goal"
                value={calorieGoal}
                onChangeText={setCalorieGoal}
                keyboardType="numeric"
              />
              <AppText className="text-xs text-neutral-500 mt-1">
                Recommended: 2000 calories per day
              </AppText>
            </View>
          </View>

          {/* Macronutrients */}
          <View className="py-8 px-8">
            <AppText className="text-lg font-semibold text-neutral-900 mb-4">
              Macronutrients
            </AppText>

            <View className="mb-4">
              <AppText className="text-sm font-medium text-neutral-700 mb-2">
                Protein (grams)
              </AppText>
              <TextInput
                className="border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900"
                placeholder="Enter protein goal"
                value={proteinGoal}
                onChangeText={setProteinGoal}
                keyboardType="numeric"
              />
              <AppText className="text-xs text-neutral-500 mt-1">
                Recommended: 0.8g per kg of body weight
              </AppText>
            </View>

            <View className="mb-4">
              <AppText className="text-sm font-medium text-neutral-700 mb-2">
                Carbohydrates (grams)
              </AppText>
              <TextInput
                className="border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900"
                placeholder="Enter carb goal"
                value={carbGoal}
                onChangeText={setCarbGoal}
                keyboardType="numeric"
              />
              <AppText className="text-xs text-neutral-500 mt-1">
                Recommended: 45-65% of daily calories
              </AppText>
            </View>

            <View className="mb-4">
              <AppText className="text-sm font-medium text-neutral-700 mb-2">
                Fat (grams)
              </AppText>
              <TextInput
                className="border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900"
                placeholder="Enter fat goal"
                value={fatGoal}
                onChangeText={setFatGoal}
                keyboardType="numeric"
              />
              <AppText className="text-xs text-neutral-500 mt-1">
                Recommended: 20-35% of daily calories
              </AppText>
            </View>
          </View>
        </View>

        {/* Quick Presets */}
        <View
          className="bg-white rounded-3xl border py-8 px-8 border-neutral-200 my-8"
          style={styles.shadow}
        >
          <AppText className="text-lg font-semibold text-neutral-900 mb-4">
            Quick Presets
          </AppText>

          <TouchableOpacity
            className="bg-neutral-100 p-4 rounded-lg mb-3"
            onPress={() => applyPreset("weightLoss")}
          >
            <AppText className="font-medium text-neutral-900">
              Weight Loss
            </AppText>
            <AppText className="text-sm text-neutral-500">
              1800 calories, 150g protein
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-neutral-100 p-4 rounded-lg mb-3"
            onPress={() => applyPreset("maintenance")}
          >
            <AppText className="font-medium text-neutral-900">
              Maintenance
            </AppText>
            <AppText className="text-sm text-neutral-500">
              2000 calories, 120g protein
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-neutral-100 p-4 rounded-lg"
            onPress={() => applyPreset("muscleGain")}
          >
            <AppText className="font-medium text-neutral-900">
              Muscle Gain
            </AppText>
            <AppText className="text-sm text-neutral-500">
              2200 calories, 180g protein
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
