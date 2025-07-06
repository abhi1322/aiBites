import { Bell } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useNotifications } from "../hooks/useNotifications";

interface NotificationBadgeProps {
  onPress?: () => void;
  size?: "small" | "medium" | "large";
}

export default function NotificationBadge({
  onPress,
  size = "medium",
}: NotificationBadgeProps) {
  const { settings } = useNotifications();

  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12",
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const hasActiveNotifications =
    settings.mealTracking || settings.dailyReminders || settings.weeklyReports;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${sizeClasses[size]} rounded-full bg-blue-100 items-center justify-center relative`}
    >
      <Bell
        size={iconSizes[size]}
        color={hasActiveNotifications ? "#3B82F6" : "#9CA3AF"}
      />

      {/* Active indicator dot */}
      {hasActiveNotifications && (
        <View className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}

      {/* Disabled indicator */}
      {!settings.enabled && (
        <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      )}
    </TouchableOpacity>
  );
}
