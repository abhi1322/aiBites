import { AppText } from "@/app/components/AppText";
import DashedSeparator from "@/app/components/ui/DashedSeparator";
import { useRouter } from "expo-router";
import { ArrowLeft, Clock } from "lucide-react-native";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNotifications } from "../../hooks/useNotifications";

// Toggle component with sliding indicator
const Toggle = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <TouchableOpacity onPress={() => onChange(!value)}>
      <View
        className={`w-12 h-6 rounded-full ${value ? "bg-neutral-600" : "bg-neutral-300"}`}
      >
        <View
          className={`w-5 h-5 rounded-full bg-white mt-0.5 transition-all duration-200 ${
            value ? "ml-6" : "ml-0.5"
          }`}
        />
      </View>
    </TouchableOpacity>
  );
};

// TimePickerButton component
const TimePickerButton = ({
  time,
  onPress,
  label,
  description,
  className,
}: {
  time: string;
  onPress: () => void;
  label: string;
  description: string;
  className?: string;
}) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <View className="flex-1">
        <AppText tweight="medium" className="text-base text-neutral-800">
          {label}
        </AppText>
        <AppText className="text-sm text-neutral-400">{description}</AppText>
      </View>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center bg-neutral-100 px-3 py-2 rounded-full"
      >
        <Clock size={16} color="#696969" />
        <AppText tweight="medium" className="text-neutral-600 ml-1">
          {formatTime(time)}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white mt-4 pb-4 px-4 ">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <ArrowLeft size={24} color="#374151" />
            <AppText
              tweight="medium"
              className="flex-1 text-center text-lg text-neutral-600 ml-2"
            >
              Notifications
            </AppText>
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
        <View
          className="bg-white rounded-2xl mb-8 border border-neutral-200 "
          style={styles.shadow}
        >
          <View className="px-6 py-8 border-b border-neutral-200">
            <AppText
              tweight="regular"
              className="text-xl text-neutral-800 mt-1"
            >
              Meal Reminders
            </AppText>
            <AppText className="text-sm text-neutral-500">
              Get reminded to log your meals at specific times
            </AppText>
          </View>

          <View className="gap-2 px-6 overflow-hidden">
            <TimePickerButton
              time={settings.mealTimes.breakfast}
              onPress={() => showTimePicker("breakfast")}
              label="Breakfast"
              description="Start your day with proper nutrition tracking"
              className="my-4"
            />
            <DashedSeparator width={500} />

            <TimePickerButton
              time={settings.mealTimes.lunch}
              onPress={() => showTimePicker("lunch")}
              label="Lunch"
              description="Keep track of your midday nutrition"
              className="my-4"
            />
            <DashedSeparator width={500} />

            <TimePickerButton
              time={settings.mealTimes.dinner}
              onPress={() => showTimePicker("dinner")}
              label="Dinner"
              description="Complete your daily nutrition log"
              className="my-4"
            />
            <DashedSeparator width={500} />

            <TimePickerButton
              time={settings.mealTimes.snack}
              onPress={() => showTimePicker("snack")}
              label="Snack"
              description="Don't forget those in-between snacks"
              className="my-4 pb-4"
            />
          </View>
        </View>

        {/* Notification Types */}
        <View
          className="bg-white rounded-2xl  mb-8 border border-neutral-200 "
          style={styles.shadow}
        >
          <AppText
            tweight="regular"
            className="text-xl text-neutral-800 px-6 py-8 border-b  border-neutral-200"
          >
            Notification Types
          </AppText>

          <View className="space-y-4 px-6 overflow-hidden">
            <View className="flex-row items-center justify-between my-4">
              <View className="flex-1">
                <AppText
                  tweight="medium"
                  className="text-base text-neutral-800"
                >
                  Meal Tracking
                </AppText>
                <AppText className="text-sm text-neutral-500">
                  Enable meal-specific reminders
                </AppText>
              </View>
              <Toggle
                value={settings.mealTracking}
                onChange={() => toggleNotificationType("mealTracking")}
              />
            </View>
            <DashedSeparator width={500} />

            <View className="flex-row items-center justify-between my-4">
              <View className="flex-1">
                <AppText
                  tweight="medium"
                  className="text-base text-neutral-800"
                >
                  Daily Check-in
                </AppText>
                <AppText className="text-sm text-neutral-500">
                  Evening reminder to review your day
                </AppText>
              </View>
              <Toggle
                value={settings.dailyReminders}
                onChange={() => toggleNotificationType("dailyReminders")}
              />
            </View>
            <DashedSeparator width={500} />

            <View className="flex-row items-center justify-between my-4">
              <View className="flex-1">
                <AppText
                  tweight="medium"
                  className="text-base text-neutral-800"
                >
                  Goal Achievements
                </AppText>
                <AppText className="text-sm text-neutral-500">
                  Celebrate when you reach calorie goals
                </AppText>
              </View>
              <Toggle
                value={settings.goalAchievements}
                onChange={() => toggleNotificationType("goalAchievements")}
              />
            </View>
            <DashedSeparator width={500} />

            <View className="flex-row items-center justify-between my-4">
              <View className="flex-1">
                <AppText
                  tweight="medium"
                  className="text-base text-neutral-800"
                >
                  Weekly Reports
                </AppText>
                <AppText className="text-sm text-neutral-500">
                  Get weekly nutrition summaries
                </AppText>
              </View>
              <Toggle
                value={settings.weeklyReports}
                onChange={() => toggleNotificationType("weeklyReports")}
              />
            </View>
            <DashedSeparator width={500} />
            <View className="flex-row items-center justify-between my-4">
              <View className="flex-1">
                <AppText className="text-base font-medium text-gray-900">
                  Tips & Advice
                </AppText>
                <AppText className="text-sm text-neutral-500">
                  Receive nutrition tips and advice
                </AppText>
              </View>
              <Toggle
                value={settings.tipsAndAdvice}
                onChange={() => toggleNotificationType("tipsAndAdvice")}
              />
            </View>
          </View>
        </View>

        {/* App Permissions */}
        <View
          className="bg-white rounded-2xl p-6 mb-8 border border-neutral-200 "
          style={styles.shadow}
        >
          <AppText
            tweight="regular"
            className="text-xl text-neutral-800 mb-4"
          >
            App Permissions
          </AppText>

          <View className="bg-neutral-100 p-4 rounded-lg">
            <AppText className="text-sm text-neutral-500">
              Make sure notifications are enabled in your device settings to
              receive all notifications from Mensura.
            </AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
});
