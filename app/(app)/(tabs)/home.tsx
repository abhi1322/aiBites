import CalendarStripComponent from "@/app/components/CalendarStripComponent";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { Redirect } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../convex/_generated/api"; // Adjust the path as needed

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(moment());

  const { user } = useUser();

  const handleDateChange = (date: moment.Moment) => {
    setSelectedDate(date);
  };

  // check the user data from the database

  // Only call the query if the user is loaded and has an id
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!user) return <Redirect href="/sign-in" />; // or a loading state

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CalendarStripComponent
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      <View className="flex-1 px-4 mt-8">
        <Text className="text-2xl font-bold">
          Welcome, {userData?.firstName}
        </Text>
        <Text className="text-sm text-gray-500">Today&apos;s Progress</Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-1 bg-gray-200 rounded-lg p-4">
            <Text className="text-sm text-gray-500">Calories</Text>
            <Text className="text-2xl font-bold">{userData?.calorieGoal}</Text>
            <Text className="text-sm text-gray-500">
              Protein goal: {userData?.proteinGoal}g
            </Text>
            <Text className="text-sm text-gray-500">
              Carbs goal: {userData?.carbGoal}g
            </Text>
            <Text className="text-sm text-gray-500">
              Fat goal: {userData?.fatGoal}g
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
