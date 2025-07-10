// components/profile-setup/HeightStep.tsx
import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RulerPicker } from "react-native-ruler-picker"; // Use named import
import { AppText } from "../AppText";

interface HeightStepProps {
  height: string;
  updateHeight: (height: string) => void;
}

export const HeightStep: React.FC<HeightStepProps> = ({
  height,
  updateHeight,
}) => {
  const heightValue = Number(height) || 170;

  return (
    <ScrollView>
      <View className="flex-1 justify-between pb-20">
        <View className="space-y-6">
          <View className="text-center">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Your Height
            </Text>
            <Text className="text-gray-600">
              Enter your height in centimeters
            </Text>
          </View>

          <View className="bg-blue-50 rounded-lg p-4">
            <Text className="text-blue-800 text-sm">
              💡 Tip: You can measure your height using a wall and a book, or
              check your driver&apos;s license.
            </Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center">
          <AppText tweight="semibold" className="text-3xl text-blue-600">
            {heightValue} cm
          </AppText>
          <RulerPicker
            min={100}
            max={250}
            step={1}
            fractionDigits={0}
            initialValue={heightValue}
            onValueChangeEnd={(val: string) => updateHeight(val)}
            unit="cm"
            width={300}
            height={80}
            indicatorColor="#3b82f6"
          />
        </View>
      </View>
    </ScrollView>
  );
};
