import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { View } from "react-native";
import { AppText } from "../components/AppText";
import { DarkButton } from "../components/ui/Button";

export default function CongratulationsScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-white px-6 w-full">
      <LottieView
        source={require("@/assets/icons/CdlMlpXOBP.json")}
        autoPlay
        loop={false}
        style={{ width: 400, height: 400, marginBottom: 24 }}
      />
      <AppText tweight="semibold" className="text-3xl text-center mb-2">
        Profile Setup Complete
      </AppText>
      <AppText
        tweight="regular"
        className="text-base w-[80vw] text-center mb-8 text-neutral-500"
      >
        Great job — you’re all set to start tracking your meals and reaching
        your goals.
      </AppText>
      <View className="w-full">
        <DarkButton
          onPress={() => router.replace("/home")}
          className="flex-row items-center justify-center gap-2"
          iconPosition="right"
          icon={<Ionicons name="arrow-forward" size={24} color="white" />}
        >
          <AppText tweight="regular" className="text-lg text-center">
            Start your tracking journey
          </AppText>
        </DarkButton>
      </View>
    </View>
  );
}
