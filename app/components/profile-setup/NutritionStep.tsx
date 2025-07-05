import React from "react";
import { Text, TextInput, View } from "react-native";

interface NutritionStepProps {
  calorieGoal: string;
  proteinGoal: string;
  carbGoal: string;
  fatGoal: string;
  updateCalorieGoal: (goal: string) => void;
  updateProteinGoal: (goal: string) => void;
  updateCarbGoal: (goal: string) => void;
  updateFatGoal: (goal: string) => void;
}

export const NutritionStep: React.FC<NutritionStepProps> = ({
  calorieGoal,
  proteinGoal,
  carbGoal,
  fatGoal,
  updateCalorieGoal,
  updateProteinGoal,
  updateCarbGoal,
  updateFatGoal,
}) => {
  return (
    <View className="space-y-6">
      <View className="text-center">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Nutrition Goals
        </Text>
        <Text className="text-gray-600">
          Set your daily calorie and macronutrient targets
        </Text>
      </View>

      {/* Calorie Goal */}
      <View>
        <Text className="text-gray-700 font-semibold mb-2">
          Daily Calorie Goal *
        </Text>
        <TextInput
          value={calorieGoal}
          onChangeText={updateCalorieGoal}
          placeholder="e.g. 2000"
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
          keyboardType="numeric"
          autoCorrect={false}
          spellCheck={false}
        />
      </View>

      {/* Macronutrients */}
      <View className="space-y-4">
        <Text className="text-gray-700 font-semibold">
          Macronutrients (Optional)
        </Text>

        <View>
          <Text className="text-gray-600 mb-2">Protein Goal (g)</Text>
          <TextInput
            value={proteinGoal}
            onChangeText={updateProteinGoal}
            placeholder="e.g. 150"
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            keyboardType="numeric"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View>
          <Text className="text-gray-600 mb-2">Carb Goal (g)</Text>
          <TextInput
            value={carbGoal}
            onChangeText={updateCarbGoal}
            placeholder="e.g. 250"
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            keyboardType="numeric"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View>
          <Text className="text-gray-600 mb-2">Fat Goal (g)</Text>
          <TextInput
            value={fatGoal}
            onChangeText={updateFatGoal}
            placeholder="e.g. 70"
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            keyboardType="numeric"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>
      </View>

      <View className="bg-green-50 rounded-lg p-4">
        <Text className="text-green-800 text-sm">
          🎯 Tip: Start with calorie goals first. You can always adjust
          macronutrients later based on your progress.
        </Text>
      </View>
    </View>
  );
};
