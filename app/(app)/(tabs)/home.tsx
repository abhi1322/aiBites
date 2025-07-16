import { AppText } from "@/app/components/AppText";
import CalendarStripComponent from "@/app/components/CalendarStripComponent";
import CircularNutritionSummary from "@/app/components/CircularNutritionSummary";
import FoodItemsCard from "@/app/components/FoodItemsCard";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { useQuery } from "convex/react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import moment from "moment";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../convex/_generated/api"; // Adjust the path as needed

export default function HomeScreen() {
  const { selectedDate } = useLocalSearchParams<{ selectedDate?: string }>();
  const [date, setDate] = useState<Date>(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("API URL:", process.env.EXPO_PUBLIC_VISION_API_URL);
    console.log(
      "Full URL:",
      `${process.env.EXPO_PUBLIC_VISION_API_URL}/health`
    );

    axios
      .get(`${process.env.EXPO_PUBLIC_VISION_API_URL}/health`)
      .then((response) => {
        console.log(response.data.status); // 👉 "healthy"
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  const handleDateChange = (date: moment.Moment) => {
    setDate(date.toDate());
  };

  const handleNotificationSettings = () => {
    router.push("/(app)/settings/notifications");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Reset the selected date to current date
      setDate(moment().toDate());

      // Add a small delay to show the refresh indicator
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Force a complete page reload by refreshing all data
      console.log("Refreshing entire page...");

      // The Convex queries will automatically refresh and reload all data
      // This includes user data, nutrition data, and food items
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // check the user data from the database

  // Only call the query if the user is loaded and has an id
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // NEW: Check if profile is complete
  const isProfileComplete = useQuery(
    api.users.isProfileComplete,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!user) return <Redirect href="/sign-in" />;

  // If profile is not complete, redirect to profile setup
  if (isProfileComplete === false) {
    return <Redirect href="/profile-setup" />;
  }

  // Show loading state while userData is loading
  if (userData === undefined) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 w-full h-full items-center justify-center bg-white">
          <LottieView
            source={require("@/assets/lottie/user_loading.json")}
            autoPlay
            loop
            style={{ width: 500, height: 500, transform: [{ scale: 4 }] }}
            webStyle={{
              width: 500,
              height: 500,
            }}
          />

          <AppText
            tweight="regular"
            className="text-center text-neutral-400 mt-4"
          >
            Loading your data...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  const clerkID = userData?.clerkId;

  // console.log("clerkID", clerkID);
  // console.log("userData", userData);
  // console.log("user?.id", user?.id);

  // for testing the loading screen

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CalendarStripComponent
        selectedDate={moment(date)}
        onDateChange={handleDateChange}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4"
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#171717"]} // Indigo color for Android
            tintColor="#d9d9d9" // Color for iOS
          />
        }
      >
        {/* semi bold text */}
        <AppText
          tweight="semibold"
          className="text-2xl font-bold text-neutral-800 text-center mb-1"
        >
          Welcome, {userData?.firstName}!
        </AppText>
        <AppText className="text-sm text-gray-500 text-center">
          Let&apos;s track your meals and hit your goals.
        </AppText>

        {/* Notification Status
        <NotificationStatus onPressSettings={handleNotificationSettings} /> */}

        {/* Food Items for Selected Date */}
        {clerkID && (
          <View className="mb-10">
            <CircularNutritionSummary
              userId={clerkID}
              selectedDate={moment(date)}
              userGoals={{
                calorieGoal: userData?.calorieGoal,
                proteinGoal: userData?.proteinGoal,
                carbGoal: userData?.carbGoal,
                fatGoal: userData?.fatGoal,
              }}
            />
            <FoodItemsCard userId={clerkID} selectedDate={moment(date)} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
