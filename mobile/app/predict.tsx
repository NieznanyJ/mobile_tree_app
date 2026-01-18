import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PredictionModal from "@/components/modals/PredictionModal";
import Button from "@/components/ui/Button";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import {
  compressImage,
  formatBytes,
  getCompressionRatio,
} from "@/lib/utils/imageOptimization";
import { useAssetsStore } from "@/lib/store/assetsStore";

const PredictPage = () => {
  const { image, compressedImageUri, setCompressedImageUri } = useAssetsStore();
  const [prediction, setPrediction] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [compressionInfo, setCompressionInfo] = React.useState<{
    original: number;
    compressed: number;
    ratio: number;
  } | null>(null);


  // Clear compressed image when source image changes
  React.useEffect(() => {
    if (image?.uri) {
      // Reset compression state when image changes
      setCompressedImageUri(null);
      setCompressionInfo(null);
    }
  }, [image?.uri]);

  // Compress image when it changes or component focuses
  useFocusEffect(
    React.useCallback(() => {
      const compressIfNeeded = async () => {
        if (image && image.uri && !compressedImageUri) {
          await compressImageForPrediction();
        }
      };

      compressIfNeeded();
    }, [image?.uri, compressedImageUri])
  );

  const compressImageForPrediction = async () => {
    if (!image?.uri) return;

    try {
      console.log("Starting compression...");
      setIsCompressing(true);
      const compressed = await compressImage(image.uri);

      setCompressedImageUri(compressed.compressedUri);
      setCompressionInfo({
        original: compressed.originalSize,
        compressed: compressed.compressedSize,
        ratio: getCompressionRatio(
          compressed.originalSize,
          compressed.compressedSize
        ),
      });

      console.log(
        `Image compressed: ${formatBytes(compressed.originalSize)} → ${formatBytes(compressed.compressedSize)} (${getCompressionRatio(compressed.originalSize, compressed.compressedSize)}% reduction)`
      );
    } catch (error) {
      console.error("Failed to compress image:", error);
    } finally {
      console.log("Compression finished, setting isCompressing to false");
      setIsCompressing(false);
    }
  };

  const predict = async () => {
    if (!compressedImageUri) {
      console.warn("No compressed image available");
      return;
    }

    try {
      setIsLoading(true);
      // Here you would send compressedImageUri to your backend
      // const formData = new FormData();
      // formData.append('image', { uri: compressedImageUri, type: 'image/jpeg' });
      // const response = await fetch('http://your-backend/predict', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const result = await response.json();
      // setPrediction(result.prediction);

      // Mock prediction for now
      setTimeout(() => {
        setPrediction("Dąb szypułkowy");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Prediction failed:", error);
      setIsLoading(false);
    }
  };

  const displayImageUri = compressedImageUri || image?.uri;

  return (
    <>
      <SafeAreaView className="flex-1 p-4 flex flex-col items-center justify-between bg-background">

        <View className="mb-4 w-full h-96 justify-center items-center flex-col gap-4  rounded-md mt-20">
          {isCompressing ? (
            <View className="w-full h-full rounded-lg bg-gray-200 justify-center items-center ">
              <ActivityIndicator size="large" color="#0000ff" />
              <Text className="mt-2 text-gray-600">Kompresja zdjęcia...</Text>
            </View>
          ) : (
            <Image
              className="w-full h-full rounded-lg"
              source={{ uri: displayImageUri }}
              resizeMode="cover"
            />
          )}

          {compressionInfo && compressionInfo.ratio > 0 && (
            <View className="w-full bg-blue-50 p-3 rounded-lg">
              <Text className="text-xs text-gray-600">
                Oryginał: {formatBytes(compressionInfo.original)}
              </Text>
              <Text className="text-xs text-gray-600">
                Skompresowany: {formatBytes(compressionInfo.compressed)}
              </Text>
              <Text className="text-xs font-semibold text-green-600">
                Oszczędność: {compressionInfo.ratio}%
              </Text>
            </View>
          )}

          <View className="flex-col justify-between w-full gap-4">
            <View className="flex flex-row justify-between items-center w-full">
              <Text>Wybierz inne zdjęcie</Text>
              <Pressable
                className="flex flex-row items-center justify-center gap-0 p-2 bg-secondary rounded-full"
                onPress={() => router.replace("/(media-browser)/all-photos")}
              >
                <MaterialCommunityIcons
                  name="image-outline"
                  size={24}
                  color="#fff"
                />
              </Pressable>
            </View>

            <View className="flex flex-row justify-between items-center w-full">
              <Text>Zdjęcia z aparatu</Text>
              <Pressable
                className="flex flex-row items-center justify-center gap-0 p-2 bg-secondary rounded-full"
                onPress={() => router.replace("/(tabs)/camera")}
              >
                <Ionicons name="camera-outline" size={24} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>

        <Button
          title="Sprawdź"
          onPress={predict}
          disabled={isLoading || isCompressing || !compressedImageUri}
        />

        <PredictionModal
          prediction={prediction}
          setPrediction={setPrediction}
        />
      </SafeAreaView>

      <LoadingOverlay isVisible={isLoading} text="Analizowanie zdjęcia..." />
    </>
  );
};

export default PredictPage;
