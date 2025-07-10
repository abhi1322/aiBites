import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { api } from "../../convex/_generated/api";
import { uploadProfilePictureToCloudinary } from "../../utils/cloudinary";
import type { StepType } from "../components/profile-setup";

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

export const useProfileSetup = () => {
  const { user } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  // Current step state
  const [currentStep, setCurrentStep] = useState<StepType>(0);

  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    profileImage: user?.imageUrl || undefined,
    height: "",
    weight: 70,
    gender: null,
    dateOfBirth: new Date(1990, 0, 1),
    calorieGoal: "",
    proteinGoal: "",
    carbGoal: "",
    fatGoal: "",
  });

  // fetch using api from convex
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  console.log("userData", userData);

  // if data exist then put in userData to profileData
  useEffect(() => {
    if (userData) {
      setProfileData((prev) => ({
        firstName: userData.firstName ?? prev.firstName,
        lastName: userData.lastName ?? prev.lastName,
        profileImage: userData.profileImage ?? prev.profileImage,
        height:
          userData.height !== undefined ? String(userData.height) : prev.height,
        weight: userData.weight !== undefined ? userData.weight : prev.weight,
        gender: userData.gender ?? prev.gender,
        dateOfBirth: userData.dateOfBirth
          ? new Date(userData.dateOfBirth)
          : prev.dateOfBirth,
        calorieGoal:
          userData.calorieGoal !== undefined
            ? String(userData.calorieGoal)
            : prev.calorieGoal,
        proteinGoal:
          userData.proteinGoal !== undefined
            ? String(userData.proteinGoal)
            : prev.proteinGoal,
        carbGoal:
          userData.carbGoal !== undefined
            ? String(userData.carbGoal)
            : prev.carbGoal,
        fatGoal:
          userData.fatGoal !== undefined
            ? String(userData.fatGoal)
            : prev.fatGoal,
      }));
    }
  }, [userData]);

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update profile data
  const updateProfileData = useCallback((updates: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as StepType);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((currentStep - 1) as StepType);
    }
  };

  // Image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      // Only set the local URI for preview
      updateProfileData({ profileImage: result.assets[0].uri });
    }
  };

  // Date picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      updateProfileData({ dateOfBirth: selectedDate });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Validation functions
  const validateBasicInfo = () => {
    return (
      profileData.firstName.trim() &&
      profileData.lastName.trim() &&
      profileData.gender
    );
  };

  const validateHeight = () => {
    return profileData.height.trim() && !isNaN(Number(profileData.height));
  };

  const validateWeight = () => {
    return profileData.weight > 0;
  };

  const validateNutrition = () => {
    return (
      profileData.calorieGoal.trim() && !isNaN(Number(profileData.calorieGoal))
    );
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return validateBasicInfo();
      case 1:
        return validateHeight();
      case 2:
        return validateWeight();
      case 3:
        return validateNutrition();
      default:
        return false;
    }
  };

  // Submit profile
  const handleCompleteProfile = async () => {
    if (
      !validateBasicInfo() ||
      !validateHeight() ||
      !validateWeight() ||
      !validateNutrition()
    ) {
      Alert.alert("Error", "Please complete all required fields");
      return;
    }

    setIsLoading(true);

    try {
      let profileImageUrl = profileData.profileImage;
      if (
        profileImageUrl &&
        (profileImageUrl.startsWith("file://") ||
          profileImageUrl.startsWith("content://"))
      ) {
        profileImageUrl =
          await uploadProfilePictureToCloudinary(profileImageUrl);
      }
      const result = await createOrUpdateUser({
        clerkId: user?.id!,
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        height: Number(profileData.height),
        weight: profileData.weight,
        gender: profileData.gender ?? undefined,
        dateOfBirth: profileData.dateOfBirth.getTime(),
        calorieGoal: profileData.calorieGoal
          ? Number(profileData.calorieGoal)
          : undefined,
        proteinGoal: profileData.proteinGoal
          ? Number(profileData.proteinGoal)
          : undefined,
        carbGoal: profileData.carbGoal
          ? Number(profileData.carbGoal)
          : undefined,
        fatGoal: profileData.fatGoal ? Number(profileData.fatGoal) : undefined,
        profileImage: profileImageUrl,
        profileCompleted: true, // <-- Mark as complete on final step
      });
      // Navigate to Congratulations page
      router.replace("/congratulations");
    } catch (error) {
      console.error("Profile completion error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    currentStep,
    profileData,
    showDatePicker,
    isLoading,

    // Actions
    updateProfileData,
    goToNextStep,
    goToPreviousStep,
    pickImage,
    handleDateChange,
    formatDate,
    setShowDatePicker,
    isCurrentStepValid,
    handleCompleteProfile,
  };
};

export type { ProfileData };
