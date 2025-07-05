import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  // This disables the swipe back gesture and the hardware back button
  gestureEnabled: false,
  headerBackVisible: false,
};

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const food = useQuery(
    api.food.getFoodItemById,
    id ? { id: id as Id<"foodItems"> } : "skip"
  );
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerBackVisible: false,
    });
  }, [navigation]);

  if (!id) {
    return (
      <View style={styles.centered}>
        <Text>No food ID provided.</Text>
      </View>
    );
  }

  if (food === undefined) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!food) {
    return (
      <View style={styles.centered}>
        <Text>Food not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back to Home Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{food.name}</Text>
        {food.imageUrl && (
          <Image
            source={{ uri: food.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        {food.compressedImageUrl && (
          <Image
            source={{ uri: food.compressedImageUrl }}
            style={styles.compressedImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calories</Text>
          <Text style={styles.value}>
            {food.calories.total} {food.calories.unit}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          <Text>Protein: {food.protein}g</Text>
          <Text>Carbs: {food.carbs}g</Text>
          <Text>Fats: {food.fat}g</Text>
          {food.fiber !== undefined && <Text>Fiber: {food.fiber}g</Text>}
        </View>
        {food.items && food.items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items</Text>
            {food.items.map((item: any, idx: number) => (
              <Text key={idx}>
                {item.name} - {item.quantity}
              </Text>
            ))}
          </View>
        )}
        <View style={styles.section}>
          <Text>Serving Size: {food.servingSize}</Text>
          {food.barcode && <Text>Barcode: {food.barcode}</Text>}
          <Text>Created By: {food.createdById || food.createdBy}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: "center" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  image: { width: 320, height: 200, borderRadius: 12, marginBottom: 12 },
  compressedImage: {
    width: 160,
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
    opacity: 0.7,
  },
  section: { marginVertical: 10, width: "100%" },
  sectionTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 4 },
  value: { fontSize: 16, marginBottom: 2 },
});
