import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react-native";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HelpSupportScreen() {
  const router = useRouter();

  const handleContactSupport = () => {
    Alert.alert("Contact Support", "How would you like to contact us?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Email",
        onPress: () => Alert.alert("Email", "support@aibite.com"),
      },
      {
        text: "Chat",
        onPress: () => Alert.alert("Chat", "Opening live chat..."),
      },
    ]);
  };

  const handleFAQ = () => {
    Alert.alert("FAQ", "Opening frequently asked questions...");
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
              Help & Support
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Quick Help */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Quick Help
          </Text>

          <TouchableOpacity
            onPress={handleFAQ}
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
          >
            <View className="flex-row items-center">
              <HelpCircle size={20} color="#6b7280" />
              <Text className="text-base font-medium text-gray-900 ml-3">
                Frequently Asked Questions
              </Text>
            </View>
            <ExternalLink size={16} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <FileText size={20} color="#6b7280" />
              <Text className="text-base font-medium text-gray-900 ml-3">
                User Guide
              </Text>
            </View>
            <ExternalLink size={16} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <FileText size={20} color="#6b7280" />
              <Text className="text-base font-medium text-gray-900 ml-3">
                Troubleshooting
              </Text>
            </View>
            <ExternalLink size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Contact Options */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Contact Us
          </Text>

          <TouchableOpacity
            onPress={handleContactSupport}
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
          >
            <View className="flex-row items-center">
              <MessageCircle size={20} color="#6b7280" />
              <Text className="text-base font-medium text-gray-900 ml-3">
                Live Chat
              </Text>
            </View>
            <Text className="text-blue-500">Available</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Mail size={20} color="#6b7280" />
              <Text className="text-base font-medium text-gray-900 ml-3">
                Email Support
              </Text>
            </View>
            <Text className="text-gray-500">support@aibite.com</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Phone size={20} color="#6b7280" />
              <Text className="text-base font-medium text-gray-900 ml-3">
                Phone Support
              </Text>
            </View>
            <Text className="text-gray-500">+1 (555) 123-4567</Text>
          </TouchableOpacity>
        </View>

        {/* Common Issues */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Common Issues
          </Text>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">
                Can't log in to my account
              </Text>
              <Text className="text-sm text-gray-500">
                Reset password or contact support
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">
                Food analysis not working
              </Text>
              <Text className="text-sm text-gray-500">
                Check camera permissions and lighting
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">
                Data not syncing
              </Text>
              <Text className="text-sm text-gray-500">
                Check internet connection
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">
                App crashes frequently
              </Text>
              <Text className="text-sm text-gray-500">
                Update app or reinstall
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Feedback */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Feedback
          </Text>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <MessageCircle size={20} color="#6b7280" />
              <Text className="text-base font-medium text-gray-900 ml-3">
                Report a Bug
              </Text>
            </View>
            <Text className="text-blue-500">Report</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <HelpCircle size={20} color="#6b7280" />
              <Text className="text-base font-medium text-gray-900 ml-3">
                Suggest a Feature
              </Text>
            </View>
            <Text className="text-blue-500">Suggest</Text>
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            App Information
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-base text-gray-900">Version</Text>
              <Text className="text-base text-gray-500">1.0.0</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-base text-gray-900">Build</Text>
              <Text className="text-base text-gray-500">2024.1.1</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-base text-gray-900">Last Updated</Text>
              <Text className="text-base text-gray-500">Jan 15, 2024</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
