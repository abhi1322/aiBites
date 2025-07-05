import { api } from "@/convex/_generated/api";
import {
  debugCloudinaryConfig,
  getCloudinaryImageUrls,
  uploadToCloudinary,
} from "@/utils/cloudinary";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { useMutation } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFoodAnalysis } from "../hooks/useFoodAnalysis";
import { convertVisionResponseToFoodItem } from "../utils/foodAnalysisUtils";

export default function ImagePreviewScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const createFoodItemMutation = useMutation(api.food.createFoodItem);
  const addFoodToDailyLogMutation = useMutation(api.food.addFoodToDailyLog);
  const [isLoading, setIsLoading] = useState(false);

  console.log("Vision model", process.env.EXPO_PUBLIC_VISION_API_URL);
  // Food analysis hook
  const { analyzeImage, isLoading: isAnalyzing } = useFoodAnalysis();

  // Debug configuration on component mount
  useEffect(() => {
    debugCloudinaryConfig();
  }, []);

  // Temporary test functions for debugging
  // const handleTestApi = async () => {
  //   console.log("🧪 Testing API connection...");
  //   const result = await runApiTests();
  //   console.log("Test result:", result);
  // };

  // const handleNetworkTest = async () => {
  //   console.log("🌐 Running comprehensive network test...");
  //   const results = await testNetworkConnectivity();
  //   console.log("Network test results:", results);

  //   const successCount = results.filter((r) => r.success).length;
  //   Alert.alert(
  //     "Network Test Results",
  //     `${successCount}/${results.length} tests passed\n\nCheck console for details.`,
  //     [{ text: "OK" }]
  //   );
  // };

  // const handleConfigTest = async () => {
  //   console.log("🔧 Testing different network configurations...");
  //   await testNetworkConfigurations();
  // };

  // const handleServerStatus = async () => {
  //   console.log("🔍 Checking API server status...");
  //   await checkApiServerStatus();
  // };

  async function handleNext() {
    try {
      setIsLoading(true);
      console.log("Starting upload process...");
      console.log("Image URI:", uri);

      // 1. Upload image to Cloudinary and get public_id
      const publicId = await uploadToCloudinary(uri as string);
      console.log("Received publicId:", publicId);

      if (!publicId) {
        throw new Error("No public_id received from Cloudinary");
      }

      // 2. Generate URLs using the public_id
      const { originalUrl, compressedUrl } = getCloudinaryImageUrls(publicId);
      console.log("Generated URLs:");
      console.log("originalUrl:", originalUrl);
      console.log("compressedUrl:", compressedUrl);

      // // 3. Analyze food image using AI
      // console.log("Analyzing food image...");
      // const analysisResult = await analyzeImage(originalUrl);

      // if (!analysisResult) {
      //   throw new Error("Failed to analyze food image. Please try again.");
      // }

      // // 4. Convert analysis result to food data with user info
      // const foodData = convertAnalysisToFoodData(analysisResult);

      const visionResult = await axios
        .post(`${process.env.EXPO_PUBLIC_VISION_API_URL}/analyze-food`, {
          image_url: originalUrl,
        })
        .then((res) => res.data)
        .catch((err) => {
          console.error("Error in vision result:", err);
          return null;
        });
      console.log("Vision result:", visionResult);
      if (!visionResult) {
        Alert.alert(
          "Upload Error",
          "Failed to analyze food image. Please try again.",
          [{ text: "OK" }]
        );
        return;
      }
      // 5. Convert vision response to food item format
      console.log("User ID from Clerk:", user?.id);
      const foodItemData = convertVisionResponseToFoodItem(
        visionResult,
        originalUrl,
        compressedUrl,
        user?.id || "unknown-user",
        false // Not custom, from vision analysis
      );

      // 6. Create food item in backend with user data
      console.log("Creating food item with data:", foodItemData);
      const foodItem = await createFoodItemMutation(foodItemData);
      console.log("Created foodItem:", foodItem);

      // 7. Add food item to today's daily log
      console.log("Adding to daily log...");
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      console.log("Today's date:", today);
      const dailyLogData = {
        userId: user?.id || "unknown-user",
        date: today,
        foodItemId: foodItem,
        quantity: 1, // Default to 1 serving
        mealType: "lunch" as const, // Default meal type, could be made configurable
        notes: "Added via food analysis",
      };
      console.log("Daily log data:", dailyLogData);
      await addFoodToDailyLogMutation(dailyLogData);
      console.log("Added to daily log");

      // 8. Navigate to dynamic food detail page
      router.push({
        pathname: "/food/[id]",
        params: { id: foodItem.toString() },
      });
    } catch (error) {
      console.error("Error in handleNext:", error);
      Alert.alert(
        "Upload Error",
        `Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`,
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: screenWidth, height: screenHeight }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ color: "white" }}>No image to preview</Text>
      )}

      {/* Debug Test Buttons (Temporary for debugging) */}
      {/* <View style={styles.debugButtons}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={handleTestApi}
          disabled={isLoading || isAnalyzing}
        >
          <Text style={styles.buttonText}>Test API</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.testButton}
          onPress={handleNetworkTest}
          disabled={isLoading || isAnalyzing}
        >
          <Text style={styles.buttonText}>Network</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.testButton}
          onPress={handleConfigTest}
          disabled={isLoading || isAnalyzing}
        >
          <Text style={styles.buttonText}>Config</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.testButton}
          onPress={handleServerStatus}
          disabled={isLoading || isAnalyzing}
        >
          <Text style={styles.buttonText}>Status</Text>
        </TouchableOpacity>
      </View> */}

      {/* Retake Button */}
      <TouchableOpacity
        style={styles.retakeButton}
        onPress={() => router.replace("../(tabs)/camera")}
        disabled={isLoading || isAnalyzing}
      >
        <Text style={styles.buttonText}>Retake</Text>
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          (isLoading || isAnalyzing) && styles.disabledButton,
        ]}
        onPress={handleNext}
        disabled={isLoading || isAnalyzing}
      >
        <Text style={styles.buttonText}>
          {isLoading || isAnalyzing
            ? isAnalyzing
              ? "Analyzing..."
              : "Uploading..."
            : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  debugButtons: {
    position: "absolute",
    top: 100,
    flexDirection: "row",
    gap: 10,
    zIndex: 20,
  },
  testButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  retakeButton: {
    position: "absolute",
    bottom: 40,
    left: 40,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    zIndex: 20,
  },
  nextButton: {
    position: "absolute",
    bottom: 40,
    right: 40,
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    zIndex: 20,
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
