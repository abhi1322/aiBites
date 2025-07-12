import { ChevronRight } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { AppText } from "../AppText";
import DashedSeparator from "../ui/DashedSeparator";

interface SettingsCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onPress: () => void;
  showBorder?: boolean;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  showBorder = true,
}) => {
  return (
    <TouchableOpacity
      className="flex-col items-center  py-0"
      onPress={onPress}
      style={{
        overflow: "hidden",
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-4">
        <View className="w-8 h-8 rounded-lg bg-gray-100 items-center justify-center mr-3">
          {icon}
        </View>
        <View className="flex-1">
          <AppText className="text-base font-medium text-gray-900">
            {title}
          </AppText>
          {subtitle && (
            <AppText className="text-sm text-gray-500">{subtitle}</AppText>
          )}
        </View>
        <ChevronRight size={20} color="#d1d5db" />
      </View>
      {showBorder && <DashedSeparator width={600} className="mb-4" />}
    </TouchableOpacity>
  );
};
