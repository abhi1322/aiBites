import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";
import { FoodAnalysisResponse } from "../services/foodAnalysisApi";

interface UseFoodAnalysisReturn {
  isLoading: boolean;
  analysisResult: FoodAnalysisResponse | null;
  error: string | null;
  analyzeImage: (imageUrl: string) => Promise<FoodAnalysisResponse | null>;
  resetAnalysis: () => void;
}

export const useFoodAnalysis = (): UseFoodAnalysisReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<FoodAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = async (
    imageUrl: string
  ): Promise<FoodAnalysisResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);
      setAnalysisResult(null);

      console.log("Starting food analysis for image:", imageUrl);

      const result = await axios
        .post(`${process.env.EXPO_PUBLIC_VISION_API_URL}/analyze-food`, {
          image_url: imageUrl,
        })
        .then((res) => res)
        .catch((err) => {
          console.error("Food analysis failed:", err);
          return null;
        });

      console.log("Food analysis result:", result);

      // const result = await analyzeFoodImage(imageUrl);

      console.log("Food analysis result:", result);

      setAnalysisResult(result?.data || null);
      return result?.data || null;
    } catch (err) {
      console.error("Food analysis failed:", err);

      let errorMessage = "Failed to analyze food image";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);

      // Show user-friendly alert
      Alert.alert("Analysis Failed", errorMessage, [{ text: "OK" }]);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    isLoading,
    analysisResult,
    error,
    analyzeImage,
    resetAnalysis,
  };
};
