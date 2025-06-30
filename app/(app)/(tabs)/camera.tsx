import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          zIndex: 10,
          padding: 10,
          backgroundColor: "#eee",
          borderRadius: 20,
        }}
        onPress={() => navigation.navigate("home")}
      >
        <Text style={{ fontSize: 16 }}>Back</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold">Camera</Text>
      {/* Camera functionality will go here */}
    </View>
  );
}
