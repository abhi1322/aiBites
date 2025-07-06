import { useAuth, useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import {
  BarChart3,
  Bell,
  Camera,
  ChevronRight,
  Edit3,
  Heart,
  HelpCircle,
  LogOut,
  Shield,
  Target,
  User,
} from "lucide-react-native";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../../convex/_generated/api";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
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

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: <User size={20} color="#6b7280" />,
          title: "Edit Profile",
          subtitle: "Update your personal information",
          onPress: () => router.push("/(app)/settings/edit-profile"),
        },
        {
          icon: <Target size={20} color="#6b7280" />,
          title: "Nutrition Goals",
          subtitle: "Set your daily targets",
          onPress: () => router.push("/(app)/settings/nutrition-goals"),
        },
        {
          icon: <Camera size={20} color="#6b7280" />,
          title: "Change Photo",
          subtitle: "Update your profile picture",
          onPress: () => router.push("/(app)/(tabs)/camera"),
        },
      ],
    },
    {
      title: "App Settings",
      items: [
        {
          icon: <Bell size={20} color="#6b7280" />,
          title: "Notifications",
          subtitle: "Manage your notifications",
          onPress: () => router.push("/(app)/settings/notifications"),
        },
        {
          icon: <BarChart3 size={20} color="#6b7280" />,
          title: "Data & Privacy",
          subtitle: "Control your data settings",
          onPress: () => router.push("/(app)/settings/data-privacy"),
        },
        {
          icon: <Heart size={20} color="#6b7280" />,
          title: "Health Insights",
          subtitle: "View your nutrition trends",
          onPress: () => router.push("/(app)/settings/health-insights"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: <HelpCircle size={20} color="#6b7280" />,
          title: "Help & Support",
          subtitle: "Get help with the app",
          onPress: () => router.push("/(app)/settings/help-support"),
        },
        {
          icon: <Shield size={20} color="#6b7280" />,
          title: "Privacy Policy",
          subtitle: "Read our privacy policy",
          onPress: () => router.push("/(app)/settings/privacy-policy"),
        },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-4">
        <View className="items-center">
          {/* Profile Image */}
          <View className="relative mb-4">
            {userData.profileImage ? (
              <Image
                source={{ uri: userData.profileImage }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                <Text className="text-gray-500 text-lg font-semibold">
                  {userData.firstName?.[0] || userData.email?.[0] || "U"}
                </Text>
              </View>
            )}
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-blue-500 w-8 h-8 rounded-full items-center justify-center"
              onPress={() => router.push("/(app)/(tabs)/camera")}
            >
              <Edit3 size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {userData.firstName} {userData.lastName}
          </Text>
          <Text className="text-gray-500 mb-3">{userData.email}</Text>

          {/* Quick Stats */}
          <View className="flex-row space-x-6">
            <View className="items-center">
              <Text className="text-lg font-bold text-blue-600">
                {userData.calorieGoal || 0}
              </Text>
              <Text className="text-xs text-gray-500">Daily Calories</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-green-600">
                {userData.proteinGoal || 0}g
              </Text>
              <Text className="text-xs text-gray-500">Protein Goal</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-orange-600">
                {userData.carbGoal || 0}g
              </Text>
              <Text className="text-xs text-gray-500">Carbs Goal</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <View key={section.title} className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 px-4 mb-2">
            {section.title}
          </Text>
          <View className="bg-white">
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={item.title}
                className={`flex-row items-center px-4 py-4 ${
                  itemIndex !== section.items.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
                onPress={item.onPress}
              >
                <View className="w-8 h-8 rounded-lg bg-gray-100 items-center justify-center mr-3">
                  {item.icon}
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-900">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-gray-500">{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Sign Out Button */}
      <View className="px-4 pb-8">
        <TouchableOpacity
          className="flex-row items-center justify-center bg-red-50 py-4 rounded-lg border border-red-200"
          onPress={handleSignOut}
        >
          <LogOut size={20} color="#dc2626" />
          <Text className="text-red-600 font-semibold ml-2">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
