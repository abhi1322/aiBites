import React from "react";
import { Text as RNText, TextProps, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SafeAreaEdge = "top" | "bottom" | "left" | "right";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  edges?: SafeAreaEdge[];
}

export function AppText(props: TextProps) {
  return (
    <RNText
      {...props}
      style={[{ fontFamily: "Poppins-Regular" }, props.style]}
    />
  );
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  className = "",
  style,
  edges = ["top", "bottom", "left", "right"],
}) => {
  const insets = useSafeAreaInsets();

  const safeAreaStyle = {
    paddingTop: edges.includes("top") ? insets.top : 0,
    paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
    paddingLeft: edges.includes("left") ? insets.left : 0,
    paddingRight: edges.includes("right") ? insets.right : 0,
  };

  return (
    <View className={`flex-1 ${className}`} style={[safeAreaStyle, style]}>
      {children}
    </View>
  );
};

export default SafeAreaWrapper;
