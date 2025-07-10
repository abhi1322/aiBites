import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { AppText } from "../AppText";
import { DarkButton } from "../ui/Button";

interface StepNavigationProps {
  currentStep: number;
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
    <View
      className={`px-6 w-[100vw] pb-6 flex-row space-x-4  justify-end ${
        currentStep === 0 ? "justify-end" : "justify-between"
      }`}
    >
      {currentStep > 0 && (
        <TouchableOpacity
          onPress={goToPreviousStep}
          activeOpacity={0.8}
          className="w-[15vw]  h-full rounded-lg"
        >
          <LinearGradient
            colors={["#fff", "#f3f4f6"]} // LightButton gradient
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E0E0E0",
              height: 70,
            }}
          >
            <ArrowLeftIcon size={20} color="#222" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {!isLastStep ? (
        <DarkButton
          onPress={goToNextStep}
          icon={<ArrowRightIcon size={20} color="#fff" />}
          iconPosition="right"
          disabled={!isCurrentStepValid()}
          className={`flex-1 py-3 rounded-lg px-4 ${
            isCurrentStepValid() ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          <AppText
            tweight="semibold"
            className="text-white text-center text-lg"
          >
            Next
          </AppText>
        </DarkButton>
      ) : (
        <DarkButton
          onPress={handleCompleteProfile}
          disabled={isLoading || !isCurrentStepValid()}
          className={`flex-1 py-3 rounded-lg ${
            isLoading || !isCurrentStepValid() ? "bg-gray-400" : "bg-green-600"
          }`}
        >
          <AppText
            tweight="semibold"
            className="text-white text-center text-lg"
          >
            {isLoading ? "Completing..." : "Complete Profile"}
          </AppText>
        </DarkButton>
      )}
    </View>
  );
};
