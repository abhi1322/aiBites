import React from "react";
import { Text, View } from "react-native";

// Step configuration
const STEPS = {
  BASIC_INFO: 0,
  HEIGHT: 1,
  WEIGHT: 2,
  NUTRITION: 3,
} as const;

type StepType = (typeof STEPS)[keyof typeof STEPS];

interface ProgressBarProps {
  currentStep: StepType;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <View className="px-6 pt-4">
      <View className="flex-row justify-between mb-2">
        {Object.values(STEPS).map((step) => (
          <Text
            key={step}
            className={`text-sm font-medium ${
              step <= currentStep ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {step === STEPS.BASIC_INFO && "Basic"}
            {step === STEPS.HEIGHT && "Height"}
            {step === STEPS.WEIGHT && "Weight"}
            {step === STEPS.NUTRITION && "Goals"}
          </Text>
        ))}
      </View>
      <View className="h-2 bg-gray-200 rounded-full">
        <View
          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / Object.keys(STEPS).length) * 100}%`,
          }}
        />
      </View>
    </View>
  );
};

export { STEPS };
export type { StepType };
