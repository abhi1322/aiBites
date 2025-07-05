// Types for food analysis API
export interface FoodAnalysisRequest {
  image_url: string;
}

export interface Calories {
  total: number;
  unit: string;
}

export interface Macronutrients {
  protein: string;
  carbs: string;
  fats: string;
  fiber: string;
}

export interface FoodItem {
  name: string;
  quantity: string;
}

export interface FoodAnalysisResponse {
  calories: Calories;
  macronutrients: Macronutrients;
  items: FoodItem[];
}

export interface FoodAnalysisError {
  error: string;
  message: string;
}

// API configuration using environment variables
const getApiBaseUrl = () => {
  // Check for environment variable first
  const envApiUrl = process.env.EXPO_PUBLIC_VISION_API_URL;

  if (envApiUrl) {
    // Remove /health from the URL if it's included
    const baseUrl = envApiUrl.replace("/health", "");
    console.log("Using environment API URL:", baseUrl);
    return baseUrl;
  }

  // Fallback configuration for development
  if (__DEV__) {
    // Option 1: Use your computer's IP address (recommended for physical devices)
    // return 'http://192.168.1.100:8000'; // Replace with your actual IP

    // Option 2: Use localhost (works only in simulator/emulator)
    return "http://localhost:8000";

    // Option 3: Use Expo tunnel (if you have ngrok or similar)
    // return 'https://your-ngrok-url.ngrok.io';
  }

  // For production
  return "https://your-production-api.com";
};

const API_BASE_URL = getApiBaseUrl();

// Food analysis API service
export class FoodAnalysisApi {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log("Making API request to:", url);

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      // Add timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        ...defaultOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: FoodAnalysisError = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);

      // Provide more specific error messages
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        throw new Error(
          `Cannot connect to API server. Please check:\n` +
            `1. API server is running on ${API_BASE_URL}\n` +
            `2. Network connection is available\n` +
            `3. Environment variable EXPO_PUBLIC_VISION_API_URL is set correctly\n` +
            `4. If using physical device, update IP address in environment or config`
        );
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          `Request timed out after 30 seconds. This could mean:\n` +
            `1. API server is taking too long to respond\n` +
            `2. Image analysis is computationally intensive\n` +
            `3. Server is overloaded\n` +
            `Try again or check server logs.`
        );
      }

      throw error;
    }
  }

  /**
   * Analyzes a food image and returns nutrition information
   * @param imageUrl - The URL of the image to analyze
   * @returns Promise<FoodAnalysisResponse>
   */
  static async analyzeFoodImage(
    imageUrl: string
  ): Promise<FoodAnalysisResponse> {
    const requestBody: FoodAnalysisRequest = {
      image_url: imageUrl,
    };

    console.log("Sending image URL for analysis:", imageUrl);

    return this.makeRequest<FoodAnalysisResponse>("/analyze-food", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  }
}

// Convenience function for easy usage
export const analyzeFoodImage = (
  imageUrl: string
): Promise<FoodAnalysisResponse> => {
  return FoodAnalysisApi.analyzeFoodImage(imageUrl);
};
