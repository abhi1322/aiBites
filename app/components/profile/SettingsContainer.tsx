import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "../AppText";

interface SettingsContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsContainer: React.FC<SettingsContainerProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <View className={`mb-6 ${className}`}>
      <AppText className="font-semibold text-neutral-500 px-4 text-base mb-2">
        {title}
      </AppText>
      <View
        className="bg-white rounded-2xl border border-neutral-200 "
        style={styles.shadow}
      >
        {children}
      </View>
    </View>
  );
};

// make a style for shadow class
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
});
