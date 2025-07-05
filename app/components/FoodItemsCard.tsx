import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface FoodItemsCardProps {
  userId: string;
  selectedDate: moment.Moment;
}

export default function FoodItemsCard({
  userId,
  selectedDate,
}: FoodItemsCardProps) {
  const dateString = selectedDate.format("YYYY-MM-DD");

  console.log("FoodItemsCard - userId:", userId);
  console.log("FoodItemsCard - dateString:", dateString);

  // Fetch food items for the selected date and user
  const foodItems = useQuery(api.food.getFoodItemsByDateAndCreatedBy, {
    createdBy: userId,
    date: dateString,
  });

  console.log("FoodItemsCard - foodItems:", foodItems);
  console.log("FoodItemsCard - foodItems length:", foodItems?.length);

  if (!foodItems) {
    return (
      <View className="bg-gray-100 rounded-lg p-4 mt-4">
        <Text className="text-gray-500 text-center">Loading food items...</Text>
      </View>
    );
  }

  if (foodItems.length === 0) {
    return (
      <View className="bg-gray-100 rounded-lg p-4 mt-4">
        <Text className="text-gray-500 text-center">
          No food items logged for {selectedDate.format("MMM DD, YYYY")}
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <Text className="text-lg font-semibold mb-3">
        Food Items for {selectedDate.format("MMM DD, YYYY")}
      </Text>

      <View className="space-y-2">
        {foodItems.map((foodItem) => (
          <FoodItemCard key={foodItem._id} foodItem={foodItem} />
        ))}
      </View>
    </View>
  );
}

interface FoodItemCardProps {
  foodItem: any; // Type this properly based on your foodItems structure
}

function FoodItemCard({ foodItem }: FoodItemCardProps) {
  const router = useRouter();

  if (!foodItem) {
    return (
      <View className="bg-gray-100 rounded-lg p-3">
        <Text className="text-gray-500">Loading food details...</Text>
      </View>
    );
  }

  const handlePress = () => {
    router.push({
      pathname: "/food/[id]",
      params: { id: foodItem._id },
    });
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
      onPress={handlePress}
    >
      <View className="flex-row items-center space-x-3">
        {/* Food Image */}
        {foodItem.compressedImageUrl && (
          <Image
            source={{ uri: foodItem.compressedImageUrl }}
            className="w-12 h-12 rounded-lg"
            resizeMode="cover"
          />
        )}

        {/* Food Details */}
        <View className="flex-1">
          <Text className="font-medium text-gray-900" numberOfLines={1}>
            {foodItem.name}
          </Text>
          <Text className="text-sm text-gray-500">
            1 serving • {foodItem.servingSize}
          </Text>

          {/* Nutrition Info */}
          <View className="flex-row mt-1 space-x-3">
            <Text className="text-xs text-gray-600">
              {foodItem.calories?.total || 0} kcal
            </Text>
            <Text className="text-xs text-gray-600">
              P: {foodItem.protein || 0}g
            </Text>
            <Text className="text-xs text-gray-600">
              C: {foodItem.carbs || 0}g
            </Text>
            <Text className="text-xs text-gray-600">
              F: {foodItem.fat || 0}g
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
