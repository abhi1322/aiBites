import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { ArrowLeft, Edit3, User } from "lucide-react-native";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../../convex/_generated/api";

export default function EditProfileScreen() {
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

  const handleSave = () => {
    Alert.alert("Success", "Profile updated successfully!");
    router.back();
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
              Edit Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Profile Image Section */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Profile Photo
          </Text>
          <View className="items-center">
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
            <TouchableOpacity
              onPress={() => router.push("/(app)/(tabs)/camera")}
              className="bg-gray-100 px-4 py-2 rounded-lg"
            >
              <Text className="text-blue-500 font-medium">Change Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              First Name
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter first name"
              defaultValue={userData.firstName || ""}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Last Name
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter last name"
              defaultValue={userData.lastName || ""}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
              placeholder="Enter email"
              defaultValue={userData.email || ""}
              editable={false}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </Text>
          </View>
        </View>

        {/* Account Settings */}
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Account Settings
          </Text>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <User size={20} color="#6b7280" />
              <Text className="text-gray-900 ml-3">Account Privacy</Text>
            </View>
            <Text className="text-gray-500">Public</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <User size={20} color="#6b7280" />
              <Text className="text-gray-900 ml-3">Data Export</Text>
            </View>
            <Text className="text-blue-500">Export</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
