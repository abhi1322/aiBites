// BMI Calculator utility functions for React Native Expo app

export interface BMIResult {
  bmi: number;
  category: string;
  description: string;
}

export interface BMIInput {
  weight: number; // in kg
  height: number; // in cm
}

/**
 * Calculate BMI from weight (kg) and height (cm)
 * @param weight - Weight in kilograms
 * @param height - Height in centimeters
 * @returns BMI result object with value, category, and description
 */
export const calculateBMI = (weight: number, height: number): BMIResult => {
  // Input validation
  if (weight <= 0 || height <= 0) {
    throw new Error("Weight and height must be positive numbers");
  }

  // Convert height from cm to meters
  const heightInMeters = height / 100;

  // Calculate BMI: weight (kg) / height (m)²
  const bmi = weight / (heightInMeters * heightInMeters);

  // Round to 1 decimal place
  const roundedBMI = Math.round(bmi * 10) / 10;

  return {
    bmi: roundedBMI,
    category: getBMICategory(roundedBMI),
    description: getBMIDescription(roundedBMI),
  };
};

/**
 * Get BMI category based on WHO classification
 * @param bmi - BMI value
 * @returns BMI category string
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 18.5 && bmi < 25) {
    return "Normal weight";
  } else if (bmi >= 25 && bmi < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
};

/**
 * Get detailed BMI description
 * @param bmi - BMI value
 * @returns Detailed description string
 */
export const getBMIDescription = (bmi: number): string => {
  if (bmi < 18.5) {
    return "Below normal weight range";
  } else if (bmi >= 18.5 && bmi < 25) {
    return "Healthy weight range";
  } else if (bmi >= 25 && bmi < 30) {
    return "Above normal weight range";
  } else {
    return "Significantly above normal weight range";
  }
};

/**
 * Validate BMI input values
 * @param input - BMI input object
 * @returns boolean indicating if input is valid
 */
export const validateBMIInput = (input: BMIInput): boolean => {
  const { weight, height } = input;

  // Check if values are numbers and positive
  if (typeof weight !== "number" || typeof height !== "number") {
    return false;
  }

  if (weight <= 0 || height <= 0) {
    return false;
  }

  // Reasonable ranges (optional validation)
  // Weight: 10-500 kg, Height: 50-300 cm
  if (weight < 10 || weight > 500 || height < 50 || height > 300) {
    return false;
  }

  return true;
};

/**
 * Calculate BMI with input validation
 * @param input - BMI input object
 * @returns BMI result or null if invalid input
 */
export const calculateBMISafe = (input: BMIInput): BMIResult | null => {
  if (!validateBMIInput(input)) {
    return null;
  }

  try {
    return calculateBMI(input.weight, input.height);
  } catch (error) {
    return null;
  }
};

export function estimateNutrition({
  gender,
  age,
  height, // in cm
  weight, // in kg
}: {
  gender: "male" | "female";
  age: number;
  height: number;
  weight: number;
}) {
  // Harris-Benedict BMR formula
  const bmr =
    gender === "male"
      ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
      : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;

  // Sedentary multiplier
  const calories = Math.round(bmr * 1.2);

  // Macros: 20% protein, 50% carbs, 30% fat
  const protein = Math.round((calories * 0.2) / 4); // 4 kcal/g
  const carbs = Math.round((calories * 0.5) / 4);
  const fats = Math.round((calories * 0.3) / 9); // 9 kcal/g

  return {
    calories,
    protein,
    carbs,
    fats,
  };
}
