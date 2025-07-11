import React from "react";
import { Animated, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { AppText } from "./AppText";

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
  const [currentProgress, setCurrentProgress] = React.useState(0);
  const animatedProgress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Update the state for SVG calculation
    const listener = animatedProgress.addListener(({ value }) => {
      setCurrentProgress(value);
    });

    return () => {
      animatedProgress.removeListener(listener);
    };
  }, [progress, animatedProgress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (currentProgress / 100) * circumference;

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
            <AppText className="text-lg font-bold text-gray-800">
              {Math.round(currentProgress)}%
            </AppText>
          ) : (
            <View className="items-center flex-row">
              {value && (
                <AppText className="text-sm font-semibold text-gray-800">
                  {value}
                </AppText>
              )}
              {label && (
                <AppText className="text-xs text-gray-600 text-center">
                  {label}
                </AppText>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
