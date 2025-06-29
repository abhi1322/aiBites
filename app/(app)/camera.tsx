import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Redirect, router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const { isSignedIn } = useAuth();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  if (!permission) {
    // Camera permissions are still loading
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-white text-lg text-center mb-6">
            We need your permission to show the camera
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="bg-blue-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const goBack = () => {
    router.back();
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      setPhoto(result.uri);
      Alert.alert("Success", "Picture taken successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to take picture");
    } finally {
      setIsCapturing(false);
    }
  };

  const retakePicture = () => {
    setPhoto(null);
  };

  const savePicture = () => {
    // Here you would implement saving the photo to gallery or your app
    Alert.alert("Success", "Picture saved! (Implementation needed)");
    setPhoto(null);
  };

  if (photo) {
    // Show captured photo
    return (
      <SafeAreaView className="flex-1 bg-black">
        <Image source={{ uri: photo }} style={styles.camera} />

        {/* Header with back button */}
        <View className="absolute top-0 left-0 right-0 z-10 pt-4 px-4">
          <TouchableOpacity
            onPress={goBack}
            className="bg-black/50 rounded-full p-3 w-12 h-12 justify-center items-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Photo controls */}
        <View className="absolute bottom-0 left-0 right-0 pb-8 px-6">
          <View className="flex-row justify-center items-center space-x-8">
            <TouchableOpacity
              onPress={retakePicture}
              className="bg-red-500 rounded-full p-4"
            >
              <Ionicons name="refresh" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={savePicture}
              className="bg-green-500 rounded-full p-4"
            >
              <Ionicons name="checkmark" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      {/* Header with back button */}
      <View className="absolute top-0 left-0 right-0 z-10 pt-4 px-4">
        <TouchableOpacity
          onPress={goBack}
          className="bg-black/50 rounded-full p-3 w-12 h-12 justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Camera controls */}
      <View className="absolute bottom-0 left-0 right-0 pb-8 px-6">
        <View className="flex-row justify-between items-center">
          {/* Flip camera button */}
          <TouchableOpacity
            onPress={toggleCameraFacing}
            className="bg-black/50 rounded-full p-4"
          >
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>

          {/* Take picture button */}
          <TouchableOpacity
            onPress={takePicture}
            disabled={isCapturing}
            className={`rounded-full p-6 border-4 ${
              isCapturing ? "border-gray-500" : "border-white"
            }`}
          >
            <View
              className={`w-16 h-16 rounded-full ${
                isCapturing ? "bg-gray-500" : "bg-white"
              }`}
            />
          </TouchableOpacity>

          {/* Placeholder for symmetry */}
          <View className="w-12 h-12" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
