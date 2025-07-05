import React from "react";
import { Text, TextInput, View } from "react-native";

interface WeightStepProps {
  weight: number;
  updateWeight: (weight: number) => void;
}

export const WeightStep: React.FC<WeightStepProps> = ({
  weight,
  updateWeight,
}) => {
  return (
    <View className="space-y-6">
      <View className="text-center">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Your Weight
        </Text>
        <Text className="text-gray-600">
          Enter your current weight in kilograms
        </Text>
      </View>

      <View>
        <Text className="text-gray-700 font-semibold mb-2">Weight (kg) *</Text>
        <TextInput
          value={weight.toString()}
          onChangeText={(text) => updateWeight(Number(text) || 0)}
          placeholder="e.g. 70"
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg text-center"
          keyboardType="numeric"
          autoCorrect={false}
          spellCheck={false}
        />
      </View>

      <View className="bg-blue-50 rounded-lg p-4">
        <Text className="text-blue-800 text-sm">
          💡 Tip: 1 kg = 2.2 lbs. You can use a bathroom scale or check recent
          medical records.
        </Text>
      </View>
    </View>
  );
};
