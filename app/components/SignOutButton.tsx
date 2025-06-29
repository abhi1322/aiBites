import { useClerk } from "@clerk/clerk-expo";
import { Alert, Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (err) {
            console.error("Error signing out:", err);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      className="w-full py-3 bg-red-600 rounded-lg"
    >
      <Text className="text-white text-center font-semibold text-base">
        Sign Out
      </Text>
    </TouchableOpacity>
  );
};
