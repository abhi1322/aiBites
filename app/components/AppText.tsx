import React from "react";
import { Text as RNText, TextProps } from "react-native";

// Map tweight prop to Poppins font family
const poppinsFontMap: Record<string, string> = {
  black: "Poppins-Black",
  bold: "Poppins-Bold",
  extrabold: "Poppins-ExtraBold",
  extralight: "Poppins-ExtraLight",
  light: "Poppins-Light",
  medium: "Poppins-Medium",
  regular: "Poppins-Regular",
  semibold: "Poppins-SemiBold",
  thin: "Poppins-Thin",
};

interface AppTextProps extends TextProps {
  className?: string;
  tweight?: keyof typeof poppinsFontMap;
}

export function AppText({
  className,
  tweight = "regular",
  style,
  ...props
}: AppTextProps) {
  const fontFamily = poppinsFontMap[tweight] || poppinsFontMap.regular;
  return (
    <RNText {...props} style={[{ fontFamily }, style]} className={className} />
  );
}
