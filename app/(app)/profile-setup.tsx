import { useUser } from "@clerk/clerk-expo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../convex/_generated/api";

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

// Step configuration
const STEPS = {
  BASIC_INFO: 0,
  HEIGHT: 1,
  WEIGHT: 2,
  NUTRITION: 3,
} as const;

type StepType = (typeof STEPS)[keyof typeof STEPS];

export default function ProfileSetupScreen() {
  const { user } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  // Current step state
  const [currentStep, setCurrentStep] = useState<StepType>(STEPS.BASIC_INFO);

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

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update profile data
  const updateProfileData = (updates: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...updates }));
  };

  console.log("userData", user?.imageUrl);

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < STEPS.NUTRITION) {
      setCurrentStep((currentStep + 1) as StepType);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > STEPS.BASIC_INFO) {
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
      updateProfileData({ profileImage: result.assets[0].uri });
    }
  };

  // Date picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
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
      const result = await createOrUpdateUser({
        clerkId: user?.id!,
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        height: Number(profileData.height),
        weight: profileData.weight,
        gender: profileData.gender || undefined,
        calorieGoal: Number(profileData.calorieGoal),
        proteinGoal: profileData.proteinGoal
          ? Number(profileData.proteinGoal)
          : undefined,
        carbGoal: profileData.carbGoal
          ? Number(profileData.carbGoal)
          : undefined,
        fatGoal: profileData.fatGoal ? Number(profileData.fatGoal) : undefined,
        dateOfBirth: profileData.dateOfBirth.getTime(),
        profileCompleted: true,
      });

      console.log("Profile completion result:", result);
      console.log("Profile-setup: Profile completion successful");
    } catch (error) {
      console.error("Profile completion error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
      router.replace("/(app)/home");
    }
  };

  // Progress bar component
  const ProgressBar = () => (
    <View className="px-6 pt-4">
      <View className="flex-row justify-between mb-2">
        {Object.values(STEPS).map((step) => (
          <Text
            key={step}
            className={`text-sm font-medium ${
              step <= currentStep ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {step === STEPS.BASIC_INFO && "Basic"}
            {step === STEPS.HEIGHT && "Height"}
            {step === STEPS.WEIGHT && "Weight"}
            {step === STEPS.NUTRITION && "Goals"}
          </Text>
        ))}
      </View>
      <View className="h-2 bg-gray-200 rounded-full">
        <View
          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / Object.keys(STEPS).length) * 100}%`,
          }}
        />
      </View>
    </View>
  );

  // Step content components
  const BasicInfoStep = () => (
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
          onPress={() => setShowDatePicker(true)}
          className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
        >
          <Text className="text-lg text-gray-900">
            {formatDate(profileData.dateOfBirth)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const HeightStep = () => (
    <View className="space-y-6">
      <View className="text-center">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Your Height
        </Text>
        <Text className="text-gray-600">Enter your height in centimeters</Text>
      </View>

      <View>
        <Text className="text-gray-700 font-semibold mb-2">Height (cm) *</Text>
        <TextInput
          value={profileData.height}
          onChangeText={(text) => updateProfileData({ height: text })}
          placeholder="e.g. 175"
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg text-center"
          keyboardType="numeric"
          autoCorrect={false}
          spellCheck={false}
        />
      </View>

      <View className="bg-blue-50 rounded-lg p-4">
        <Text className="text-blue-800 text-sm">
          💡 Tip: You can measure your height using a wall and a book, or check
          your driver&apos;s license.
        </Text>
      </View>
    </View>
  );

  const WeightStep = () => (
    <View className="space-y-6">
      <View className="text-center">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Your Weight
        </Text>
        <Text className="text-gray-600">
          Enter your current weight in kilograms
        </Text>
      </View>

      <View>
        <Text className="text-gray-700 font-semibold mb-2">Weight (kg) *</Text>
        <TextInput
          value={profileData.weight.toString()}
          onChangeText={(text) =>
            updateProfileData({ weight: Number(text) || 0 })
          }
          placeholder="e.g. 70"
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg text-center"
          keyboardType="numeric"
          autoCorrect={false}
          spellCheck={false}
        />
      </View>

      <View className="bg-blue-50 rounded-lg p-4">
        <Text className="text-blue-800 text-sm">
          💡 Tip: 1 kg = 2.2 lbs. You can use a bathroom scale or check recent
          medical records.
        </Text>
      </View>
    </View>
  );

  const NutritionStep = () => (
    <View className="space-y-6">
      <View className="text-center">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Nutrition Goals
        </Text>
        <Text className="text-gray-600">
          Set your daily calorie and macronutrient targets
        </Text>
      </View>

      {/* Calorie Goal */}
      <View>
        <Text className="text-gray-700 font-semibold mb-2">
          Daily Calorie Goal *
        </Text>
        <TextInput
          value={profileData.calorieGoal}
          onChangeText={(text) => updateProfileData({ calorieGoal: text })}
          placeholder="e.g. 2000"
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
          keyboardType="numeric"
          autoCorrect={false}
          spellCheck={false}
        />
      </View>

      {/* Macronutrients */}
      <View className="space-y-4">
        <Text className="text-gray-700 font-semibold">
          Macronutrients (Optional)
        </Text>

        <View>
          <Text className="text-gray-600 mb-2">Protein Goal (g)</Text>
          <TextInput
            value={profileData.proteinGoal}
            onChangeText={(text) => updateProfileData({ proteinGoal: text })}
            placeholder="e.g. 150"
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            keyboardType="numeric"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View>
          <Text className="text-gray-600 mb-2">Carb Goal (g)</Text>
          <TextInput
            value={profileData.carbGoal}
            onChangeText={(text) => updateProfileData({ carbGoal: text })}
            placeholder="e.g. 250"
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            keyboardType="numeric"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View>
          <Text className="text-gray-600 mb-2">Fat Goal (g)</Text>
          <TextInput
            value={profileData.fatGoal}
            onChangeText={(text) => updateProfileData({ fatGoal: text })}
            placeholder="e.g. 70"
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            keyboardType="numeric"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>
      </View>

      <View className="bg-green-50 rounded-lg p-4">
        <Text className="text-green-800 text-sm">
          🎯 Tip: Start with calorie goals first. You can always adjust
          macronutrients later based on your progress.
        </Text>
      </View>
    </View>
  );

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        return <BasicInfoStep />;
      case STEPS.HEIGHT:
        return <HeightStep />;
      case STEPS.WEIGHT:
        return <WeightStep />;
      case STEPS.NUTRITION:
        return <NutritionStep />;
      default:
        return <BasicInfoStep />;
    }
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        return validateBasicInfo();
      case STEPS.HEIGHT:
        return validateHeight();
      case STEPS.WEIGHT:
        return validateWeight();
      case STEPS.NUTRITION:
        return validateNutrition();
      default:
        return false;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Progress Bar */}
        <ProgressBar />

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Step Content */}
          <View className="pt-6">{renderCurrentStep()}</View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View className="px-6 pb-6 flex-row space-x-4">
          {currentStep > STEPS.BASIC_INFO && (
            <TouchableOpacity
              onPress={goToPreviousStep}
              className="flex-1 py-3 border border-gray-300 rounded-lg"
            >
              <Text className="text-gray-700 text-center font-semibold text-lg">
                Back
              </Text>
            </TouchableOpacity>
          )}

          {currentStep < STEPS.NUTRITION ? (
            <TouchableOpacity
              onPress={goToNextStep}
              disabled={!isCurrentStepValid()}
              className={`flex-1 py-3 rounded-lg ${
                isCurrentStepValid() ? "bg-blue-600" : "bg-gray-400"
              }`}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Next
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleCompleteProfile}
              disabled={isLoading || !isCurrentStepValid()}
              className={`flex-1 py-3 rounded-lg ${
                isLoading || !isCurrentStepValid()
                  ? "bg-gray-400"
                  : "bg-green-600"
              }`}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? "Completing..." : "Complete Profile"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={profileData.dateOfBirth}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </SafeAreaView>
  );
}
