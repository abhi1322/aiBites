import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

// Profile data interface
interface ProfileData {
  firstName: string;
  lastName: string;
  profileImage?: string;
  height: string;
  weight: number;
  gender: "male" | "female" | "other" | null;
  dateOfBirth: Date;
  calorieGoal: string;
  proteinGoal: string;
  carbGoal: string;
  fatGoal: string;
}

interface BasicInfoStepProps {
  profileData: ProfileData;
  updateProfileData: (updates: Partial<ProfileData>) => void;
  showDatePicker: () => void;
  pickImage: () => void;
  formatDate: (date: Date) => string;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  profileData,
  updateProfileData,
  showDatePicker,
  pickImage,
  formatDate,
}) => {
  return (
    <View className="space-y-6">
      <View className="text-center">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </Text>
        <Text className="text-gray-600">Tell us about yourself</Text>
      </View>

      {/* Profile Image */}
      <View className="items-center">
        <TouchableOpacity
          onPress={pickImage}
          className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center border-2 border-gray-300"
        >
          {profileData.profileImage ? (
            <Image
              source={{ uri: profileData.profileImage }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <Text className="text-gray-500 text-sm">Add Photo</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Name Fields */}
      <View className="flex-row space-x-2">
        <View className="flex-1">
          <Text className="text-gray-700 font-semibold mb-2">First Name *</Text>
          <TextInput
            value={profileData.firstName}
            onChangeText={(text) => updateProfileData({ firstName: text })}
            placeholder="First name"
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            autoCapitalize="words"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 font-semibold mb-2">Last Name *</Text>
          <TextInput
            value={profileData.lastName}
            onChangeText={(text) => updateProfileData({ lastName: text })}
            placeholder="Last name"
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            autoCapitalize="words"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>
      </View>

      {/* Gender */}
      <View>
        <Text className="text-gray-700 font-semibold mb-2">Gender *</Text>
        <View className="flex-row space-x-4">
          {["male", "female", "other"].map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() =>
                updateProfileData({ gender: g as "male" | "female" | "other" })
              }
              className={`px-4 py-2 rounded-lg border ${
                profileData.gender === g
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300"
              }`}
            >
              <Text
                className={
                  profileData.gender === g ? "text-white" : "text-gray-700"
                }
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Date of Birth */}
      <View>
        <Text className="text-gray-700 font-semibold mb-2">Date of Birth</Text>
        <TouchableOpacity
          onPress={showDatePicker}
          className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
        >
          <Text className="text-lg text-gray-900">
            {formatDate(profileData.dateOfBirth)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export type { ProfileData };
