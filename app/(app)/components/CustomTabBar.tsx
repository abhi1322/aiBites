import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Camera, Home, User } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            // Removed testID={options?.tabBarTestID} because tabBarTestID is not a valid property
            onPress={onPress}
            style={[
              styles.tab,
              isCamera && styles.cameraTab,
              isFocused && !isCamera && styles.focusedTab,
            ]}
            activeOpacity={0.8}
          >
            <Icon
              color={isCamera ? "#fff" : isFocused ? "#07a" : "#000"}
              size={28}
            />
            {!isCamera && (
              <Text style={[styles.label, isFocused && styles.focusedLabel]}>
                {label as string}
              </Text>
            )}
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
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    color: "#000",
    marginTop: 2,
  },
  focusedLabel: {
    color: "#07a",
    fontWeight: "bold",
  },
  focusedTab: {},
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
