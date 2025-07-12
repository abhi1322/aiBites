import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  View,
} from "react-native";

import CaloriesIcon from "@/assets/icons/calories.svg";
import CarbsIcon from "@/assets/icons/carbs.svg";
import FatIcon from "@/assets/icons/fat-icon.svg";
import ProteinIcon from "@/assets/icons/protein.svg";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { AppText } from "../components/AppText";
import { LightButton } from "../components/ui/Button";

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
  const [imageLoading, setImageLoading] = useState(true);

  // Use useFocusEffect to ensure StatusBar updates when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content", true);
      StatusBar.setBackgroundColor("#000", true);
      StatusBar.setTranslucent(true);

      return () => {
        // Optional: Reset to default when leaving screen
        // StatusBar.setBarStyle("default", true);
      };
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerBackVisible: false,
      // Ensure header doesn't interfere with StatusBar
      headerShown: false,
    });
  }, [navigation]);

  if (!id) {
    return (
      <View className="flex-1 justify-center items-center">
        <AppText>No food ID provided.</AppText>
      </View>
    );
  }

  if (food === undefined) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!food) {
    return (
      <View className="flex-1 justify-center items-center">
        <AppText>Food not found.</AppText>
      </View>
    );
  }

  return (
    <>
      {/* Move StatusBar inside the component and use imperative API */}
      <StatusBar barStyle="dark-content" translucent={true} animated={true} />
      {/* <SafeAreaView className="flex-1 bg-white"> */}
      <ScrollView
        contentContainerStyle={{ padding: 24, alignItems: "center" }}
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      >
        {/* Back to Home Button */}
        <View className="w-16 h-20 absolute top-14 left-8 z-10">
          <LightButton
            onPress={() => router.replace("/home")}
            icon={<Ionicons name="arrow-back" size={20} color={"#C0C0C0"} />}
          />
        </View>

        {/* main image */}
        {food.imageUrl ? (
          <View className="w-[100vw] h-[55vh] -mt-[55px] relative">
            {imageLoading && (
              <View className="absolute inset-0 bg-neutral-100 justify-center items-center z-10">
                <LottieView
                  source={require("@/assets/lottie/image-loading.json")}
                  autoPlay
                  loop
                  style={{ width: 500, height: 500 }}
                />
              </View>
            )}
            <Image
              className="w-full h-full object-cover"
              source={{ uri: food.imageUrl }}
              resizeMode="cover"
              onLoadEnd={() => {
                // add a delay of 1 second
                setTimeout(() => {
                  setImageLoading(false);
                }, 1000);
              }}
            />
          </View>
        ) : (
          <View className="w-[100vw] h-[55vh] -mt-[55px] object-cover bg-neutral-400">
            <LottieView
              source={require("@/assets/lottie/image-loading.json")}
              autoPlay
              loop
              style={{ width: 100, height: 100, alignSelf: "center" }}
            />
          </View>
        )}

        <View className="w-full h-full bg-white">
          {/* created at date and time*/}
          <View className="flex-row items-center gap-2 mt-4">
            <AppText className="text-gray-500 text-sm">Added on</AppText>
            <View className="flex-row items-center gap-2 bg-gray-100 p-2 rounded-full px-4">
              <Ionicons name="time-outline" size={16} color={"#7E7E7E"} />
              <AppText tweight="medium" className="text-[#7E7E7E] text-sm">
                {new Date(food._creationTime).toLocaleDateString()},{" "}
                {new Date(food._creationTime).toLocaleTimeString()}
              </AppText>
            </View>
          </View>

          {/* name */}
          <AppText tweight="semibold" className="text-2xl mt-4 capitalize">
            {food.name}
          </AppText>

          {/* serving size */}
          <View className="flex-row items-center gap-2 mt-2">
            <AppText className="text-gray-500 text-base">
              Serving size :
            </AppText>
            <AppText className="text-gray-500 text-base">
              {food.servingSize}
            </AppText>
          </View>

          {/* grid of 2 columns and two rows for calories and macronutrients */}
          <View className="flex-row items-center mt-6 w-5/6 justify-between">
            <View className="flex-col items-start gap-4">
              <View className="flex-row items-center gap-2">
                <CaloriesIcon />
                <AppText className="text-gray-500 text-base">
                  Calories :
                </AppText>
                <AppText className="text-gray-500 text-base">
                  {food.calories.total} {food.calories.unit}
                </AppText>
              </View>
              <View className="flex-row items-center gap-2">
                <CarbsIcon />
                <AppText className="text-gray-500 text-base">Carbs :</AppText>
                <AppText className="text-gray-500 text-base">
                  {food.carbs}
                </AppText>
              </View>
            </View>
            <View className="flex-col items-start gap-4">
              <View className="flex-row items-center gap-2">
                <ProteinIcon />
                <AppText className="text-gray-500 text-base">Protein :</AppText>
                <AppText className="text-gray-500 text-base">
                  {food.protein}
                </AppText>
              </View>
              <View className="flex-row items-center gap-2">
                <FatIcon />
                <AppText className="text-gray-500 text-base"> Fats :</AppText>
                <AppText className="text-gray-500 text-base">
                  {food.fat}
                </AppText>
              </View>
            </View>
          </View>
          {/* Items */}
          <View className="flex-row items-center mt-2  gap-2">
            {food.items && food.items.length > 0 && (
              <View>
                <AppText
                  tweight="medium"
                  className="text-xl mt-4 capitalize text-neutral-700"
                >
                  Items
                </AppText>
                <View className="flex-row items-center gap-2 mt-2 flex-wrap">
                  {food.items.map((item: any, idx: number) => (
                    <View
                      key={idx}
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.25,
                        shadowRadius: 20,
                        elevation: 2,
                      }}
                    >
                      <LinearGradient
                        colors={["#202020", "#121212"]}
                        start={{ x: 0.32, y: 0.03 }}
                        end={{ x: 0.68, y: 0.97 }}
                        style={{
                          borderRadius: 200,
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          borderWidth: 1,
                          borderColor: "#3B3B3B",
                        }}
                      >
                        <AppText className="text-white text-sm">
                          {item.name} - {item.quantity}
                        </AppText>
                      </LinearGradient>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
