import { AppText } from "@/app/components/AppText";
import { SettingsCard, SettingsContainer } from "@/app/components/profile";
import DashedSeparator from "@/app/components/ui/DashedSeparator";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { ArrowLeft, Download, Eye, Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";
import { api } from "../../../convex/_generated/api";

export default function DataPrivacyScreen() {
  const { user } = useUser();
  const router = useRouter();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const [isExporting, setIsExporting] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    shareData: false,
    analytics: true,
    personalizedAds: false,
  });

  const toggleSetting = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const convertToCSV = (data: any) => {
    if (!data) return "";

    // Create user data object
    const userDataObj = {
      "First Name": data.firstName || "",
      "Last Name": data.lastName || "",
      Email: data.email || "",
      "Height (cm)": data.height || "",
      "Weight (kg)": data.weight || "",
      Gender: data.gender || "",
      "Calorie Goal": data.calorieGoal || "",
      "Protein Goal (g)": data.proteinGoal || "",
      "Carb Goal (g)": data.carbGoal || "",
      "Fat Goal (g)": data.fatGoal || "",
      "Date of Birth": data.dateOfBirth
        ? new Date(data.dateOfBirth).toLocaleDateString()
        : "",
      "Profile Completed": data.profileCompleted ? "Yes" : "No",
      "Created At": data.createdAt
        ? new Date(data.createdAt).toLocaleDateString()
        : "",
      "Updated At": data.updatedAt
        ? new Date(data.updatedAt).toLocaleDateString()
        : "",
    };

    const headers = Object.keys(userDataObj).join(",");
    const values = Object.values(userDataObj)
      .map((value) =>
        typeof value === "string" && value.includes(",") ? `"${value}"` : value
      )
      .join(",");

    return `${headers}\n${values}`;
  };

  const handleExportData = async () => {
    if (!userData) {
      Toast.error("No user data available to export");
      return;
    }

    setIsExporting(true);
    try {
      // Convert user data to CSV
      const csvContent = convertToCSV(userData);

      // Create filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `user_data_${timestamp}.csv`;
      const fileUri = FileSystem.documentDirectory + filename;

      // Write CSV file
      await FileSystem.writeAsStringAsync(fileUri, csvContent);

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Export User Data",
        });
        Toast.success("Data exported successfully!");
      } else {
        Toast.error("Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Export error:", error);
      Toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewData = () => {
    if (!userData) {
      Toast.error("No user data available");
      return;
    }

    Alert.alert(
      "Your Data Summary",
      `Name: ${userData.firstName || "Not set"} ${userData.lastName || ""}\n` +
        `Email: ${userData.email || "Not set"}\n` +
        `Height: ${userData.height || "Not set"} cm\n` +
        `Weight: ${userData.weight || "Not set"} kg\n` +
        `Calorie Goal: ${userData.calorieGoal || "Not set"} calories\n` +
        `Protein Goal: ${userData.proteinGoal || "Not set"}g\n` +
        `Profile Completed: ${userData.profileCompleted ? "Yes" : "No"}`,
      [{ text: "OK" }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Toast.error("Account deletion not implemented yet");
          },
        },
      ]
    );
  };

  const renderToggleSwitch = (isEnabled: boolean) => (
    <View
      className={`w-12 h-6 rounded-full ${
        isEnabled ? "bg-neutral-800" : "bg-neutral-200"
      }`}
    >
      <View
        className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
          isEnabled ? "ml-6" : "ml-0.5"
        }`}
      />
    </View>
  );

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
              Data & Privacy
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Privacy Settings */}

        <View
          className="bg-white rounded-3xl border border-neutral-200 py-8 mb-8"
          style={styles.shadow}
        >
          <AppText className="text-xl font-semibold text-neutral-700 w-full mb-4 px-6 py-4">
            Privacy Settings
          </AppText>

          <View
            className="border-t border-neutral-200 "
            style={{
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              onPress={() => toggleSetting("shareData")}
              className="flex-row items-center justify-between py-4 px-6"
            >
              <View className="flex-1">
                <AppText className="text-base font-medium text-gray-900">
                  Share Data for Research
                </AppText>
                <AppText className="text-sm text-gray-500">
                  Help improve nutrition science (anonymous)
                </AppText>
              </View>
              {renderToggleSwitch(privacySettings.shareData)}
            </TouchableOpacity>
            <DashedSeparator className="my-4 w-full" width={500} />

            <TouchableOpacity
              onPress={() => toggleSetting("analytics")}
              className="flex-row items-center justify-between py-4 px-6"
            >
              <View className="flex-1">
                <AppText className="text-base font-medium text-gray-900">
                  Analytics
                </AppText>
                <AppText className="text-sm text-gray-500">
                  Help us improve the app
                </AppText>
              </View>
              {renderToggleSwitch(privacySettings.analytics)}
            </TouchableOpacity>
            <DashedSeparator className="my-4 w-full" width={500} />

            <TouchableOpacity
              onPress={() => toggleSetting("personalizedAds")}
              className="flex-row items-center justify-between py-4 px-6"
            >
              <View className="flex-1">
                <AppText className="text-base font-medium text-gray-900">
                  Personalized Ads
                </AppText>
                <AppText className="text-sm text-gray-500">
                  Show relevant advertisements
                </AppText>
              </View>
              {renderToggleSwitch(privacySettings.personalizedAds)}
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management */}
        <SettingsContainer title="Data Management">
          <View className="bg-white rounded-3xl  " style={styles.shadow}>
            <SettingsCard
              title="Export My Data"
              subtitle={
                isExporting ? "Exporting..." : "Download all your data as CSV"
              }
              icon={<Download size={20} color="#6b7280" />}
              onPress={handleExportData}
              showBorder={true}
            />

            <SettingsCard
              title="View My Data"
              subtitle="See what data we have"
              icon={<Eye size={20} color="#6b7280" />}
              onPress={handleViewData}
              showBorder={true}
            />

            <SettingsCard
              title="Delete Account"
              subtitle="Permanently delete all data"
              icon={<Trash2 size={20} color="#dc2626" />}
              onPress={handleDeleteAccount}
              showBorder={false}
            />
          </View>
        </SettingsContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

// make a style for shadow class
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
