import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  colors?: string[];
}

export default function ColorPicker({
  selectedColor,
  onColorChange,
  colors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#ec4899", // Pink
    "#84cc16", // Lime
    "#6b7280", // Gray
  ],
}: ColorPickerProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">Ring Color</Text>
      <View className="flex-row flex-wrap gap-2">
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColor === color ? "border-gray-800" : "border-gray-300"
            }`}
            style={{ backgroundColor: color }}
            onPress={() => onColorChange(color)}
          />
        ))}
      </View>
    </View>
  );
}
