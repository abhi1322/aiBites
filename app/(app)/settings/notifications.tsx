import { useRouter } from "expo-router";
import { ArrowLeft, Clock } from "lucide-react-native";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNotifications } from "../../hooks/useNotifications";

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    settings,
    loading,
    toggleNotificationType,
    updateMealTime,
    sendTestNotification,
  } = useNotifications();

  const showTimePicker = (mealType: keyof typeof settings.mealTimes) => {
    Alert.alert(
      `Set ${mealType} time`,
      "Choose a time for your meal reminder",
      [
        { text: "Cancel", style: "cancel" },
        { text: "7:00 AM", onPress: () => updateMealTime(mealType, "07:00") },
        { text: "8:00 AM", onPress: () => updateMealTime(mealType, "08:00") },
        { text: "9:00 AM", onPress: () => updateMealTime(mealType, "09:00") },
        { text: "12:00 PM", onPress: () => updateMealTime(mealType, "12:00") },
        { text: "1:00 PM", onPress: () => updateMealTime(mealType, "13:00") },
        { text: "6:00 PM", onPress: () => updateMealTime(mealType, "18:00") },
        { text: "7:00 PM", onPress: () => updateMealTime(mealType, "19:00") },
        { text: "8:00 PM", onPress: () => updateMealTime(mealType, "20:00") },
      ]
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
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
        {/* Permission Status */}
        {!settings.enabled && (
          <View className="bg-red-50 p-4 rounded-lg mb-6">
            <Text className="text-sm text-red-800">
              Notifications are disabled. Please enable them in your device
              settings to receive calorie tracking reminders.
            </Text>
          </View>
        )}

        {/* Meal Reminders */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Meal Reminders
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            Get reminded to log your meals at specific times
          </Text>

          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Breakfast
                </Text>
                <Text className="text-sm text-gray-500">
                  Start your day with proper nutrition tracking
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => showTimePicker("breakfast")}
                className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg"
              >
                <Clock size={16} color="#3B82F6" />
                <Text className="text-blue-600 font-medium ml-1">
                  {formatTime(settings.mealTimes.breakfast)}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Lunch
                </Text>
                <Text className="text-sm text-gray-500">
                  Keep track of your midday nutrition
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => showTimePicker("lunch")}
                className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg"
              >
                <Clock size={16} color="#3B82F6" />
                <Text className="text-blue-600 font-medium ml-1">
                  {formatTime(settings.mealTimes.lunch)}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Dinner
                </Text>
                <Text className="text-sm text-gray-500">
                  Complete your daily nutrition log
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => showTimePicker("dinner")}
                className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg"
              >
                <Clock size={16} color="#3B82F6" />
                <Text className="text-blue-600 font-medium ml-1">
                  {formatTime(settings.mealTimes.dinner)}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Snack
                </Text>
                <Text className="text-sm text-gray-500">
                  Don't forget those in-between snacks
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => showTimePicker("snack")}
                className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg"
              >
                <Clock size={16} color="#3B82F6" />
                <Text className="text-blue-600 font-medium ml-1">
                  {formatTime(settings.mealTimes.snack)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notification Types */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Notification Types
          </Text>

          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Meal Tracking
                </Text>
                <Text className="text-sm text-gray-500">
                  Enable meal-specific reminders
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleNotificationType("mealTracking")}
                className={`w-12 h-6 rounded-full ${
                  settings.mealTracking ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                    settings.mealTracking ? "ml-6" : "ml-0.5"
                  }`}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Daily Check-in
                </Text>
                <Text className="text-sm text-gray-500">
                  Evening reminder to review your day
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleNotificationType("dailyReminders")}
                className={`w-12 h-6 rounded-full ${
                  settings.dailyReminders ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                    settings.dailyReminders ? "ml-6" : "ml-0.5"
                  }`}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Goal Achievements
                </Text>
                <Text className="text-sm text-gray-500">
                  Celebrate when you reach calorie goals
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleNotificationType("goalAchievements")}
                className={`w-12 h-6 rounded-full ${
                  settings.goalAchievements ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                    settings.goalAchievements ? "ml-6" : "ml-0.5"
                  }`}
                />
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
                onPress={() => toggleNotificationType("weeklyReports")}
                className={`w-12 h-6 rounded-full ${
                  settings.weeklyReports ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                    settings.weeklyReports ? "ml-6" : "ml-0.5"
                  }`}
                />
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
                onPress={() => toggleNotificationType("tipsAndAdvice")}
                className={`w-12 h-6 rounded-full ${
                  settings.tipsAndAdvice ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                    settings.tipsAndAdvice ? "ml-6" : "ml-0.5"
                  }`}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Test Notification */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Test Notifications
          </Text>

          <TouchableOpacity
            onPress={sendTestNotification}
            className="bg-blue-500 py-3 px-4 rounded-lg items-center"
          >
            <Text className="text-white font-medium">
              Send Test Notification
            </Text>
          </TouchableOpacity>

          <Text className="text-sm text-gray-500 mt-2">
            Test if notifications are working properly
          </Text>
        </View>

        {/* App Permissions */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            App Permissions
          </Text>

          <View className="bg-blue-50 p-4 rounded-lg">
            <Text className="text-sm text-blue-800">
              Make sure notifications are enabled in your device settings to
              receive all notifications from AIBite.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
