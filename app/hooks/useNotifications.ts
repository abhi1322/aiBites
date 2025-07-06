import { useEffect, useState } from "react";
import { Alert } from "react-native";
import NotificationService from "../services/notificationService";

export interface NotificationState {
  enabled: boolean;
  mealTracking: boolean;
  dailyReminders: boolean;
  weeklyReports: boolean;
  goalAchievements: boolean;
  tipsAndAdvice: boolean;
  mealTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  };
}

const defaultSettings: NotificationState = {
  enabled: false,
  mealTracking: true,
  dailyReminders: true,
  weeklyReports: false,
  goalAchievements: true,
  tipsAndAdvice: true,
  mealTimes: {
    breakfast: "08:00",
    lunch: "12:00",
    dinner: "18:00",
    snack: "15:00",
  },
};

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationState>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      const hasPermission = await NotificationService.requestPermissions();
      setSettings((prev) => ({ ...prev, enabled: hasPermission }));
    } catch (error) {
      console.error("Failed to initialize notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotificationType = async (
    type: keyof Omit<NotificationState, "enabled" | "mealTimes">
  ) => {
    const newValue = !settings[type];

    setSettings((prev) => ({ ...prev, [type]: newValue }));

    try {
      switch (type) {
        case "mealTracking":
          if (newValue) {
            // Schedule all meal reminders
            await Promise.all([
              NotificationService.scheduleMealReminder(
                "breakfast",
                settings.mealTimes.breakfast,
                true
              ),
              NotificationService.scheduleMealReminder(
                "lunch",
                settings.mealTimes.lunch,
                true
              ),
              NotificationService.scheduleMealReminder(
                "dinner",
                settings.mealTimes.dinner,
                true
              ),
              NotificationService.scheduleMealReminder(
                "snack",
                settings.mealTimes.snack,
                true
              ),
            ]);
          } else {
            // Cancel all meal reminders
            await Promise.all([
              NotificationService.cancelMealReminder("breakfast"),
              NotificationService.cancelMealReminder("lunch"),
              NotificationService.cancelMealReminder("dinner"),
              NotificationService.cancelMealReminder("snack"),
            ]);
          }
          break;
        case "dailyReminders":
          await NotificationService.scheduleDailyReminder(newValue);
          break;
        case "weeklyReports":
          await NotificationService.scheduleWeeklyReport(newValue);
          break;
      }
    } catch (error) {
      console.error(`Failed to toggle ${type}:`, error);
      Alert.alert("Error", `Failed to update ${type} settings`);
    }
  };

  const updateMealTime = async (
    mealType: keyof NotificationState["mealTimes"],
    time: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      mealTimes: { ...prev.mealTimes, [mealType]: time },
    }));

    if (settings.mealTracking) {
      try {
        await NotificationService.scheduleMealReminder(
          mealType as "breakfast" | "lunch" | "dinner" | "snack",
          time,
          true
        );
      } catch (error) {
        console.error(`Failed to update ${mealType} time:`, error);
        Alert.alert("Error", `Failed to update ${mealType} reminder time`);
      }
    }
  };

  const sendTestNotification = async () => {
    try {
      await NotificationService.sendImmediateNotification(
        "Test Notification 📱",
        "This is a test notification for calorie tracking reminders!",
        { type: "test" }
      );
      Alert.alert("Success", "Test notification sent!");
    } catch (error) {
      Alert.alert("Error", "Failed to send test notification");
    }
  };

  const sendGoalAchievementNotification = async (goalType: string) => {
    if (!settings.goalAchievements) return;

    try {
      await NotificationService.sendGoalAchievementNotification(goalType);
    } catch (error) {
      console.error("Failed to send goal achievement notification:", error);
    }
  };

  const sendStreakNotification = async (days: number) => {
    try {
      await NotificationService.sendStreakNotification(days);
    } catch (error) {
      console.error("Failed to send streak notification:", error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await NotificationService.cancelAllNotifications();
      setSettings((prev) => ({
        ...prev,
        mealTracking: false,
        dailyReminders: false,
        weeklyReports: false,
      }));
    } catch (error) {
      console.error("Failed to cancel notifications:", error);
    }
  };

  const getScheduledNotifications = async () => {
    try {
      return await NotificationService.getScheduledNotifications();
    } catch (error) {
      console.error("Failed to get scheduled notifications:", error);
      return [];
    }
  };

  return {
    settings,
    loading,
    toggleNotificationType,
    updateMealTime,
    sendTestNotification,
    sendGoalAchievementNotification,
    sendStreakNotification,
    cancelAllNotifications,
    getScheduledNotifications,
    initializeNotifications,
  };
};
