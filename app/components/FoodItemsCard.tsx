import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import moment from "moment";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "./AppText";

import Calorie from "@/assets/icons/calories.svg";
import Carbs from "@/assets/icons/carbs.svg";
import Fat from "@/assets/icons/fat-icon.svg";
import Protein from "@/assets/icons/protein.svg";
import { Clock } from "lucide-react-native";

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
      <View className="bg-white relative w-[80vw] mx-auto mt-4">
        <AppText className="text-lg font-semibold mb-3 text-center text-neutral-700">
          Food Logged for{" "}
          {selectedDate.isSame(new Date(), "day")
            ? "Today"
            : selectedDate.format("MMM DD, YYYY")}
        </AppText>
        <View className="flex-1 justify-center items-center py-8">
          <AppText className="text-gray-500 text-center">
            Loading food items...
          </AppText>
        </View>
      </View>
    );
  }

  if (foodItems.length === 0) {
    const lottieSource = selectedDate.isSame(new Date(), "day")
      ? require("@/assets/lottie/Empty-box.json")
      : require("@/assets/lottie/no-data.json");

    return (
      <View className="min-h-96 flex-col items-center  rounded-lg p-4 mt-4">
        <AppText className="text-lg font-semibold mb-3 text-center text-neutral-700">
          Food Logged for{" "}
          {selectedDate.isSame(new Date(), "day")
            ? "Today"
            : selectedDate.format("MMM DD, YYYY")}
        </AppText>
        <LottieView
          source={lottieSource}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <AppText className="text-gray-400 text-center text-sm w-[70vw]">
          {selectedDate.isSame(new Date(), "day")
            ? "No food items logged for today, Add Now to keep track of your calories and macros"
            : `No food items logged for ${selectedDate.format("MMM DD, YYYY")}`}
        </AppText>
      </View>
    );
  }

  return (
    <View className="mt-8">
      <AppText className="text-lg font-semibold mb-3 text-center text-neutral-700">
        Food Logged for{" "}
        {selectedDate.isSame(new Date(), "day")
          ? "Today"
          : selectedDate.format("MMM DD, YYYY")}
      </AppText>

      <View className="gap-4">
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
      <View className="bg-gray-100 rounded-2xl border border-[#EBEBEB] p-2">
        <AppText className="text-gray-500">Loading food details...</AppText>
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
      className="bg-white rounded-2xl border border-[#EBEBEB] p-2"
      onPress={handlePress}
      style={styles.shadow}
    >
      <View className="flex-row items-start gap-4">
        {/* Food Image */}
        {foodItem.compressedImageUrl && (
          <Image
            source={{ uri: foodItem.compressedImageUrl }}
            className="w-28 h-28 rounded-xl "
            resizeMode="cover"
          />
        )}

        {/* Food Details */}
        <View className="flex-1 items-start">
          <View className="w-full flex-row justify-between">
            <View className="flex-1">
              <AppText
                tweight="medium"
                className="font-medium text-neutral-700 capitalize text-lg"
                numberOfLines={1}
              >
                {foodItem.name}
              </AppText>
              <AppText className="text-sm text-neutral-500 capitalize">
                Serving Size: {foodItem.servingSize}
              </AppText>
            </View>

            {/* add time to the food item */}
            <View className="rounded-full justify-center h-6 bg-neutral-200 p-1 flex-row items-center mt-1">
              <Clock size={16} color="#737373" strokeWidth={1.5} />
              <AppText className="text-xs text-neutral-500 capitalize">
                {"  "}
                {moment(foodItem.createdAt).format("h:mm A")}
              </AppText>
            </View>
          </View>

          {/* Nutrition Info */}
          {/* in grid  */}
          <View className="flex-row gap-8 mt-2">
            <View className="flex-col gap-2">
              <View className="flex-row items-center gap-2 justify-start">
                <Calorie />
                <AppText className="text-xs text-gray-600">
                  {foodItem.calories?.total || 0} kcal
                </AppText>
              </View>
              <View className="flex-row items-center gap-2 justify-start">
                <Protein />
                <AppText className="text-xs text-gray-600">
                  P: {foodItem.protein || 0}g
                </AppText>
              </View>
            </View>
            <View className="flex-col gap-2">
              <View className="flex-row items-center gap-2 justify-start">
                <Carbs />
                <AppText className="text-xs text-gray-600">
                  C: {foodItem.carbs || 0}g
                </AppText>
              </View>
              <View className="flex-row items-center gap-2 justify-start">
                <Fat />
                <AppText className="text-xs text-gray-600">
                  {"  "}
                  F: {foodItem.fat || 0}g
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// make a style for shadow class
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
});
