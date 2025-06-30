import { useClerk } from "@clerk/clerk-expo";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

export default function SignOutButton() {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      className="px-4 py-2 bg-red-500 rounded-lg"
    >
      <Text className="text-white font-semibold">Sign Out</Text>
    </TouchableOpacity>
  );
}
