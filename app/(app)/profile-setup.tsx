import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../convex/_generated/api";

export default function ProfileSetupScreen() {
  const { isSignedIn, user } = useUser();
  const { isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  // Check current user status in Convex
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  console.log("Current user in Convex:", currentUser);
  console.log("Profile completed status:", currentUser?.profileCompleted);

  // Profile form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [height, setHeight] = useState(""); // cm
  const [weight, setWeight] = useState(""); // kg
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [calorieGoal, setCalorieGoal] = useState("");
  const [proteinGoal, setProteinGoal] = useState("");
  const [carbGoal, setCarbGoal] = useState("");
  const [fatGoal, setFatGoal] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bio, setBio] = useState("");

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  const handleCompleteProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "First name and last name are required");
      return;
    }

    if (!height.trim() || !weight.trim() || !calorieGoal.trim()) {
      Alert.alert("Error", "Height, weight, and calorie goal are required");
      return;
    }

    if (!gender) {
      Alert.alert("Error", "Please select your gender");
      return;
    }

    setIsLoading(true);

    try {
      // Update user profile in Clerk
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Create or update user in Convex
      const result = await createOrUpdateUser({
        clerkId: user?.id!,
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        height: Number(height),
        weight: Number(weight),
        gender: gender || undefined,
        calorieGoal: Number(calorieGoal),
        proteinGoal: proteinGoal ? Number(proteinGoal) : undefined,
        carbGoal: carbGoal ? Number(carbGoal) : undefined,
        fatGoal: fatGoal ? Number(fatGoal) : undefined,
        profileCompleted: true,
      });

      console.log("Profile completion result:", result);

      // Redirect to main app after successful profile completion
      router.replace("/(app)/(tabs)/" as any);
    } catch (error) {
      console.error("Profile completion error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="pt-6 pb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </Text>
          <Text className="text-gray-600 text-lg">
            Tell us a bit about yourself to personalize your experience
          </Text>
        </View>

        {/* Profile Form */}
        <View className="space-y-6">
          {/* First Name */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">
              First Name *
            </Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              autoCapitalize="words"
            />
          </View>

          {/* Last Name */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">
              Last Name *
            </Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              autoCapitalize="words"
            />
          </View>

          {/* Height */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">
              Height (cm) *
            </Text>
            <TextInput
              value={height}
              onChangeText={setHeight}
              placeholder="Enter your height in cm"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              keyboardType="numeric"
            />
          </View>

          {/* Weight */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">
              Weight (kg) *
            </Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter your weight in kg"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              keyboardType="numeric"
            />
          </View>

          {/* Gender */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Gender *</Text>
            <View className="flex-row space-x-4">
              {["male", "female", "other"].map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g as "male" | "female" | "other")}
                  className={`px-4 py-2 rounded-lg border ${gender === g ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}
                >
                  <Text
                    className={gender === g ? "text-white" : "text-gray-700"}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Calorie Goal */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">
              Daily Calorie Goal *
            </Text>
            <TextInput
              value={calorieGoal}
              onChangeText={setCalorieGoal}
              placeholder="e.g. 2000"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              keyboardType="numeric"
            />
          </View>

          {/* Protein Goal */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">
              Protein Goal (g)
            </Text>
            <TextInput
              value={proteinGoal}
              onChangeText={setProteinGoal}
              placeholder="e.g. 150"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              keyboardType="numeric"
            />
          </View>

          {/* Carb Goal */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">
              Carb Goal (g)
            </Text>
            <TextInput
              value={carbGoal}
              onChangeText={setCarbGoal}
              placeholder="e.g. 250"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              keyboardType="numeric"
            />
          </View>

          {/* Fat Goal */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">
              Fat Goal (g)
            </Text>
            <TextInput
              value={fatGoal}
              onChangeText={setFatGoal}
              placeholder="e.g. 70"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              keyboardType="numeric"
            />
          </View>

          {/* Phone Number */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">
              Phone Number
            </Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              keyboardType="phone-pad"
            />
          </View>

          {/* Date of Birth */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">
              Date of Birth
            </Text>
            <TextInput
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="MM/DD/YYYY"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              keyboardType="numeric"
            />
          </View>

          {/* Bio */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="pt-8 pb-6 space-y-4">
          {/* Complete Profile Button */}
          <TouchableOpacity
            onPress={handleCompleteProfile}
            disabled={isLoading}
            className={`rounded-lg py-4 px-6 ${
              isLoading ? "bg-gray-400" : "bg-blue-500"
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? "Updating..." : "Complete Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
