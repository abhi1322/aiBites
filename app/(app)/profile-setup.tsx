import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BasicInfoStep,
  DatePickerModal,
  HeightStep,
  NutritionStep,
  ProgressBar,
  StepNavigation,
  STEPS,
  WeightStep,
} from "../components/profile-setup";
import { useProfileSetup } from "../hooks/useProfileSetup";

type StepType = (typeof STEPS)[keyof typeof STEPS];

export default function ProfileSetupScreen() {
  const {
    currentStep,
    profileData,
    showDatePicker,
    isLoading,
    updateProfileData,
    goToNextStep,
    goToPreviousStep,
    pickImage,
    handleDateChange,
    formatDate,
    setShowDatePicker,
    isCurrentStepValid,
    handleCompleteProfile,
  } = useProfileSetup();

  const headerHeight = Platform.OS === "ios" ? 44 : 0; // fallback if useHeaderHeight is not available

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        return (
          <BasicInfoStep
            profileData={profileData}
            updateProfileData={updateProfileData}
            showDatePicker={() => setShowDatePicker(true)}
            pickImage={pickImage}
            formatDate={formatDate}
          />
        );
      case STEPS.HEIGHT:
        return (
          <HeightStep
            height={profileData.height}
            updateHeight={(height) => updateProfileData({ height })}
          />
        );
      case STEPS.WEIGHT:
        return (
          <WeightStep
            weight={profileData.weight}
            updateWeight={(weight) => updateProfileData({ weight })}
          />
        );
      case STEPS.NUTRITION:
        return (
          <NutritionStep
            calorieGoal={profileData.calorieGoal}
            proteinGoal={profileData.proteinGoal}
            carbGoal={profileData.carbGoal}
            fatGoal={profileData.fatGoal}
            updateCalorieGoal={(goal) =>
              updateProfileData({ calorieGoal: goal })
            }
            updateProteinGoal={(goal) =>
              updateProfileData({ proteinGoal: goal })
            }
            updateCarbGoal={(goal) => updateProfileData({ carbGoal: goal })}
            updateFatGoal={(goal) => updateProfileData({ fatGoal: goal })}
          />
        );
      default:
        return (
          <BasicInfoStep
            profileData={profileData}
            updateProfileData={updateProfileData}
            showDatePicker={() => setShowDatePicker(true)}
            pickImage={pickImage}
            formatDate={formatDate}
          />
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={headerHeight + 20}
      >
        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} />

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Step Content */}
          <View className="pt-6">{renderCurrentStep()}</View>
        </ScrollView>

        {/* Navigation Buttons */}
        <StepNavigation
          currentStep={currentStep}
          goToNextStep={goToNextStep}
          goToPreviousStep={goToPreviousStep}
          handleCompleteProfile={handleCompleteProfile}
          isCurrentStepValid={isCurrentStepValid as () => boolean}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DatePickerModal
          value={profileData.dateOfBirth}
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
}

export const options = {
  headerShown: false,
};
