import { AppText } from "@/app/components/AppText";
import { SettingsCard, SettingsContainer } from "@/app/components/profile";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ArrowLeft, Download, Edit3, Shield } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";
import { api } from "../../../convex/_generated/api";
import { uploadProfilePictureToCloudinary } from "../../../utils/cloudinary";

export default function EditProfileScreen() {
  const { user } = useUser();
  const router = useRouter();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const updateUser = useMutation(api.users.createOrUpdateUser);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [profileImage, setProfileImage] = useState(
    userData?.profileImage || ""
  );

  // Update local state when userData changes
  React.useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setProfileImage(userData.profileImage || "");
    }
  }, [userData]);

  if (!user) return null;
  if (userData === undefined)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <AppText className="text-gray-500">Loading...</AppText>
      </View>
    );
  if (userData === null)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <AppText className="text-gray-500">No user data found.</AppText>
      </View>
    );

  const handleSave = async () => {
    if (!user?.id) {
      Toast.error("User not authenticated");
      return;
    }

    setIsSaving(true);
    try {
      await updateUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        profileImage: profileImage,
      });

      Toast.success("Profile updated successfully!");

      // Navigate back after a short delay to show the toast
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccountPrivacy = () => {
    Toast.info("Privacy settings will be available soon!");
  };

  const handleDataExport = () => {
    Toast.info("Exporting your data...");
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.error(
          "Camera roll permissions are required to select a profile picture."
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Toast.error("Failed to select image. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Toast.error("Camera permissions are required to take a photo.");
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Toast.error("Failed to take photo. Please try again.");
    }
  };

  const uploadProfileImage = async (imageUri: string) => {
    setIsUploading(true);
    try {
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadProfilePictureToCloudinary(imageUri);

      // Update local state with new image URL
      setProfileImage(cloudinaryUrl);

      Toast.success(
        "Profile picture updated! Don't forget to save your changes."
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      Toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImagePress = () => {
    Alert.alert("Update Profile Picture", "Choose an option", [
      { text: "Cancel", style: "cancel" },
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Library", onPress: pickImage },
    ]);
  };

  const hasChanges = () => {
    return (
      firstName !== (userData?.firstName || "") ||
      lastName !== (userData?.lastName || "") ||
      profileImage !== (userData?.profileImage || "")
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white mt-4 pb-4 px-4 ">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <AppText className="text-lg font-semibold text-neutral-900 ml-2">
            Edit Profile
          </AppText>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving || !hasChanges()}
            className={`px-4 py-2 rounded-full ${
              isSaving || !hasChanges() ? "bg-gray-300" : "bg-neutral-800"
            }`}
            style={{
              borderRadius: 100,
            }}
          >
            {isSaving ? (
              <ActivityIndicator size={16} color="white" />
            ) : (
              <AppText className="text-white font-semibold">Save</AppText>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-16">
        {/* Profile Image Section */}
        <AppText className="text-base text-center font-semibold text-neutral-500 mb-4">
          Update your personal information
        </AppText>
        <View className="bg-white rounded-lg px-6 my-2">
          <View className="items-center">
            <View className="relative mb-4">
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                  <AppText className="text-neutral-500 text-lg font-semibold">
                    {firstName?.[0] || userData?.email?.[0] || "U"}
                  </AppText>
                </View>
              )}
              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-neutral-800 w-8 h-8 rounded-full items-center justify-center"
                onPress={handleImagePress}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator size={12} color="white" />
                ) : (
                  <Edit3 size={16} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View className="bg-white rounded-lg py-6 mb-6 gap-4">
          <View className="flex items-start">
            <AppText
              className="text-sm text-neutral-500 text-center"
              tweight="regular"
            >
              First Name
            </AppText>
            <TextInput
              placeholder="Update your first name"
              value={firstName}
              onChangeText={setFirstName}
              className="w-full h-14 rounded-md border border-[#E0E0E0] p-2"
            />
          </View>

          <View className="flex items-start">
            <AppText
              className="text-sm text-neutral-500 text-center"
              tweight="regular"
            >
              Last Name
            </AppText>
            <TextInput
              placeholder="Update your last name"
              value={lastName}
              onChangeText={setLastName}
              className="w-full h-14 rounded-md border border-[#E0E0E0] p-2"
            />
          </View>
        </View>

        {/* Account Settings */}
        <SettingsContainer title="Account Settings">
          <SettingsCard
            title="Account Privacy"
            subtitle="Manage your privacy settings"
            icon={<Shield size={20} color="#6b7280" />}
            onPress={handleAccountPrivacy}
            showBorder={true}
          />
          <SettingsCard
            title="Data Export"
            subtitle="Export your personal data"
            icon={<Download size={20} color="#6b7280" />}
            onPress={handleDataExport}
            showBorder={false}
          />
        </SettingsContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
