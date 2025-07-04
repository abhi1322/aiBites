import { api } from "@/convex/_generated/api";
import {
  debugCloudinaryConfig,
  getCloudinaryImageUrls,
  uploadToCloudinary,
} from "@/utils/cloudinary";
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

export default function ImagePreviewScreen() {
  const router = useRouter();
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const createFoodItemMutation = useMutation(api.food.createFoodItem);
  const [isLoading, setIsLoading] = useState(false);

  // Debug configuration on component mount
  useEffect(() => {
    debugCloudinaryConfig();
  }, []);

  // Example food data for demonstration
  const foodData = {
    name: "Tandoori chicken",
    calories: 600,
    protein: 37,
    carbs: 12,
    fat: 33,
    fiber: 0.5,
    servingSize: "two pieces",
    isCustom: true,
    createdById: "demo-user-id", // TODO: Replace with real user id
    items: [{ name: "Tandoori chicken", quantity: "two pieces" }],
  };

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

      // 3. Create food item in backend
      console.log("Creating food item...");
      const foodItem = await createFoodItemMutation({
        ...foodData,
        imageUrl: originalUrl,
        compressedImageUrl: compressedUrl,
      });
      console.log("Created foodItem:", foodItem);

      // 4. Navigate to dynamic food detail page
      router.push({
        pathname: "/food/[id]",
        params: { id: foodItem.toString() },
      });
    } catch (error) {
      console.error("Error in handleNext:", error);
      Alert.alert(
        "Upload Error",
        `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`,
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

      {/* Retake Button */}
      <TouchableOpacity
        style={styles.retakeButton}
        onPress={() => router.replace("../(tabs)/camera")}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Retake</Text>
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, isLoading && styles.disabledButton]}
        onPress={handleNext}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Uploading..." : "Next"}
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
    fontSize: 18,
    fontWeight: "bold",
  },
});
