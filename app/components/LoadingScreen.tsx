import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
// import Logo from "@/assets/icons/Logo.svg"
import LogoText from "@/assets/icons/Mensura_text.svg";
import { AppText } from "./AppText";

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  showSpinner?: boolean;
  delay?: number; // Delay in milliseconds
  onDelayComplete?: () => void; // Callback when delay is complete
}

// add delay

export default function LoadingScreen({
  title = "Mensura",
  subtitle = "Your AI-Powered Nutrition Assistant",
  showSpinner = true,
  delay = 1500, // Default 1.5 seconds
  onDelayComplete,
}: LoadingScreenProps) {
  const [isDelayComplete, setIsDelayComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelayComplete(true);
      onDelayComplete?.();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onDelayComplete]);

  return (
    <View className="flex-1 w-[100%] bg-white justify-center items-center">
      <View className="flex-col h-full w-[100%] items-center justify-center">
        <LottieView
          source={require("@/assets/icons/Mensura.json")}
          style={{ width: 200, height: 200 }}
          autoPlay
          loop
        />
        <View className="-mt-[70px] ml-[-15px]">
          <LogoText width={100} height={100} />
        </View>
        <View className="absolute bottom-[50px]">
          <AppText
            tweight="regular"
            className="text-neutral-400 w-[70vw] text-sm text-center"
          >
            {/* write some text for loading, related to the app */}
            Get ready to scan your meal to get nutrition facts with AI
          </AppText>
        </View>

        {showSpinner && (
          <>{/* <ActivityIndicator size="large" color="#3e3e3e" /> */}</>
        )}
      </View>
    </View>
  );
}
