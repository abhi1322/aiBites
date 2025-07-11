import { AppText } from "@/app/components/AppText";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Camera, Home, User } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// Custom Camera Button component for the camera tab
interface CameraButtonProps {
  onPress: () => void;
  onLongPress?: () => void;
  isFocused: boolean;
}
function CameraButton({ onPress, onLongPress, isFocused }: CameraButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        // Change the background color of the camera button here
        backgroundColor: isFocused ? "#FF6347" : "#000", // <-- CAMERA BUTTON COLORS
        borderRadius: 40,
        width: 70,
        height: 70,
        marginTop: -30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
        borderWidth: isFocused ? 3 : 0,
        borderColor: isFocused ? "#FFF" : "transparent", // <-- CAMERA BUTTON BORDER COLOR
      }}
      activeOpacity={0.8}
    >
      {/* Change the camera icon color here */}
      <Camera color="#FFF" size={36} />
    </TouchableOpacity>
  );
}

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  // Hide the tab bar entirely if the focused tab is camera
  const focusedRoute = state.routes[state.index];
  if (focusedRoute.name === "camera") {
    return null;
  }
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        let Icon = Home;
        if (route.name === "camera") Icon = Camera;
        if (route.name === "profile") Icon = User;

        const isCamera = route.name === "camera";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // Use the route name for navigation
            navigation.navigate(route.name as never);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        // Custom rendering for the camera tab
        if (isCamera) {
          return (
            <CameraButton
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
            />
          );
        }

        // Change the icon color and size for focused/unfocused state here
        const iconColor = isFocused ? "#FF6347" : "#A8A8A8"; // <-- FOCUSED ICON COLOR
        const iconSize = isFocused ? 34 : 28; // <-- FOCUSED ICON SIZE

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tab, isFocused && styles.focusedTab]}
            activeOpacity={0.7}
          >
            <Icon color={iconColor} size={iconSize} />
            <AppText
              style={[styles.label, isFocused && styles.focusedLabel]}
              className="text-neutral-700 text-sm"
            >
              {label as string}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    minHeight: 50,
  },
  label: {
    fontSize: 12,
    color: "#000",
    marginTop: 2,
  },
  focusedLabel: {
    color: "#333333",
    fontWeight: "bold",
  },
  focusedTab: {
    // Add any focused tab styling here
  },
  cameraTab: {
    backgroundColor: "#000",
    borderRadius: 40,
    width: 60,
    height: 60,
    marginTop: -30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});
