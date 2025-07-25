import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { validatePositiveNumber } from "../../utils/validator";
import { AppText } from "../AppText";
import { Input } from "../ui/Input";
import { estimateNutrition } from "./bmiCalculator";

interface NutritionStepProps {
  calorieGoal: string;
  proteinGoal: string;
  carbGoal: string;
  fatGoal: string;
  updateCalorieGoal: (goal: string) => void;
  updateProteinGoal: (goal: string) => void;
  updateCarbGoal: (goal: string) => void;
  updateFatGoal: (goal: string) => void;
  gender: "male" | "female";
  age: number;
  height: number; // in cm
  weight: number; // in kg
}

export const NutritionStep: React.FC<NutritionStepProps> = ({
  calorieGoal,
  proteinGoal,
  carbGoal,
  fatGoal,
  updateCalorieGoal,
  updateProteinGoal,
  updateCarbGoal,
  updateFatGoal,
  gender,
  age,
  height,
  weight,
}) => {
  const handleGetEstimation = () => {
    const { calories, protein, carbs, fats } = estimateNutrition({
      gender,
      age,
      height,
      weight,
    });

    console.log("gender", gender);
    console.log("age", age);
    console.log("height", height);
    console.log("weight", weight);

    console.log("calories", calories.toString());
    console.log("protein", protein.toString());
    console.log("carbs", carbs.toString());
    console.log("fats", fats.toString());

    updateCalorieGoal(calories.toString());
    updateProteinGoal(protein.toString());
    updateCarbGoal(carbs.toString());
    updateFatGoal(fats.toString());
  };

  const [calorieError, setCalorieError] = React.useState("");
  const [proteinError, setProteinError] = React.useState("");
  const [carbError, setCarbError] = React.useState("");
  const [fatError, setFatError] = React.useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className=" ">
          <View className="text-center items-center justify-center">
            <AppText
              tweight="semibold"
              className="text-2xl text-neutral-800 mb-1"
            >
              Nutrition Goals
            </AppText>
            <AppText
              tweight="regular"
              className="text-neutral-500 text-sm text-center  w-[80%]"
            >
              Set your daily calorie and macronutrient targets
            </AppText>
          </View>
          <View className="mt-2 py-2 flex flex-col items-center justify-center gap-2">
            <AppText
              tweight="regular"
              className="text-neutral-500 text-sm mt-2 w-[90%] text-center"
            >
              You can get estimation for Nutrition by clicking the button below.
            </AppText>
            {/* linear gradient button */}
            <LinearGradient
              colors={["#404040", "#171717"]}
              className="rounded-full flex items-center justify-center   border-gray-500 px-8 overflow-hidden"
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0.5, y: 0.5 }}
              style={{
                borderRadius: 50,
                width: 120,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#404040",
                display: "flex",
                alignSelf: "center",
              }}
            >
              <TouchableOpacity onPress={handleGetEstimation}>
                <AppText
                  tweight="regular"
                  className="text-white text-sm text-center"
                >
                  Get Estimation
                </AppText>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Calorie Goal */}
          <View className="mt-4">
            <AppText
              tweight="regular"
              className="text-neutral-500 text-sm mt-2 w-[80%]"
            >
              Daily Calorie Goal *
            </AppText>
            <Input
              value={calorieGoal}
              onValueChange={updateCalorieGoal}
              validator={validatePositiveNumber}
              error={calorieError}
              setError={setCalorieError}
              placeholder="e.g. 2000"
              keyboardType="numeric"
              autoCorrect={false}
              spellCheck={false}
            />
          </View>
          {/* Macronutrients */}
          <View className="mt-1">
            <AppText
              tweight="medium"
              className="text-neutral-500 text-lg mt-4 mb-2 w-[80%]"
            >
              Macronutrients
            </AppText>
            <View className="flex-row gap-2 items-center justify-between">
              <View className="flex-1">
                <AppText
                  tweight="regular"
                  className="text-neutral-500 text-sm mb-2"
                >
                  Protein Goal (g)
                </AppText>
                <Input
                  value={proteinGoal}
                  onValueChange={updateProteinGoal}
                  validator={validatePositiveNumber}
                  error={proteinError}
                  setError={setProteinError}
                  placeholder="e.g. 150"
                  keyboardType="numeric"
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>
              <View className="flex-1">
                <AppText
                  tweight="regular"
                  className="text-neutral-500 text-sm mb-2"
                >
                  Carb Goal (g)
                </AppText>
                <Input
                  value={carbGoal}
                  onValueChange={updateCarbGoal}
                  validator={validatePositiveNumber}
                  error={carbError}
                  setError={setCarbError}
                  placeholder="e.g. 250"
                  keyboardType="numeric"
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>
              <View className="flex-1">
                <AppText
                  tweight="regular"
                  className="text-neutral-500 text-sm mb-2"
                >
                  Fat Goal (g)
                </AppText>
                <Input
                  value={fatGoal}
                  onValueChange={updateFatGoal}
                  validator={validatePositiveNumber}
                  error={fatError}
                  setError={setFatError}
                  placeholder="e.g. 70"
                  keyboardType="numeric"
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
