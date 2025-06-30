import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../convex/_generated/api";

export default function ProfileScreen() {
  const { user } = useUser();
  const router = useRouter();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!user) return null;
  if (userData === undefined) return <Text>Loading...</Text>;
  if (userData === null) return <Text>No user data found.</Text>;

  return (
    <ScrollView className="flex-1 bg-white px-4 py-8">
      <View className="items-center mb-6">
        {userData.profileImage ? (
          <View className="w-24 h-24 rounded-full bg-gray-200 mb-2 overflow-hidden">
            <img
              src={userData.profileImage}
              alt="Profile"
              style={{ width: 96, height: 96, borderRadius: 48 }}
            />
          </View>
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-200 mb-2 items-center justify-center">
            <Text className="text-gray-500 text-sm">No Photo</Text>
          </View>
        )}
        <Text className="text-2xl font-bold mb-1">
          {userData.firstName} {userData.lastName}
        </Text>
        <Text className="text-gray-500 mb-2">{userData.email}</Text>
        <View className="flex-row space-x-4 mt-2">
          <TouchableOpacity
            className="px-4 py-2 bg-blue-600 rounded-lg"
            onPress={() => router.push("/(app)/profile-setup")}
          >
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onPress={() => router.push("/(app)/camera")}
          >
            <Text className="text-gray-700 font-semibold">Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="bg-gray-100 rounded-lg p-4 mb-4">
        <Text className="text-lg font-semibold mb-2">Personal Info</Text>
        <Text>Gender: {userData.gender}</Text>
        <Text>
          Date of Birth:{" "}
          {userData.dateOfBirth
            ? new Date(userData.dateOfBirth).toLocaleDateString()
            : "-"}
        </Text>
        <Text>Height: {userData.height ? `${userData.height} cm` : "-"}</Text>
        <Text>Weight: {userData.weight ? `${userData.weight} kg` : "-"}</Text>
      </View>
      <View className="bg-gray-100 rounded-lg p-4 mb-4">
        <Text className="text-lg font-semibold mb-2">Nutrition Goals</Text>
        <Text>Calories: {userData.calorieGoal}</Text>
        <Text>Protein: {userData.proteinGoal}g</Text>
        <Text>Carbs: {userData.carbGoal}g</Text>
        <Text>Fat: {userData.fatGoal}g</Text>
      </View>
      <TouchableOpacity onPress={() => router.replace("/(app)/(tabs)/home")}>
        <ArrowLeft size={28} color="#000" />
      </TouchableOpacity>
    </ScrollView>
  );
}
