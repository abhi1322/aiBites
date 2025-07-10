import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, View } from "react-native";
import { AppText } from "../AppText";
import DashedSeparator from "../ui/DashedSeparator";

// Step configuration
const STEPS = [1, 2, 3, 4];
// Named step mapping for use elsewhere
const STEP_KEYS = {
  BASIC_INFO: 0,
  HEIGHT: 1,
  WEIGHT: 2,
  NUTRITION: 3,
} as const;

const CIRCLE_SIZE = 30; // width/height of each step circle
const CIRCLE_MARGIN = 4; // horizontal margin for each circle

const screenWidth = Dimensions.get("window").width;
const totalCirclesWidth = STEPS.length * (CIRCLE_SIZE + 2 * CIRCLE_MARGIN);
const totalGaps = STEPS.length - 1;
const availableWidth = screenWidth - totalCirclesWidth - 60;
const dashWidth = availableWidth / totalGaps;

// currentStep is a 0-based index
interface ProgressBarProps {
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <View className="px-6">
      <View className="mt-8 pt-6">
        <AppText tweight="semibold" className="text-2xl text-center">
          Complete your profile
        </AppText>
        <AppText className="text-xs mb-2 text-neutral-500 text-center">
          Set up your profile in just four simple steps and start tracking your
          daily calorie intake with ease.
        </AppText>
      </View>
      <View className="flex-row justify-between overflow-hidden rounded-full mb-2 mt-4">
        {STEPS.map((step, idx) => (
          <React.Fragment key={step}>
            <View key={step} className="flex-row items-center">
              <LinearGradient
                className="rounded-full"
                colors={
                  idx <= currentStep
                    ? ["#373636", "#171717"] // blue gradient for completed/current
                    : ["#E0E0E0", "#E0E0E0"] // gray for incomplete
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: CIRCLE_SIZE,
                  height: CIRCLE_SIZE,
                  borderRadius: CIRCLE_SIZE / 2,
                  marginHorizontal: CIRCLE_MARGIN,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AppText
                  tweight="medium"
                  className={`text-sm font-medium ${idx <= currentStep ? "text-white" : "text-gray-500"}`}
                >
                  {step}
                </AppText>
              </LinearGradient>
              {idx < STEPS.length - 1 && (
                <DashedSeparator
                  width={dashWidth}
                  color={idx < currentStep ? "#373636" : "#d1d5db"} // blue-600 or gray-300
                  thickness={1}
                  dashLength={6}
                  gap={4}
                  style={{ marginHorizontal: 4 }}
                />
              )}
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export { STEP_KEYS, STEPS };
export type { ProgressBarProps };
