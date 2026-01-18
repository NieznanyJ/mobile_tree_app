import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAssetsStore } from "@/lib/store/assetsStore";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [flashMode, setFlashMode] = useState<"on" | "off" | "auto">("auto");
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { setImage } = useAssetsStore();
  const router = useRouter();

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      alert("Aplikacja potrzebuje dostępu do kamery");
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlashMode((current) => {
      if (current === "off") return "auto";
      if (current === "auto") return "on";
      return "off";
    });
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (photo) {
        // Konwertujemy do formatu MediaLibrary Asset
        const asset: import("@/lib/store/assetsStore").CameraPhoto = {
          id: photo.uri,
          uri: photo.uri,
          mediaType: "photo",
          width: photo.width,
          height: photo.height,
        };

        setImage(asset);
        router.push("/predict");
      }
    } catch (error) {
      console.error("Błąd podczas robienia zdjęcia:", error);
      alert("Błąd podczas robienia zdjęcia");
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center p-4">
        <View className="items-center gap-4">
          <MaterialIcons name="camera-off" size={64} color="#fff" />
          <Text className="text-white text-lg font-semibold text-center">
            Potrzebujemy dostępu do kamery
          </Text>
          <Text className="text-gray-400 text-center">
            Aby korzystać z aparat, musisz udzielić uprawnień
          </Text>
          <Pressable
            onPress={handleRequestPermission}
            className="bg-green-600 px-6 py-3 rounded-full mt-4"
          >
            <Text className="text-white font-semibold">Udziel dostępu</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View style={styles.container}>
        {isCapturing && <LoadingOverlay text="Zapisywanie zdjęcia..." />}
        {/* Camera View */}
        <CameraView
          ref={cameraRef}
          facing={facing}
          flashMode={flashMode}
          style={styles.camera}
        />

        {/* Top Controls */}
        <View className="absolute top-0 left-0 right-0 p-4 flex-row justify-between items-start">
          <Pressable
            onPress={() => router.back()}
            className="bg-black/50 p-3 rounded-full"
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </Pressable>

          <View className="flex-row gap-3">
            <Pressable
              onPress={toggleFlash}
              className="bg-black/50 p-3 rounded-full"
            >
              <MaterialIcons
                name={
                  flashMode === "off"
                    ? "flash-off"
                    : flashMode === "auto"
                      ? "flash-auto"
                      : "flash-on"
                }
                size={24}
                color="#fff"
              />
            </Pressable>

            <Pressable
              onPress={toggleCameraFacing}
              className="bg-black/50 p-3 rounded-full"
            >
              <MaterialIcons name="flip-camera-android" size={24} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Bottom Controls */}
        <View className="absolute bottom-0 left-0 right-0 p-6 flex-row items-end justify-center gap-4">
          {/* Capture Button */}
          <Pressable
            onPress={takePicture}
            disabled={isCapturing}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center ${isCapturing ? "bg-gray-600" : "bg-green-600"
              }`}
          >
            {isCapturing ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View className="w-16 h-16 rounded-full bg-white" />
            )}
          </Pressable>
        </View>

        {/* Info Text */}
        <View className="absolute bottom-32 left-0 right-0 items-center">
          <Text className="text-white/70 text-sm">
            {facing === "back" ? "📷 Aparat główny" : "🤳 Aparat przód"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
