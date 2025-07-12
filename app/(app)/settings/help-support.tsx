import { AppText } from "@/app/components/AppText";
import {
  handleCommonIssue,
  handleFAQ,
  handleFeatureSuggestion,
  handleReportBug,
  supportEmail,
} from "@/app/components/profile";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import * as MailComposer from "expo-mail-composer";
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
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HelpSupportScreen() {
  const router = useRouter();

  const supportPhone = "+91 7973003093";

  const handleContactSupport = () => {
    Alert.alert("Contact Support", "How would you like to contact us?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Email",
        onPress: () => handleEmailPress(),
      },
      {
        text: "Chat",
        onPress: () => Alert.alert("Chat", "Opening live chat..."),
      },
    ]);
  };

  const handleEmailPress = async () => {
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (isAvailable) {
        await MailComposer.composeAsync({
          recipients: [supportEmail],
          subject: "Support Request - Mensura App",
          body: "Hi Support Team,\n\nI need help with:\n\n[Please describe your issue here]\n\nThanks!",
        });
      } else {
        // Fallback to mailto link
        const url = `mailto:${supportEmail}?subject=Support Request - Mensura App&body=Hi Support Team,%0A%0AI need help with:%0A%0A[Please describe your issue here]%0A%0AThanks!`;
        await Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to open email app. Please contact us directly at " +
          supportEmail
      );
    }
  };

  const handlePhonePress = async () => {
    Alert.alert("Phone Support", "What would you like to do?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => Linking.openURL(`tel:${supportPhone}`),
      },
      {
        text: "Copy Number",
        onPress: async () => {
          await Clipboard.setStringAsync(supportPhone);
          Alert.alert("Copied!", "Phone number copied to clipboard");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white pb-4 px-4 mt-4">
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
              Help & Support
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Quick Help */}
        <View
          className="bg-white rounded-2xl p-6 mb-6 border border-neutral-200"
          style={styles.shadow}
        >
          <Text className="text-lg font-semibold text-neutral-700 mb-4">
            Quick Help
          </Text>

          <TouchableOpacity
            onPress={handleFAQ}
            className="flex-row items-center justify-between py-3 border-b border-neutral-100"
          >
            <View className="flex-row items-center">
              <HelpCircle size={20} color="#6b7280" />
              <Text className="text-base font-medium text-neutral-700 ml-3">
                Frequently Asked Questions
              </Text>
            </View>
            <ExternalLink size={16} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-neutral-100">
            <View className="flex-row items-center">
              <FileText size={20} color="#6b7280" />
              <Text className="text-base font-medium text-neutral-700 ml-3">
                User Guide
              </Text>
            </View>
            <ExternalLink size={16} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <FileText size={20} color="#6b7280" />
              <Text className="text-base font-medium text-neutral-700 ml-3">
                Troubleshooting
              </Text>
            </View>
            <ExternalLink size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Contact Options */}
        <View
          className="bg-white rounded-2xl p-6 mb-6 border border-neutral-200"
          style={styles.shadow}
        >
          <Text className="text-lg font-semibold text-neutral-700 mb-4">
            Contact Us
          </Text>

          <TouchableOpacity
            onPress={handleContactSupport}
            className="flex-row items-center justify-between py-3 border-b border-neutral-100"
          >
            <View className="flex-row items-center">
              <MessageCircle size={20} color="#6b7280" />
              <Text className="text-base font-medium text-neutral-700 ml-3">
                Live Chat
              </Text>
            </View>
            <Text className="text-blue-500">Available</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEmailPress}
            className="flex-row items-center justify-between py-3 border-b border-neutral-100"
          >
            <View className="flex-row items-center">
              <Mail size={20} color="#6b7280" />
              <Text className="text-base font-medium text-neutral-700 ml-3">
                Email
              </Text>
            </View>
            <Text className="text-blue-500">{supportEmail}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePhonePress}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <Phone size={20} color="#6b7280" />
              <Text className="text-base font-medium text-neutral-700 ml-3">
                Phone Support
              </Text>
            </View>
            <Text className="text-blue-500">{supportPhone}</Text>
          </TouchableOpacity>
        </View>

        {/* Common Issues */}
        <View
          className="bg-white rounded-2xl p-6 mb-6 border border-neutral-200"
          style={styles.shadow}
        >
          <Text className="text-lg font-semibold text-neutral-700 mb-4">
            Common Issues
          </Text>

          <TouchableOpacity
            onPress={() =>
              handleCommonIssue("login", "Can't log in to my account")
            }
            className="flex-row items-center justify-between py-3 border-b border-neutral-100"
          >
            <View className="flex-1">
              <Text className="text-base font-medium text-neutral-700">
                Can&apos;t log in to my account
              </Text>
              <Text className="text-sm text-neutral-500">
                Reset password or contact support
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              handleCommonIssue("analysis", "Food analysis not working")
            }
            className="flex-row items-center justify-between py-3 border-b border-neutral-100"
          >
            <View className="flex-1">
              <Text className="text-base font-medium text-neutral-700">
                Food analysis not working
              </Text>
              <Text className="text-sm text-neutral-500">
                Check camera permissions and lighting
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleCommonIssue("sync", "Data not syncing")}
            className="flex-row items-center justify-between py-3 border-b border-neutral-100"
          >
            <View className="flex-1">
              <Text className="text-base font-medium text-neutral-700">
                Data not syncing
              </Text>
              <Text className="text-sm text-neutral-500">
                Check internet connection
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleCommonIssue("crash", "App crashes frequently")}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-1">
              <Text className="text-base font-medium text-neutral-700">
                App crashes frequently
              </Text>
              <Text className="text-sm text-neutral-500">
                Update app or reinstall
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Feedback */}
        <View
          className="bg-white rounded-2xl p-6 mb-6 border border-neutral-200"
          style={styles.shadow}
        >
          <Text className="text-lg font-semibold text-neutral-700 mb-4">
            Feedback
          </Text>

          <TouchableOpacity
            onPress={handleReportBug}
            className="flex-row items-center justify-between py-3 border-b border-neutral-100"
          >
            <View className="flex-row items-center">
              <MessageCircle size={20} color="#6b7280" />
              <Text className="text-base font-medium text-neutral-700 ml-3">
                Report a Bug
              </Text>
            </View>
            <Text className="text-blue-500">Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFeatureSuggestion}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <HelpCircle size={20} color="#6b7280" />
              <Text className="text-base font-medium text-neutral-700 ml-3">
                Suggest a Feature
              </Text>
            </View>
            <Text className="text-neutral-300">Suggest</Text>
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View
          className="bg-white rounded-2xl p-6 mb-6 border border-neutral-200"
          style={styles.shadow}
        >
          <Text className="text-lg font-semibold text-neutral-700 mb-4">
            App Information
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-base text-neutral-700">Version</Text>
              <Text className="text-base text-neutral-500">1.0.0</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-base text-neutral-700">Build</Text>
              <Text className="text-base text-neutral-500">2024.1.1</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-base text-neutral-700">Last Updated</Text>
              <Text className="text-base text-neutral-500">Jan 15, 2024</Text>
            </View>
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
