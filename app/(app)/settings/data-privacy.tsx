import { useRouter } from "expo-router";
import { ArrowLeft, Download, Eye, Shield, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function DataPrivacyScreen() {
  const router = useRouter();
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

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Your data will be exported and sent to your email address. This may take a few minutes.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
          onPress: () => Alert.alert("Success", "Data export initiated!"),
        },
      ]
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
          onPress: () =>
            Alert.alert("Account Deleted", "Your account has been deleted."),
        },
      ]
    );
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
              Data & Privacy
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Privacy Settings */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Privacy Settings
          </Text>

          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Share Data for Research
                </Text>
                <Text className="text-sm text-gray-500">
                  Help improve nutrition science (anonymous)
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleSetting("shareData")}
                className={`w-12 h-6 rounded-full ${
                  privacySettings.shareData ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                    privacySettings.shareData ? "ml-6" : "ml-0.5"
                  }`}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Analytics
                </Text>
                <Text className="text-sm text-gray-500">
                  Help us improve the app
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleSetting("analytics")}
                className={`w-12 h-6 rounded-full ${
                  privacySettings.analytics ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                    privacySettings.analytics ? "ml-6" : "ml-0.5"
                  }`}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Personalized Ads
                </Text>
                <Text className="text-sm text-gray-500">
                  Show relevant advertisements
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleSetting("personalizedAds")}
                className={`w-12 h-6 rounded-full ${
                  privacySettings.personalizedAds
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5 ${
                    privacySettings.personalizedAds ? "ml-6" : "ml-0.5"
                  }`}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Data Management
          </Text>

          <TouchableOpacity
            onPress={handleExportData}
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
          >
            <View className="flex-row items-center">
              <Download size={20} color="#6b7280" />
              <View className="ml-3">
                <Text className="text-base font-medium text-gray-900">
                  Export My Data
                </Text>
                <Text className="text-sm text-gray-500">
                  Download all your data
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Eye size={20} color="#6b7280" />
              <View className="ml-3">
                <Text className="text-base font-medium text-gray-900">
                  View My Data
                </Text>
                <Text className="text-sm text-gray-500">
                  See what data we have
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <Trash2 size={20} color="#dc2626" />
              <View className="ml-3">
                <Text className="text-base font-medium text-red-600">
                  Delete Account
                </Text>
                <Text className="text-sm text-gray-500">
                  Permanently delete all data
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacy Policy */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Legal
          </Text>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View>
              <Text className="text-base font-medium text-gray-900">
                Privacy Policy
              </Text>
              <Text className="text-sm text-gray-500">
                Read our privacy policy
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View>
              <Text className="text-base font-medium text-gray-900">
                Terms of Service
              </Text>
              <Text className="text-sm text-gray-500">
                Read our terms of service
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Security */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Data Security
          </Text>

          <View className="bg-green-50 p-4 rounded-lg">
            <View className="flex-row items-center mb-2">
              <Shield size={20} color="#059669" />
              <Text className="text-green-800 font-medium ml-2">
                Your data is secure
              </Text>
            </View>
            <Text className="text-sm text-green-700">
              We use industry-standard encryption to protect your personal
              information. Your data is never shared with third parties without
              your explicit consent.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
