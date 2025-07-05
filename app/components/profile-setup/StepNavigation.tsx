import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StepType } from "./ProgressBar";

interface StepNavigationProps {
  currentStep: StepType;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  handleCompleteProfile: () => void;
  isCurrentStepValid: () => boolean;
  isLoading: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  goToNextStep,
  goToPreviousStep,
  handleCompleteProfile,
  isCurrentStepValid,
  isLoading,
}) => {
  const isLastStep = currentStep === 3; // NUTRITION step

  return (
    <View className="px-6 pb-6 flex-row space-x-4">
      {currentStep > 0 && (
        <TouchableOpacity
          onPress={goToPreviousStep}
          className="flex-1 py-3 border border-gray-300 rounded-lg"
        >
          <Text className="text-gray-700 text-center font-semibold text-lg">
            Back
          </Text>
        </TouchableOpacity>
      )}

      {!isLastStep ? (
        <TouchableOpacity
          onPress={goToNextStep}
          disabled={!isCurrentStepValid()}
          className={`flex-1 py-3 rounded-lg ${
            isCurrentStepValid() ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Next
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleCompleteProfile}
          disabled={isLoading || !isCurrentStepValid()}
          className={`flex-1 py-3 rounded-lg ${
            isLoading || !isCurrentStepValid() ? "bg-gray-400" : "bg-green-600"
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isLoading ? "Completing..." : "Complete Profile"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
