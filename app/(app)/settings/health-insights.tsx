import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Target,
  TrendingUp,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../convex/_generated/api";

export default function HealthInsightsScreen() {
  const { user } = useUser();
  const router = useRouter();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!user) return null;
  if (userData === undefined)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  if (userData === null)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">No user data found.</Text>
      </View>
    );

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
              Health Insights
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Weekly Overview */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            This Week's Overview
          </Text>

          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                  <BarChart3 size={20} color="#3b82f6" />
                </View>
                <View className="ml-3">
                  <Text className="text-base font-medium text-gray-900">
                    Average Calories
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Daily intake this week
                  </Text>
                </View>
              </View>
              <Text className="text-lg font-bold text-blue-600">1,850</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center">
                  <Target size={20} color="#059669" />
                </View>
                <View className="ml-3">
                  <Text className="text-base font-medium text-gray-900">
                    Goal Achievement
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Days meeting calorie goal
                  </Text>
                </View>
              </View>
              <Text className="text-lg font-bold text-green-600">5/7</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-orange-100 rounded-lg items-center justify-center">
                  <TrendingUp size={20} color="#ea580c" />
                </View>
                <View className="ml-3">
                  <Text className="text-base font-medium text-gray-900">
                    Protein Intake
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Average daily protein
                  </Text>
                </View>
              </View>
              <Text className="text-lg font-bold text-orange-600">85g</Text>
            </View>
          </View>
        </View>

        {/* Nutrition Trends */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Nutrition Trends
          </Text>

          <View className="space-y-4">
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-sm font-medium text-gray-900 mb-2">
                Protein Intake Trend
              </Text>
              <View className="flex-row items-center">
                <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: "75%" }}
                  />
                </View>
                <Text className="text-sm text-gray-600 ml-2">75%</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Meeting your daily protein goal
              </Text>
            </View>

            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-sm font-medium text-gray-900 mb-2">
                Carbohydrate Balance
              </Text>
              <View className="flex-row items-center">
                <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: "60%" }}
                  />
                </View>
                <Text className="text-sm text-gray-600 ml-2">60%</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Within recommended range
              </Text>
            </View>

            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-sm font-medium text-gray-900 mb-2">
                Fat Intake
              </Text>
              <View className="flex-row items-center">
                <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: "45%" }}
                  />
                </View>
                <Text className="text-sm text-gray-600 ml-2">45%</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Below recommended intake
              </Text>
            </View>
          </View>
        </View>

        {/* Meal Patterns */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Meal Patterns
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-900">Breakfast</Text>
              <Text className="text-sm text-gray-500">7 days logged</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-900">Lunch</Text>
              <Text className="text-sm text-gray-500">6 days logged</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-900">Dinner</Text>
              <Text className="text-sm text-gray-500">7 days logged</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-900">Snacks</Text>
              <Text className="text-sm text-gray-500">4 days logged</Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Personalized Recommendations
          </Text>

          <View className="space-y-3">
            <View className="bg-blue-50 p-4 rounded-lg">
              <Text className="text-sm font-medium text-blue-900 mb-1">
                Increase Protein Intake
              </Text>
              <Text className="text-xs text-blue-700">
                Try adding more lean meats, eggs, or plant-based proteins to
                reach your daily goal.
              </Text>
            </View>

            <View className="bg-green-50 p-4 rounded-lg">
              <Text className="text-sm font-medium text-green-900 mb-1">
                Great Job on Consistency!
              </Text>
              <Text className="text-xs text-green-700">
                You've logged meals for 6 out of 7 days this week. Keep it up!
              </Text>
            </View>

            <View className="bg-yellow-50 p-4 rounded-lg">
              <Text className="text-sm font-medium text-yellow-900 mb-1">
                Consider More Healthy Fats
              </Text>
              <Text className="text-xs text-yellow-700">
                Add nuts, avocados, or olive oil to increase your healthy fat
                intake.
              </Text>
            </View>
          </View>
        </View>

        {/* Historical Data */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Historical Data
          </Text>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Calendar size={20} color="#6b7280" />
              <Text className="text-base font-medium text-gray-900 ml-3">
                Monthly Report
              </Text>
            </View>
            <Text className="text-blue-500">View</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <BarChart3 size={20} color="#6b7280" />
              <Text className="text-base font-medium text-gray-900 ml-3">
                Progress Charts
              </Text>
            </View>
            <Text className="text-blue-500">View</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
