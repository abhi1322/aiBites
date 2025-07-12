import { AppText } from "@/app/components/AppText";
import { privacyPolicyData } from "@/app/components/profile";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  const renderContent = (content: string | string[]) => {
    if (typeof content === "string") {
      return (
        <AppText className="text-sm text-gray-600 leading-6">{content}</AppText>
      );
    }

    if (
      Array.isArray(content) &&
      content.length > 0 &&
      typeof content[0] === "object"
    ) {
      // Handle nested structure for "Information We Collect"
      return (
        <View className="space-y-4">
          {content.map((section: any, index: number) => (
            <View key={index}>
              <AppText
                tweight="medium"
                className="text-base text-neutral-800 mb-2"
              >
                {section.subtitle}
              </AppText>
              <Text className="text-sm text-gray-600 leading-6">
                {section.items
                  .map(
                    (item: string, itemIndex: number) =>
                      `• ${item}${itemIndex < section.items.length - 1 ? "\n" : ""}`
                  )
                  .join("")}
              </Text>
            </View>
          ))}
        </View>
      );
    }

    // Handle simple array of strings
    return (
      <View className="space-y-3">
        <AppText className="text-sm text-gray-600 leading-6">
          {content
            .map(
              (item, index) =>
                `• ${item}${index < content.length - 1 ? "\n" : ""}`
            )
            .join("")}
        </AppText>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="mt-4 bg-white mt-4 pb-4 px-4 ">
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
              Privacy Policy
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {privacyPolicyData.map((section, index) => (
          <View
            key={section.title}
            className="bg-white rounded-2xl p-6 mb-6 border border-neutral-200"
            style={styles.shadow}
          >
            <View className="flex-row items-center mb-4">
              {section.icon}
              <AppText
                tweight="medium"
                className="text-lg text-neutral-800 ml-2"
              >
                {section.title}
              </AppText>
            </View>

            {section.subtitle && (
              <AppText className="text-sm text-gray-600 leading-6">
                {section.subtitle}
              </AppText>
            )}

            {section.subtitle && typeof section.content === "string" && (
              <AppText className="text-sm text-gray-600 leading-6 mt-3">
                {section.content}
              </AppText>
            )}

            {(!section.subtitle || typeof section.content !== "string") &&
              renderContent(section.content)}
          </View>
        ))}
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
