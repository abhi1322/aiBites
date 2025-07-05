import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularProgressRingProps {
  progress: number; // 0-100
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
  value?: string;
}

export default function CircularProgressRing({
  progress,
  size,
  strokeWidth,
  color,
  backgroundColor = "#f3f4f6",
  showPercentage = true,
  label,
  value,
}: CircularProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="items-center">
      <View className="relative">
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        {/* Center content */}
        <View className="absolute inset-0 justify-center items-center">
          {showPercentage ? (
            <Text className="text-lg font-bold text-gray-800">
              {Math.round(progress)}%
            </Text>
          ) : (
            <View className="items-center">
              {value && (
                <Text className="text-sm font-semibold text-gray-800">
                  {value}
                </Text>
              )}
              {label && (
                <Text className="text-xs text-gray-600 text-center">
                  {label}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
