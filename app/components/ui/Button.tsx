import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { GestureResponderEvent, TouchableOpacity, View } from "react-native";
import { AppText } from "../AppText";

// Simple cn utility for merging class names (tailwind/nativewind)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// Example icon prop type (can be ReactNode or a specific icon type)
type IconType = React.ReactNode;

type ButtonProps = {
  children?: React.ReactNode;
  icon?: IconType;
  iconPosition?: "left" | "right";
  className?: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  // Add more props as needed
};

const LightButton: React.FC<ButtonProps> = ({
  children,
  icon,
  iconPosition = "left",
  className = "",
  onPress,
  disabled = false,
}) => {
  const content = (
    <>
      {icon && iconPosition === "left" && <View className="mr-2">{icon}</View>}
      {children && <AppText className="text-lg ">{children}</AppText>}
      {icon && iconPosition === "right" && <View className="ml-2">{icon}</View>}
    </>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.5}
      className="h-20 w-[100%] text-xl rounded-2xl overflow-hidden border border-[#E0E0E0] transition-all duration-100"
    >
      <LinearGradient
        colors={["#FFFFFF", "#EEEEEE"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          // paddingVertical: 8,
          // paddingHorizontal: 24,
          height: "100%",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {content}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const DarkButton: React.FC<ButtonProps> = ({
  children,
  icon,
  iconPosition = "left",
  className = "",
  onPress,
  disabled = false,
}) => {
  const content = (
    <>
      {icon && iconPosition === "left" && <View className="mr-2">{icon}</View>}
      {children && (
        <AppText className="text-lg font-medium text-white">
          {children}
        </AppText>
      )}
      {icon && iconPosition === "right" && <View className="ml-2">{icon}</View>}
    </>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className="h-20 rounded-2xl overflow-hidden border border-gray-500 "
    >
      <LinearGradient
        colors={["#404040", "#171717"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          // paddingVertical: 8,
          // paddingHorizontal: 24,
          height: "100%",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {content}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export { DarkButton, LightButton };
