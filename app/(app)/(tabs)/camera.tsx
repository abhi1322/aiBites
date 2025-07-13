import { AppText } from "@/app/components/AppText";
import { LightButton } from "@/app/components/ui/Button";
import Ionicons from "@expo/vector-icons/Ionicons";

import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Scan from "@/assets/icons/scan.svg";

export default function CameraScreen() {
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
        // autofocus="on"
        zoom={0.1}
        onCameraReady={handleCameraReady}
      />
      {/* Back button overlay */}

      <View className=" h-16 w-20 absolute top-14 left-8">
        <LightButton
          onPress={() => router.push("/(app)/(tabs)/home")}
          icon={<Ionicons name="arrow-back" size={20} color={"#C0C0C0"} />}
        />
      </View>

      {/* Capture Button overlay at bottom center */}

      <View
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
          zIndex: 1000,
        }}
      >
        <Scan />
      </View>

      <View className="absolute bottom-[10%] ">
        <TouchableOpacity
          onPress={takePicture}
          className="border border-[#2D2D2D] rounded-full"
          activeOpacity={0.9}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            width: 180,
            height: 60,
            borderRadius: 30,
            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.3,
            shadowRadius: 20,
          }}
        >
          <LinearGradient
            colors={["#202020", "#121212"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: 30,
            }}
            className=""
          />
          <Image
            source={require("@/assets/icons/scan-camera.png")}
            className="w-8 h-8 mr-1 "
            resizeMode="contain"
            style={{ zIndex: 1 }}
          />
          <AppText className="text-[#CDCDCD] capitalize" style={{ zIndex: 1 }}>
            Scan your meal
          </AppText>
        </TouchableOpacity>
      </View>
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
