import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Redirect, router } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../convex/_generated/api";
import { CalendarStripComponent } from "../../components/CalendarStripComponent";
import { SignOutButton } from "../../components/SignOutButton";

export default function HomeTab() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [selectedDate, setSelectedDate] = useState(moment());

  // fetch user from convex
  const covex_user = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // console.log("covex_user", covex_user);
  // console.log("profileCompleted:", covex_user?.profileCompleted);
  // console.log("user ID:", user?.id);

  // if profileCompleted is false, redirect to profile-setup
  if (covex_user?.profileCompleted === false) {
    return <Redirect href="/(app)/profile-setup" />;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  const openCamera = () => {
    router.push("/(app)/camera" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-2">
        <CalendarStripComponent
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          markedDates={["2024-06-10", "2024-06-12"]}
        />

        {/* Camera Button */}
        <View className="absolute bottom-20 right-4 z-10">
          <TouchableOpacity
            onPress={openCamera}
            className="bg-blue-500 w-16 h-16 rounded-full justify-center items-center shadow-lg"
          >
            <Ionicons name="camera" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-end">
          <SignOutButton />
        </View>
      </View>
    </SafeAreaView>
  );
}
