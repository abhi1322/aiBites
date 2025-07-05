import { FoodAnalysisResponse, FoodItem } from "../services/foodAnalysisApi";

/**
 * Converts API response to food data format for database storage
 */
export const convertAnalysisToFoodData = (analysis: FoodAnalysisResponse) => {
  // Extract numeric values from macronutrients (remove 'g' suffix)
  const extractNumericValue = (value: string): number => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const protein = extractNumericValue(analysis.macronutrients.protein);
  const carbs = extractNumericValue(analysis.macronutrients.carbs);
  const fats = extractNumericValue(analysis.macronutrients.fats);
  const fiber = extractNumericValue(analysis.macronutrients.fiber);

  // Create items array for database
  const items = analysis.items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
  }));

  return {
    name: analysis.items.length > 0 ? analysis.items[0].name : "Analyzed Food",
    calories: analysis.calories.total,
    protein,
    carbs,
    fat: fats,
    fiber,
    servingSize:
      analysis.items.length > 0 ? analysis.items[0].quantity : "1 serving",
    isCustom: true,
    items,
  };
};

/**
 * Creates a display name from the analyzed food items
 */
export const createDisplayName = (items: FoodItem[]): string => {
  if (items.length === 0) return "Analyzed Food";
  if (items.length === 1) return items[0].name;

  const names = items.map((item) => item.name);
  return names.slice(0, 2).join(" + ") + (names.length > 2 ? " & more" : "");
};

/**
 * Formats nutrition information for display
 */
export const formatNutritionInfo = (analysis: FoodAnalysisResponse) => {
  return {
    calories: `${analysis.calories.total} ${analysis.calories.unit}`,
    protein: analysis.macronutrients.protein,
    carbs: analysis.macronutrients.carbs,
    fats: analysis.macronutrients.fats,
    fiber: analysis.macronutrients.fiber,
  };
};

// Convert vision model response to Convex food item format
export const convertVisionResponseToFoodItem = (
  visionResponse: FoodAnalysisResponse,
  imageUrl: string,
  compressedImageUrl: string,
  userId: string,
  isCustom: boolean = false
) => {
  // Helper function to safely parse numeric values
  const parseNumericValue = (value: string): number => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  return {
    name: visionResponse.items?.[0]?.name || "Analyzed Food",
    calories: {
      total: Math.round(visionResponse.calories.total), // Ensure integer as per model format
      unit: visionResponse.calories.unit,
    },
    macronutrients: {
      protein: visionResponse.macronutrients.protein,
      carbs: visionResponse.macronutrients.carbs,
      fats: visionResponse.macronutrients.fats,
      fiber: visionResponse.macronutrients.fiber,
    },
    // Extract numeric values from macronutrients for calculations
    protein: parseNumericValue(visionResponse.macronutrients.protein),
    carbs: parseNumericValue(visionResponse.macronutrients.carbs),
    fat: parseNumericValue(visionResponse.macronutrients.fats),
    fiber: parseNumericValue(visionResponse.macronutrients.fiber),
    items: visionResponse.items,
    servingSize: visionResponse.items?.[0]?.quantity || "1 serving",
    imageUrl,
    compressedImageUrl,
    isCustom,
    createdBy: userId,
    createdById: userId,
  };
};
