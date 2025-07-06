import React from "react";
import { Text, View } from "react-native";
import { RulerPicker } from "react-native-ruler-picker";

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

      <View className="items-center space-y-4">
        <Text className="text-3xl font-bold text-blue-600">
          {heightValue} cm
        </Text>
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
  );
};
