import { AppText } from "@/app/components/AppText";
import {
  SettingsCard,
  SettingsContainer,
  createSettingsSections,
} from "@/app/components/profile";
import { DarkButton } from "@/app/components/ui/Button";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!user) return null;
  if (userData === undefined)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  if (userData === null)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">No user data found.</Text>
      </View>
    );

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  const settingsSections = createSettingsSections(router);

  return (
    <ScrollView className="flex-1 bg-white ">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-4 mt-12">
        <View className="items-center">
          {/* Profile Image */}
          <View className="relative mb-4">
            {userData.profileImage ? (
              <Image
                source={{ uri: userData.profileImage }}
                className="w-24 h-24 bg-white rounded-full border-2 border-neutral-200 overflow-visible"
                resizeMode="cover"
                style={styles.shadow}
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                <AppText className="text-gray-500 text-lg font-semibold">
                  {userData.firstName?.[0] || userData.email?.[0] || "U"}
                </AppText>
              </View>
            )}
          </View>

          {/* User Info */}
          <AppText tweight="medium" className="text-lg text-neutral-800 mb-1 ">
            {userData.firstName} {userData.lastName}
          </AppText>
          <AppText className="text-neutral-400 mb-3 text-sm">
            {userData.email}
          </AppText>
        </View>
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <SettingsContainer
          className="px-6"
          key={section.title}
          title={section.title}
        >
          {section.items.map((item, itemIndex) => (
            <SettingsCard
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              onPress={item.onPress}
              showBorder={itemIndex !== section.items.length - 1}
            />
          ))}
        </SettingsContainer>
      ))}

      {/* Sign Out Button */}
      <View className="px-6 mb-12">
        <DarkButton
          onPress={handleSignOut}
          className="px-6"
          icon={<LogOut size={20} color="#ebebeb" />}
        >
          <AppText className="text-[#ebebeb] font-semibold ml-2">
            Sign Out
          </AppText>
        </DarkButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
});
