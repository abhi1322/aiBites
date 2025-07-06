import { useRouter } from "expo-router";
import { ArrowLeft, Shield } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

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
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Introduction */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <View className="flex-row items-center mb-4">
            <Shield size={24} color="#3b82f6" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">
              Privacy Policy
            </Text>
          </View>
          <Text className="text-sm text-gray-600 leading-6">
            Last updated: January 15, 2024
          </Text>
          <Text className="text-sm text-gray-600 leading-6 mt-3">
            AIBite ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our mobile application.
          </Text>
        </View>

        {/* Information We Collect */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Information We Collect
          </Text>

          <View className="space-y-4">
            <View>
              <Text className="text-base font-medium text-gray-900 mb-2">
                Personal Information
              </Text>
              <Text className="text-sm text-gray-600 leading-6">
                • Name and email address when you create an account{"\n"}•
                Profile information including height, weight, and nutrition
                goals{"\n"}• Profile pictures you choose to upload
              </Text>
            </View>

            <View>
              <Text className="text-base font-medium text-gray-900 mb-2">
                Usage Information
              </Text>
              <Text className="text-sm text-gray-600 leading-6">
                • Food photos you take for analysis{"\n"}• Nutrition data and
                meal logs{"\n"}• App usage patterns and preferences
              </Text>
            </View>

            <View>
              <Text className="text-base font-medium text-gray-900 mb-2">
                Device Information
              </Text>
              <Text className="text-sm text-gray-600 leading-6">
                • Device type and operating system{"\n"}• App version and crash
                reports{"\n"}• Camera permissions for food analysis
              </Text>
            </View>
          </View>
        </View>

        {/* How We Use Your Information */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            How We Use Your Information
          </Text>

          <View className="space-y-3">
            <Text className="text-sm text-gray-600 leading-6">
              • Provide food analysis and nutrition tracking services{"\n"}•
              Personalize your experience and recommendations{"\n"}• Improve our
              app functionality and user experience{"\n"}• Send you important
              updates and notifications{"\n"}• Respond to your support requests
              {"\n"}• Ensure app security and prevent fraud
            </Text>
          </View>
        </View>

        {/* Information Sharing */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Information Sharing
          </Text>

          <Text className="text-sm text-gray-600 leading-6 mb-4">
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except in the
            following circumstances:
          </Text>

          <View className="space-y-3">
            <Text className="text-sm text-gray-600 leading-6">
              • Service providers who assist in app operations{"\n"}• Legal
              requirements and law enforcement{"\n"}• Business transfers (in
              case of merger or acquisition){"\n"}• With your explicit consent
            </Text>
          </View>
        </View>

        {/* Data Security */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Data Security
          </Text>

          <Text className="text-sm text-gray-600 leading-6 mb-4">
            We implement appropriate security measures to protect your personal
            information:
          </Text>

          <View className="space-y-3">
            <Text className="text-sm text-gray-600 leading-6">
              • Encryption of data in transit and at rest{"\n"}• Regular
              security assessments and updates{"\n"}• Access controls and
              authentication{"\n"}• Secure data storage practices
            </Text>
          </View>
        </View>

        {/* Your Rights */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Your Rights
          </Text>

          <View className="space-y-3">
            <Text className="text-sm text-gray-600 leading-6">
              • Access and review your personal data{"\n"}• Update or correct
              your information{"\n"}• Delete your account and data{"\n"}•
              Opt-out of certain communications{"\n"}• Export your data{"\n"}•
              Request data processing restrictions
            </Text>
          </View>
        </View>

        {/* Children's Privacy */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Children's Privacy
          </Text>

          <Text className="text-sm text-gray-600 leading-6">
            Our app is not intended for children under 13 years of age. We do
            not knowingly collect personal information from children under 13.
            If you are a parent or guardian and believe your child has provided
            us with personal information, please contact us immediately.
          </Text>
        </View>

        {/* Changes to Privacy Policy */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Changes to This Privacy Policy
          </Text>

          <Text className="text-sm text-gray-600 leading-6">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </Text>
        </View>

        {/* Contact Information */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Contact Us
          </Text>

          <Text className="text-sm text-gray-600 leading-6 mb-3">
            If you have any questions about this Privacy Policy, please contact
            us:
          </Text>

          <View className="space-y-2">
            <Text className="text-sm text-gray-600">
              Email: privacy@aibite.com
            </Text>
            <Text className="text-sm text-gray-600">
              Address: 123 Tech Street, San Francisco, CA 94105
            </Text>
            <Text className="text-sm text-gray-600">
              Phone: +1 (555) 123-4567
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
