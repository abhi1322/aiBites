import { format } from "date-fns";

// Types for export data
export interface ExportData {
  user: any;
  foodItems: any[];
  dailyLogs: any[];
  exportDate: string;
  totalFoodItems: number;
  totalDailyLogs: number;
}

// Helper function to escape CSV values
const escapeCSVValue = (value: any): string => {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

// Convert daily logs to CSV with food item details (main export format)
export const convertDailyLogsToCSV = (dailyLogs: any[]): string => {
  if (dailyLogs.length === 0) return "No food logs found";

  const headers = [
    "Date",
    "Time",
    "Item",
    "Calories",
    "Protein (g)",
    "Carb (g)",
    "Fat (g)",
    "Fiber (g)",
    "Serving Size",
    "Image URL",
    "Meal Type",
    "Quantity",
    "Notes",
  ].join(",");

  const rows = dailyLogs.map((log) => {
    const logDate = new Date(log.createdAt);
    const date = format(logDate, "yyyy-MM-dd");
    const time = format(logDate, "HH:mm:ss");

    return [
      escapeCSVValue(date),
      escapeCSVValue(time),
      escapeCSVValue(log.foodItem?.name || ""),
      escapeCSVValue(log.foodItem?.calories?.total || ""),
      escapeCSVValue(log.foodItem?.protein || ""),
      escapeCSVValue(log.foodItem?.carbs || ""),
      escapeCSVValue(log.foodItem?.fat || ""),
      escapeCSVValue(log.foodItem?.fiber || ""),
      escapeCSVValue(log.foodItem?.servingSize || ""),
      escapeCSVValue(log.foodItem?.imageUrl || ""),
      escapeCSVValue(log.mealType),
      escapeCSVValue(log.quantity),
      escapeCSVValue(log.notes || ""),
    ].join(",");
  });

  return `${headers}\n${rows.join("\n")}`;
};

// Convert food items to CSV (separate food items export)
export const convertFoodItemsToCSV = (foodItems: any[]): string => {
  if (foodItems.length === 0) return "No food items found";

  const headers = [
    "Food Name",
    "Calories",
    "Protein (g)",
    "Carbs (g)",
    "Fat (g)",
    "Fiber (g)",
    "Sugar (g)",
    "Sodium (mg)",
    "Serving Size",
    "Image URL",
    "Is Custom",
    "Created Date",
    "Created Time",
  ].join(",");

  const rows = foodItems.map((item) => {
    const createdDate = new Date(item.createdAt);
    const date = format(createdDate, "yyyy-MM-dd");
    const time = format(createdDate, "HH:mm:ss");

    return [
      escapeCSVValue(item.name),
      escapeCSVValue(item.calories?.total || ""),
      escapeCSVValue(item.protein || ""),
      escapeCSVValue(item.carbs || ""),
      escapeCSVValue(item.fat || ""),
      escapeCSVValue(item.fiber || ""),
      escapeCSVValue(item.sugar || ""),
      escapeCSVValue(item.sodium || ""),
      escapeCSVValue(item.servingSize),
      escapeCSVValue(item.imageUrl),
      escapeCSVValue(item.isCustom ? "Yes" : "No"),
      escapeCSVValue(date),
      escapeCSVValue(time),
    ].join(",");
  });

  return `${headers}\n${rows.join("\n")}`;
};

// Convert user profile data to CSV
export const convertUserToCSV = (user: any): string => {
  const userData = {
    "First Name": user.firstName || "",
    "Last Name": user.lastName || "",
    Email: user.email || "",
    "Height (cm)": user.height || "",
    "Weight (kg)": user.weight || "",
    Gender: user.gender || "",
    "Calorie Goal": user.calorieGoal || "",
    "Protein Goal (g)": user.proteinGoal || "",
    "Carb Goal (g)": user.carbGoal || "",
    "Fat Goal (g)": user.fatGoal || "",
    "Date of Birth": user.dateOfBirth
      ? format(new Date(user.dateOfBirth), "yyyy-MM-dd")
      : "",
    "Profile Completed": user.profileCompleted ? "Yes" : "No",
    "Profile Image": user.profileImage || "",
    "Created At": user.createdAt
      ? format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss")
      : "",
    "Updated At": user.updatedAt
      ? format(new Date(user.updatedAt), "yyyy-MM-dd HH:mm:ss")
      : "",
  };

  const headers = Object.keys(userData).join(",");
  const values = Object.values(userData).map(escapeCSVValue).join(",");

  return `${headers}\n${values}`;
};

// Generate main CSV export (focused on food logs)
export const generateMainCSV = (exportData: ExportData): string => {
  const {
    user,
    foodItems,
    dailyLogs,
    exportDate,
    totalFoodItems,
    totalDailyLogs,
  } = exportData;

  // Create summary section
  const summary = [
    "=== Mensura FOOD LOGS EXPORT ===",
    `Export Date: ${format(new Date(exportDate), "yyyy-MM-dd HH:mm:ss")}`,
    `User: ${user.firstName || ""} ${user.lastName || ""}`,
    `Email: ${user.email || ""}`,
    `Total Food Items: ${totalFoodItems}`,
    `Total Daily Logs: ${totalDailyLogs}`,
    "",
    "=== FOOD LOGS (Date, Time, Item, Calories, Protein, Carb, Fat, Fiber, Serving Size, Image) ===",
    convertDailyLogsToCSV(dailyLogs),
    "",
    "=== END OF EXPORT ===",
  ].join("\n");

  return summary;
};

// Generate comprehensive CSV export (all data)
export const generateComprehensiveCSV = (exportData: ExportData): string => {
  const {
    user,
    foodItems,
    dailyLogs,
    exportDate,
    totalFoodItems,
    totalDailyLogs,
  } = exportData;

  // Create summary section
  const summary = [
    "=== Mensura USER DATA EXPORT ===",
    `Export Date: ${format(new Date(exportDate), "yyyy-MM-dd HH:mm:ss")}`,
    `User: ${user.firstName || ""} ${user.lastName || ""}`,
    `Email: ${user.email || ""}`,
    `Total Food Items: ${totalFoodItems}`,
    `Total Daily Logs: ${totalDailyLogs}`,
    "",
    "=== USER PROFILE ===",
    convertUserToCSV(user),
    "",
    "=== FOOD ITEMS ===",
    convertFoodItemsToCSV(foodItems),
    "",
    "=== DAILY LOGS ===",
    convertDailyLogsToCSV(dailyLogs),
    "",
    "=== END OF EXPORT ===",
  ].join("\n");

  return summary;
};

// Sanitize data for JSON export (remove sensitive information)
const sanitizeUserData = (user: any) => {
  const { _id, clerkId, createdById, ...sanitizedUser } = user;
  return {
    ...sanitizedUser,
    createdAt: user.createdAt
      ? format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss")
      : "",
    updatedAt: user.updatedAt
      ? format(new Date(user.updatedAt), "yyyy-MM-dd HH:mm:ss")
      : "",
    dateOfBirth: user.dateOfBirth
      ? format(new Date(user.dateOfBirth), "yyyy-MM-dd")
      : "",
  };
};

const sanitizeFoodItem = (item: any) => {
  const { _id, createdBy, createdById, ...sanitizedItem } = item;
  return {
    ...sanitizedItem,
    createdAt: item.createdAt
      ? format(new Date(item.createdAt), "yyyy-MM-dd HH:mm:ss")
      : "",
    updatedAt: item.updatedAt
      ? format(new Date(item.updatedAt), "yyyy-MM-dd HH:mm:ss")
      : "",
  };
};

const sanitizeDailyLog = (log: any) => {
  const { _id, userId, foodItemId, ...sanitizedLog } = log;
  return {
    ...sanitizedLog,
    foodItem: log.foodItem ? sanitizeFoodItem(log.foodItem) : null,
    createdAt: log.createdAt
      ? format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")
      : "",
  };
};

// Generate sanitized JSON export
export const generateJSONExport = (exportData: ExportData): string => {
  const sanitizedData = {
    exportInfo: {
      exportDate: format(
        new Date(exportData.exportDate),
        "yyyy-MM-dd HH:mm:ss"
      ),
      totalFoodItems: exportData.totalFoodItems,
      totalDailyLogs: exportData.totalDailyLogs,
    },
    user: sanitizeUserData(exportData.user),
    foodItems: exportData.foodItems.map(sanitizeFoodItem),
    dailyLogs: exportData.dailyLogs.map(sanitizeDailyLog),
  };

  return JSON.stringify(sanitizedData, null, 2);
};

// Generate summary text
export const generateSummaryText = (exportData: ExportData): string => {
  const { user, totalFoodItems, totalDailyLogs, exportDate } = exportData;

  return [
    "=== Mensura DATA SUMMARY ===",
    `Export Date: ${format(new Date(exportDate), "yyyy-MM-dd HH:mm:ss")}`,
    "",
    "User Information:",
    `• Name: ${user.firstName || "Not set"} ${user.lastName || ""}`,
    `• Email: ${user.email || "Not set"}`,
    `• Height: ${user.height || "Not set"} cm`,
    `• Weight: ${user.weight || "Not set"} kg`,
    `• Gender: ${user.gender || "Not set"}`,
    `• Profile Completed: ${user.profileCompleted ? "Yes" : "No"}`,
    "",
    "Nutrition Goals:",
    `• Calorie Goal: ${user.calorieGoal || "Not set"} calories`,
    `• Protein Goal: ${user.proteinGoal || "Not set"}g`,
    `• Carb Goal: ${user.carbGoal || "Not set"}g`,
    `• Fat Goal: ${user.fatGoal || "Not set"}g`,
    "",
    "Data Summary:",
    `• Total Food Items: ${totalFoodItems}`,
    `• Total Daily Logs: ${totalDailyLogs}`,
    `• Account Created: ${user.createdAt ? format(new Date(user.createdAt), "yyyy-MM-dd") : "Unknown"}`,
    `• Last Updated: ${user.updatedAt ? format(new Date(user.updatedAt), "yyyy-MM-dd") : "Unknown"}`,
  ].join("\n");
};
