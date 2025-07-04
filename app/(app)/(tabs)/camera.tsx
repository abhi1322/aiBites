import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [pictureSize, setPictureSize] = useState<string | undefined>(undefined);

  // Lock orientation to portrait on mount, unlock on unmount
  React.useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  // For 4:3 ratio, fill width, adjust height
  let cameraWidth = screenWidth;
  let cameraHeight = Math.round((screenWidth * 4) / 3);
  if (cameraHeight > screenHeight) {
    cameraHeight = screenHeight;
    cameraWidth = Math.round((screenHeight * 3) / 4);
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get the largest available picture size when camera is ready
  async function handleCameraReady() {
    if (cameraRef.current && cameraRef.current.getAvailablePictureSizesAsync) {
      try {
        const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
        if (sizes && sizes.length > 0) {
          // Sort sizes by width descending and pick the largest
          const sorted = sizes.sort((a: string, b: string) => {
            const [aw, ah] = a.split("x").map(Number);
            const [bw, bh] = b.split("x").map(Number);
            return bw * bh - aw * ah;
          });
          setPictureSize(sorted[0]);
        }
      } catch (e) {
        // fallback: do nothing
      }
    }
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
          skipProcessing: false,
        });
        // Navigate to image preview screen with photo URI
        router.push({
          pathname: "/screens/image-preview",
          params: { uri: photo.uri },
        });
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
      }
    }
  }

  return (
    <View style={styles.container}>
      {/* Camera Preview fills the whole screen */}
      <CameraView
        ref={cameraRef}
        style={{
          width: screenWidth,
          height: screenHeight,
          position: "absolute",
          top: 0,
          left: 0,
        }}
        ratio="4:3" // Use 16:9 to best fill the screen, but preview will always fill
        facing="back"
        autofocus="on"
        zoom={0.1}
        onCameraReady={handleCameraReady}
      />
      {/* Back button overlay */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("home" as never)}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      {/* Capture Button overlay at bottom center */}
      <TouchableOpacity
        onPress={takePicture}
        style={styles.captureButtonAbsolute}
      >
        <Text style={styles.captureButtonText}>Take Picture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", alignItems: "center" },
  message: { textAlign: "center", paddingBottom: 10, fontSize: 16 },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  backButtonText: { fontSize: 16, color: "black" },
  captureButtonAbsolute: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  captureButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
