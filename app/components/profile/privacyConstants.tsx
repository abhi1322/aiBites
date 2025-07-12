import {
  Baby,
  Database,
  FileEdit,
  Lock,
  Mail,
  Share2,
  Shield,
  Target,
  UserCheck,
} from "lucide-react-native";
import React from "react";

export interface PrivacySection {
  title: string;
  icon?: React.ReactNode;
  content: string | string[] | any[];
  subtitle?: string;
}

export const privacyPolicyData: PrivacySection[] = [
  {
    title: "Privacy Policy",
    icon: <Shield size={24} className="text-neutral-500" />,
    subtitle: "Last updated: 12th July, 2025",
    content:
      "Mensur is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.",
  },
  {
    title: "Information We Collect",
    icon: <Database size={24} className="text-neutral-500" />,
    content: [
      {
        subtitle: "Personal Information",
        items: [
          "Name and email address when you create an account",
          "Profile information including height, weight, and nutrition goals",
          "Profile pictures you choose to upload",
        ],
      },
      {
        subtitle: "Usage Information",
        items: [
          "Food photos you take for analysis",
          "Nutrition data and meal logs",
          "App usage patterns and preferences",
        ],
      },
      {
        subtitle: "Device Information",
        items: [
          "Device type and operating system",
          "App version and crash reports",
          "Camera permissions for food analysis",
        ],
      },
    ],
  },
  {
    title: "How We Use Your Information",
    icon: <Target size={24} className="text-neutral-500" />,
    content: [
      "Provide food analysis and nutrition tracking services",
      "Personalize your experience and recommendations",
      "Improve our app functionality and user experience",
      "Send you important updates and notifications",
      "Respond to your support requests",
      "Ensure app security and prevent fraud",
    ],
  },
  {
    title: "Information Sharing",
    icon: <Share2 size={24} className="text-neutral-500" />,
    content: [
      "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:",
      "Service providers who assist in app operations",
      "Legal requirements and law enforcement",
      "Business transfers (in case of merger or acquisition)",
      "With your explicit consent",
    ],
  },
  {
    title: "Data Security",
    icon: <Lock size={24} className="text-neutral-500" />,
    content: [
      "We implement appropriate security measures to protect your personal information:",
      "Encryption of data in transit and at rest",
      "Regular security assessments and updates",
      "Access controls and authentication",
      "Secure data storage practices",
    ],
  },
  {
    title: "Your Rights",
    icon: <UserCheck size={24} className="text-neutral-500" />,
    content: [
      "Access and review your personal data",
      "Update or correct your information",
      "Delete your account and data",
      "Opt-out of certain communications",
      "Export your data",
      "Request data processing restrictions",
    ],
  },
  {
    title: "Children's Privacy",
    icon: <Baby size={24} className="text-neutral-500" />,
    content:
      "Our app is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.",
  },
  {
    title: "Changes to This Privacy Policy",
    icon: <FileEdit size={24} className="text-neutral-500" />,
    content:
      'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.',
  },
  {
    title: "Contact Us",
    icon: <Mail size={24} className="text-neutral-500" />,
    content: [
      "If you have any questions about this Privacy Policy, please contact us:",
      "Email: kumarabhishek282001@gmail.com",
      "Phone: +91 7973003093",
    ],
  },
];
