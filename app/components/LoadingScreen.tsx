import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  showSpinner?: boolean;
  delay?: number; // Delay in milliseconds
  onDelayComplete?: () => void; // Callback when delay is complete
}

// add delay

export default function LoadingScreen({
  title = "AIBite",
  subtitle = "Your AI-Powered Nutrition Assistant",
  showSpinner = true,
  delay = 1500, // Default 1.5 seconds
  onDelayComplete,
}: LoadingScreenProps) {
  const [isDelayComplete, setIsDelayComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelayComplete(true);
      onDelayComplete?.();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onDelayComplete]);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <View className="items-center">
        <Text className="text-2xl font-bold text-gray-900 mb-2">{title}</Text>
        <Text className="text-gray-500 mb-6 text-center px-8">{subtitle}</Text>
        {showSpinner && (
          <>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-400 mt-4">
              {isDelayComplete ? "Ready!" : "Loading..."}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
