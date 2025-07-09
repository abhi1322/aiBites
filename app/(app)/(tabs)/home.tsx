import CalendarStripComponent from "@/app/components/CalendarStripComponent";
import CircularNutritionSummary from "@/app/components/CircularNutritionSummary";
import FoodItemsCard from "@/app/components/FoodItemsCard";
import NotificationStatus from "@/app/components/NotificationStatus";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { useQuery } from "convex/react";
import { Redirect, useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../convex/_generated/api"; // Adjust the path as needed

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(moment());
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

  const handleDateChange = (date: moment.Moment) => {
    setSelectedDate(date);
  };

  const handleNotificationSettings = () => {
    router.push("/(app)/settings/notifications");
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

  const clerkID = userData?.clerkId;

  console.log("clerkID", clerkID);
  console.log("userData", userData);
  console.log("user?.id", user?.id);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CalendarStripComponent
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      <ScrollView className="flex-1 px-4">
        <Text className="text-2xl font-bold">
          Welcome, {userData?.firstName}
        </Text>

        {/* Notification Status */}
        <NotificationStatus onPressSettings={handleNotificationSettings} />

        {/* Food Items for Selected Date */}
        {clerkID && (
          <View>
            <CircularNutritionSummary
              userId={clerkID}
              selectedDate={selectedDate}
              userGoals={{
                calorieGoal: userData?.calorieGoal,
                proteinGoal: userData?.proteinGoal,
                carbGoal: userData?.carbGoal,
                fatGoal: userData?.fatGoal,
              }}
            />
            <FoodItemsCard userId={clerkID} selectedDate={selectedDate} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
