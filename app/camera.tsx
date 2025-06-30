import React from "react";
import { Text, View } from "react-native";

export default function CameraScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Camera</Text>
      {/* Camera functionality will go here */}
    </View>
  );
}
