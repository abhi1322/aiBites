import { Bell, BellOff, Settings } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNotifications } from "../hooks/useNotifications";

interface NotificationStatusProps {
  onPressSettings?: () => void;
}

export default function NotificationStatus({
  onPressSettings,
}: NotificationStatusProps) {
  const { settings, loading } = useNotifications();

  if (loading) {
    return null;
  }

  const hasActiveNotifications =
    settings.mealTracking || settings.dailyReminders || settings.weeklyReports;

  if (!settings.enabled) {
    return (
      <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <BellOff size={20} color="#DC2626" />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-medium text-red-800">
                Notifications Disabled
              </Text>
              <Text className="text-xs text-red-600 mt-1">
                Enable notifications to get meal reminders
              </Text>
            </View>
          </View>
          {onPressSettings && (
            <TouchableOpacity
              onPress={onPressSettings}
              className="bg-red-100 p-2 rounded-lg"
            >
              <Settings size={16} color="#DC2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (!hasActiveNotifications) {
    return (
      <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Bell size={20} color="#D97706" />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-medium text-yellow-800">
                No Active Reminders
              </Text>
              <Text className="text-xs text-yellow-600 mt-1">
                Set up meal reminders to stay on track
              </Text>
            </View>
          </View>
          {onPressSettings && (
            <TouchableOpacity
              onPress={onPressSettings}
              className="bg-yellow-100 p-2 rounded-lg"
            >
              <Settings size={16} color="#D97706" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Bell size={20} color="#059669" />
          <View className="ml-3 flex-1">
            <Text className="text-sm font-medium text-green-800">
              Reminders Active
            </Text>
            <Text className="text-xs text-green-600 mt-1">
              {settings.mealTracking && "Meal reminders • "}
              {settings.dailyReminders && "Daily check-ins • "}
              {settings.weeklyReports && "Weekly reports"}
            </Text>
          </View>
        </View>
        {onPressSettings && (
          <TouchableOpacity
            onPress={onPressSettings}
            className="bg-green-100 p-2 rounded-lg"
          >
            <Settings size={16} color="#059669" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
