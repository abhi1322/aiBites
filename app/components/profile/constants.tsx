import {
  BarChart3,
  Bell,
  Heart,
  HelpCircle,
  Shield,
  Target,
  User,
} from "lucide-react-native";
import React from "react";

export interface SettingsItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export const createSettingsSections = (router: any): SettingsSection[] => [
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
