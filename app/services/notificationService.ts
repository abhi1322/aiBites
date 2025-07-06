import * as Notifications from "expo-notifications";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationSettings {
  enabled: boolean;
  breakfastTime: string; // "08:00"
  lunchTime: string; // "12:00"
  dinnerTime: string; // "18:00"
  snackTime: string; // "15:00"
  dailyReminder: boolean;
  weeklyReport: boolean;
}

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return false;
    }

    return true;
  }

  static async scheduleMealReminder(
    mealType: "breakfast" | "lunch" | "dinner" | "snack",
    time: string,
    enabled: boolean
  ): Promise<string | null> {
    if (!enabled) {
      await this.cancelMealReminder(mealType);
      return null;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time to log your ${mealType}! 📸`,
        body: `Don't forget to track your ${mealType} calories. Take a photo of your meal to get started!`,
        data: { mealType, type: "meal_reminder" },
        sound: "default",
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });

    return identifier;
  }

  static async scheduleDailyReminder(enabled: boolean): Promise<string | null> {
    if (!enabled) {
      await this.cancelDailyReminder();
      return null;
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Calorie Check-in 📊",
        body: "How are you doing with your nutrition goals today? Log your meals to stay on track!",
        data: { type: "daily_reminder" },
        sound: "default",
      },
      trigger: {
        hour: 20, // 8 PM
        minute: 0,
        repeats: true,
      },
    });

    return identifier;
  }

  static async scheduleWeeklyReport(enabled: boolean): Promise<string | null> {
    if (!enabled) {
      await this.cancelWeeklyReport();
      return null;
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your Weekly Nutrition Report 📈",
        body: "Check out your progress this week and see how you're doing with your calorie goals!",
        data: { type: "weekly_report" },
        sound: "default",
      },
      trigger: {
        weekday: 1, // Monday
        hour: 9, // 9 AM
        minute: 0,
        repeats: true,
      },
    });

    return identifier;
  }

  static async cancelMealReminder(mealType: string): Promise<void> {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const mealReminders = scheduledNotifications.filter(
      (notification) => notification.content.data?.mealType === mealType
    );

    for (const notification of mealReminders) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }

  static async cancelDailyReminder(): Promise<void> {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const dailyReminders = scheduledNotifications.filter(
      (notification) => notification.content.data?.type === "daily_reminder"
    );

    for (const notification of dailyReminders) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }

  static async cancelWeeklyReport(): Promise<void> {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const weeklyReports = scheduledNotifications.filter(
      (notification) => notification.content.data?.type === "weekly_report"
    );

    for (const notification of weeklyReports) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  static async sendImmediateNotification(
    title: string,
    body: string,
    data?: any
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: "default",
      },
      trigger: null, // Send immediately
    });
  }

  static async sendGoalAchievementNotification(
    goalType: string
  ): Promise<string> {
    return await this.sendImmediateNotification(
      "Goal Achieved! 🎉",
      `Congratulations! You've reached your ${goalType} goal for today. Keep up the great work!`,
      { type: "goal_achievement", goalType }
    );
  }

  static async sendStreakNotification(days: number): Promise<string> {
    return await this.sendImmediateNotification(
      "Streak Alert! 🔥",
      `Amazing! You've logged your meals for ${days} days in a row. Your consistency is inspiring!`,
      { type: "streak", days }
    );
  }
}

export default NotificationService;
