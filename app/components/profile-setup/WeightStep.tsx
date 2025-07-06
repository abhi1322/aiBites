import React from "react";
import { Text, View } from "react-native";
import { RulerPicker } from "react-native-ruler-picker";

interface WeightStepProps {
  weight: number;
  updateWeight: (weight: number) => void;
}

export const WeightStep: React.FC<WeightStepProps> = ({
  weight,
  updateWeight,
}) => {
  const weightValue = weight || 70;
  return (
    <View className="flex-1 justify-between pb-20">
      <View className="space-y-6">
        <View className="text-center">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Your Weight
          </Text>
          <Text className="text-gray-600">
            Enter your current weight in kilograms
          </Text>
        </View>

        <View className="bg-blue-50 rounded-lg p-4">
          <Text className="text-blue-800 text-sm">
            💡 Tip: 1 kg = 2.2 lbs. You can use a bathroom scale or check recent
            medical records.
          </Text>
        </View>
      </View>

      <View className="items-center space-y-4">
        <Text className="text-3xl font-bold text-blue-600">
          {weightValue} kg
        </Text>
        <RulerPicker
          min={30}
          max={200}
          step={1}
          fractionDigits={0}
          initialValue={weightValue}
          onValueChangeEnd={(val: string) => updateWeight(Number(val))}
          unit="kg"
          width={300}
          height={80}
          indicatorColor="#3b82f6"
        />
      </View>
    </View>
  );
};
