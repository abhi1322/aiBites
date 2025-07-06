import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../../convex/_generated/api";

export default function NutritionGoalsScreen() {
  const { user } = useUser();
  const router = useRouter();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!user) return null;
  if (userData === undefined)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  if (userData === null)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">No user data found.</Text>
      </View>
    );

  const handleSave = () => {
    Alert.alert("Success", "Nutrition goals updated successfully!");
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <ArrowLeft size={24} color="#374151" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">
              Nutrition Goals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Daily Calories */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Daily Calories
          </Text>
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Target Calories
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter daily calorie goal"
              defaultValue={userData.calorieGoal?.toString() || ""}
              keyboardType="numeric"
            />
            <Text className="text-xs text-gray-500 mt-1">
              Recommended: 2000 calories per day
            </Text>
          </View>
        </View>

        {/* Macronutrients */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Macronutrients
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Protein (grams)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter protein goal"
              defaultValue={userData.proteinGoal?.toString() || ""}
              keyboardType="numeric"
            />
            <Text className="text-xs text-gray-500 mt-1">
              Recommended: 0.8g per kg of body weight
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Carbohydrates (grams)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter carb goal"
              defaultValue={userData.carbGoal?.toString() || ""}
              keyboardType="numeric"
            />
            <Text className="text-xs text-gray-500 mt-1">
              Recommended: 45-65% of daily calories
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Fat (grams)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter fat goal"
              defaultValue={userData.fatGoal?.toString() || ""}
              keyboardType="numeric"
            />
            <Text className="text-xs text-gray-500 mt-1">
              Recommended: 20-35% of daily calories
            </Text>
          </View>
        </View>

        {/* Quick Presets */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Quick Presets
          </Text>

          <TouchableOpacity className="bg-gray-100 p-4 rounded-lg mb-3">
            <Text className="font-medium text-gray-900">Weight Loss</Text>
            <Text className="text-sm text-gray-500">
              1800 calories, 150g protein
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-100 p-4 rounded-lg mb-3">
            <Text className="font-medium text-gray-900">Maintenance</Text>
            <Text className="text-sm text-gray-500">
              2000 calories, 120g protein
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-100 p-4 rounded-lg">
            <Text className="font-medium text-gray-900">Muscle Gain</Text>
            <Text className="text-sm text-gray-500">
              2200 calories, 180g protein
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
