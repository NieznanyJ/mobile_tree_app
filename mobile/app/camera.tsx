import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  AppStateStatus,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { MAX_PREDICTION_ASSETS, useAssetsStore } from "@/lib/store/assetsStore";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [flashMode, setFlashMode] = useState<"on" | "off" | "auto">("auto");
  const [isCapturing, setIsCapturing] = useState(false);
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  const { selectedAssets, addAssetForPrediction } = useAssetsStore();
  const router = useRouter();

  const [isCameraActive, setIsCameraActive] = useState(true);
  const appStateRef = useRef(AppState.currentState);

  const baseZoom = useSharedValue(0);
  const zoomShared = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      baseZoom.value = zoomShared.value;
    })
    .onUpdate((e) => {
      const next = Math.min(Math.max(baseZoom.value + (e.scale - 1) * 0.5, 0), 1);
      zoomShared.value = next;
      runOnJS(setZoom)(next);
    });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (appStateRef.current === "active" && nextAppState.match(/inactive|background/)) {
        setIsCameraActive(false);
      } else if (appStateRef.current.match(/inactive|background/) && nextAppState === "active") {
        setIsCameraActive(true);
      }
      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

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

    if (selectedAssets.length >= MAX_PREDICTION_ASSETS) {
      Alert.alert("Limit zdjęć", "Wszystkie 4 sloty są zajęte. Usuń jedno zdjęcie, aby dodać nowe.");
      return;
    }

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (photo) {
        const asset: import("@/lib/store/assetsStore").CameraPhoto = {
          id: photo.uri,
          uri: photo.uri,
          mediaType: "photo",
          width: photo.width,
          height: photo.height,
        };

        addAssetForPrediction(asset);
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

        <GestureDetector gesture={pinchGesture}>
          <View style={styles.camera}>
            {isCameraActive && (
              <CameraView
                ref={cameraRef}
                facing={facing}
                flash={flashMode}
                mute={true}
                zoom={zoom}
                style={styles.camera}
              />
            )}
          </View>
        </GestureDetector>

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

        {zoom > 0.01 && (
          <View className="absolute top-20 left-0 right-0 items-center">
            <View className="bg-black/50 px-3 py-1 rounded-full">
              <Text className="text-white text-sm font-medium">
                {(1 + zoom * 9).toFixed(1)}×
              </Text>
            </View>
          </View>
        )}

        <View className="absolute bottom-0 left-0 right-0 p-6 flex-row items-end justify-center gap-4">
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

        <View className="absolute bottom-32 left-0 right-0 items-center">
          <Text className="text-white/70 text-sm">
            {facing === "back" ? "Aparat główny" : "Aparat przód"}
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
