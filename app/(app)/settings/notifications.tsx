import { useRouter } from "expo-router";
import { ArrowLeft, Bell, ToggleLeft } from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    mealTracking: true,
    goalAchievements: true,
    weeklyReports: false,
    tipsAndAdvice: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <ArrowLeft size={24} color="#374151" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">
              Notifications
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Notification Types */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Notification Types
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Daily Reminders
                </Text>
                <Text className="text-sm text-gray-500">
                  Remind me to log my meals
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleNotification('dailyReminders')}
                className={`w-12 h-6 rounded-full ${
                  notifications.dailyReminders ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                  notifications.dailyReminders ? 'ml-6' : 'ml-0.5'
                }`} />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Meal Tracking
                </Text>
                <Text className="text-sm text-gray-500">
                  Notify when meals are logged
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleNotification('mealTracking')}
                className={`w-12 h-6 rounded-full ${
                  notifications.mealTracking ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                  notifications.mealTracking ? 'ml-6' : 'ml-0.5'
                }`} />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Goal Achievements
                </Text>
                <Text className="text-sm text-gray-500">
                  Celebrate when you reach goals
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleNotification('goalAchievements')}
                className={`w-12 h-6 rounded-full ${
                  notifications.goalAchievements ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                  notifications.goalAchievements ? 'ml-6' : 'ml-0.5'
                }`} />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Weekly Reports
                </Text>
                <Text className="text-sm text-gray-500">
                  Get weekly nutrition summaries
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleNotification('weeklyReports')}
                className={`w-12 h-6 rounded-full ${
                  notifications.weeklyReports ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                  notifications.weeklyReports ? 'ml-6' : 'ml-0.5'
                }`} />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Tips & Advice
                </Text>
                <Text className="text-sm text-gray-500">
                  Receive nutrition tips and advice
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleNotification('tipsAndAdvice')}
                className={`w-12 h-6 rounded-full ${
                  notifications.tipsAndAdvice ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                  notifications.tipsAndAdvice ? 'ml-6' : 'ml-0.5'
                }`} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notification Schedule */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Notification Schedule
          </Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View>
              <Text className="text-base font-medium text-gray-900">
                Reminder Time
              </Text>
              <Text className="text-sm text-gray-500">
                Set when to receive daily reminders
              </Text>
            </View>
            <Text className="text-blue-500">8:00 AM</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View>
              <Text className="text-base font-medium text-gray-900">
                Quiet Hours
              </Text>
              <Text className="text-sm text-gray-500">
                Don't disturb during these hours
              </Text>
            </View>
            <Text className="text-blue-500">10:00 PM - 7:00 AM</Text>
          </TouchableOpacity>
        </View>

        {/* App Permissions */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            App Permissions
          </Text>
          
          <View className="bg-blue-50 p-4 rounded-lg">
            <Text className="text-sm text-blue-800">
              Make sure notifications are enabled in your device settings to receive all notifications from AIBite.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 