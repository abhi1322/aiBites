import React from "react";
import { Text, TextInput, View } from "react-native";

interface HeightStepProps {
  height: string;
  updateHeight: (height: string) => void;
}

export const HeightStep: React.FC<HeightStepProps> = ({
  height,
  updateHeight,
}) => {
  return (
    <View className="space-y-6">
      <View className="text-center">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Your Height
        </Text>
        <Text className="text-gray-600">Enter your height in centimeters</Text>
      </View>

      <View>
        <Text className="text-gray-700 font-semibold mb-2">Height (cm) *</Text>
        <TextInput
          value={height}
          onChangeText={updateHeight}
          placeholder="e.g. 175"
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg text-center"
          keyboardType="numeric"
          autoCorrect={false}
          spellCheck={false}
        />
      </View>

      <View className="bg-blue-50 rounded-lg p-4">
        <Text className="text-blue-800 text-sm">
          💡 Tip: You can measure your height using a wall and a book, or check
          your driver&apos;s license.
        </Text>
      </View>
    </View>
  );
};
