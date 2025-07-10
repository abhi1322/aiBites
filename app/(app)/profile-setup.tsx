// screens/ProfileSetupScreen.tsx
import React, { useCallback, useMemo } from "react";
import {
  InteractionManager,
  Keyboard,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
import { STEP_KEYS } from "../components/profile-setup/ProgressBar";
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

  const headerHeight = Platform.OS === "ios" ? 44 : 0;

  // Optimized height update function
  const handleHeightUpdate = useCallback(
    (height: string) => {
      console.log("Height update received:", height);

      // Use InteractionManager for smooth updates
      InteractionManager.runAfterInteractions(() => {
        updateProfileData({ height });
      });
    },
    [updateProfileData]
  );

  // Memoized step components to prevent unnecessary re-renders
  const stepComponents = useMemo(
    () => ({
      [STEP_KEYS.BASIC_INFO]: (
        <BasicInfoStep
          profileData={profileData}
          updateProfileData={updateProfileData}
          showDatePicker={() => setShowDatePicker(true)}
          pickImage={pickImage}
          formatDate={formatDate}
        />
      ),
      [STEP_KEYS.HEIGHT]: (
        <HeightStep
          height={profileData.height}
          updateHeight={handleHeightUpdate}
        />
      ),
      [STEP_KEYS.WEIGHT]: (
        <WeightStep
          weight={profileData.weight}
          updateWeight={(weight) => updateProfileData({ weight })}
        />
      ),
      [STEP_KEYS.NUTRITION]: (
        <NutritionStep
          calorieGoal={profileData.calorieGoal}
          proteinGoal={profileData.proteinGoal}
          carbGoal={profileData.carbGoal}
          fatGoal={profileData.fatGoal}
          updateCalorieGoal={(goal) => updateProfileData({ calorieGoal: goal })}
          updateProteinGoal={(goal) => updateProfileData({ proteinGoal: goal })}
          updateCarbGoal={(goal) => updateProfileData({ carbGoal: goal })}
          updateFatGoal={(goal) => updateProfileData({ fatGoal: goal })}
        />
      ),
    }),
    [
      profileData,
      updateProfileData,
      handleHeightUpdate,
      setShowDatePicker,
      pickImage,
      formatDate,
    ]
  );

  // Render current step with memoization
  const renderCurrentStep = useCallback(() => {
    return (
      stepComponents[currentStep as keyof typeof stepComponents] ||
      stepComponents[STEP_KEYS.BASIC_INFO]
    );
  }, [currentStep, stepComponents]);

  // Check if current step needs full height (height/weight steps)
  const needsFullHeight = useMemo(
    () => currentStep === STEP_KEYS.HEIGHT || currentStep === STEP_KEYS.WEIGHT,
    [currentStep]
  );

  const stepUsesDropdown = useMemo(
    () => currentStep === STEP_KEYS.BASIC_INFO,
    [currentStep]
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} />

          {needsFullHeight ? (
            // Full height layout for height/weight steps with optimized rendering
            <View className="flex-1 px-6">
              <View className="flex-1 pt-6">{renderCurrentStep()}</View>
            </View>
          ) : stepUsesDropdown ? (
            // Use View for dropdown step to avoid VirtualizedList warning
            <View className="flex-1 px-6">
              <View className="pt-6">{renderCurrentStep()}</View>
            </View>
          ) : (
            <ScrollView
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
              // Performance optimizations
              removeClippedSubviews={true}
              scrollEventThrottle={16}
            >
              {/* Step Content */}
              <View className="pt-6">{renderCurrentStep()}</View>
            </ScrollView>
          )}

          {/* Navigation Buttons */}
          <StepNavigation
            currentStep={currentStep}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            handleCompleteProfile={handleCompleteProfile}
            isCurrentStepValid={isCurrentStepValid as () => boolean}
            isLoading={isLoading}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DatePickerModal
          value={profileData.dateOfBirth}
          onChange={handleDateChange}
          onClose={() => setShowDatePicker(false)}
          visible={showDatePicker}
        />
      )}
    </SafeAreaView>
  );
}

export const options = {
  headerShown: false,
};
