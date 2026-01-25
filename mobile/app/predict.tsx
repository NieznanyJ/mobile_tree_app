import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ImagePreviewModal from "@/components/modals/ImagePreviewModal";
import PredictionModal, { PredictionResult } from "@/components/modals/PredictionModal";
import Button from "@/components/ui/Button";
import { MAX_PREDICTION_ASSETS, useAssetsStore } from "@/lib/store/assetsStore";
import { compressImage } from "@/lib/utils/imageOptimization";

const GRID_SPACING = 12;
const GRID_COLUMNS = 2;
const SLOT_SIZE =
  (Dimensions.get("window").width - 32 - GRID_SPACING) / GRID_COLUMNS;

const PredictPage = () => {
  const { selectedAssets, removeAssetForPrediction } = useAssetsStore();
  const [prediction, setPrediction] = React.useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const predict = async () => {
    if (selectedAssets.length === 0) return;

    try {
      setIsCompressing(true);

      // Compress all selected images
      const compressedUris: string[] = [];
      for (const asset of selectedAssets) {
        const compressed = await compressImage(asset.uri);
        compressedUris.push(compressed.compressedUri);
      }

      setIsCompressing(false);
      setIsLoading(true);

      const formData = new FormData();
      compressedUris.forEach((uri, i) => {
        formData.append("image", {
          uri,
          name: `image_${i}.jpeg`,
          type: "image/jpeg",
        } as any);
      });

      const apiResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/predict/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await apiResponse.json();
      console.log("Prediction result:", result);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsCompressing(false);
      setIsLoading(false);
    }
  };

  const slots = Array.from({ length: MAX_PREDICTION_ASSETS }, (_, i) => {
    return selectedAssets[i] || null;
  });

  return (
    <>
      <SafeAreaView className="flex-1 p-4 flex-col items-center justify-between bg-background">
        <View className="w-full flex-1 ">
          {/* 2x2 Grid */}
          <View
            className="flex-row flex-wrap justify-between"
            style={{ gap: GRID_SPACING }}
          >
            {slots.map((asset, index) => (
              <View
                key={asset?.id ?? `empty-${index}`}
                style={{ width: SLOT_SIZE, height: SLOT_SIZE }}
                className="rounded-xl overflow-hidden"
              >
                {asset ? (
                  <View className="relative w-full h-full">
                    <Pressable key={index} onPress={() => openPreview(index)}>
                      <Image
                        source={{ uri: asset.uri }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => removeAssetForPrediction(asset.id)}
                      className="absolute top-2 right-2 bg-black/60 rounded-full w-7 h-7 items-center justify-center"
                    >
                      <Ionicons name="close" size={18} color="#fff" />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={() =>
                      router.push("/(media-browser)/all-photos?mode=single")
                    }
                    className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl items-center justify-center bg-gray-50"
                  >
                    <Ionicons name="add" size={32} color="#9ca3af" />
                    <Text className="text-gray-400 text-xs mt-1">Dodaj</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>

          {/* Info text */}
          <View className="flex-row items-center mt-4 px-1 gap-2">
            <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
            <Text className="text-sm text-gray-500 flex-1">
              Więcej zdjęć to większa precyzja. Sfotografuj różne detale: liść, korę oraz owoce lub kwiaty            </Text>
          </View>


          {/* Action buttons row */}
          <View className="flex-row justify-center gap-4 mt-6">
            <Pressable
              disabled={isLoading || isCompressing || selectedAssets.length === 4}
              style={{ opacity: isLoading || isCompressing || selectedAssets.length === 4 ? 0.5 : 1 }}
              onPress={() =>
                router.push("/(media-browser)/all-photos?mode=single")
              }
              className="flex-row items-center gap-2 px-5 py-3 bg-gray-100 rounded-full"
            >
              <MaterialCommunityIcons
                name="image-outline"
                size={20}
                color="#374151"
              />
              <Text className="text-gray-700 font-medium">Galeria</Text>
            </Pressable>

            <Pressable
              disabled={isLoading || isCompressing || selectedAssets.length === 4}
              style={{ opacity: isLoading || isCompressing || selectedAssets.length === 4 ? 0.5 : 1 }}
              onPress={() => router.push("/(tabs)/camera")}
              className="flex-row items-center gap-2 px-5 py-3 bg-gray-100 rounded-full"
            >
              <Ionicons name="camera-outline" size={20} color="#374151" />
              <Text className="text-gray-700 font-medium">Aparat</Text>
            </Pressable>
          </View>
          {selectedAssets.length === 4 && (
            <Text className="text-sm text-center text-gray-500 mt-4">
              Maksymalnie możesz dodać {MAX_PREDICTION_ASSETS} zdjęcia.
            </Text>
          )}
        </View>

        {/* Compression indicator */}
        {isCompressing && (
          <View className="flex-row items-center gap-2 mb-2">
            <ActivityIndicator size="small" color="#00964a" />
            <Text className="text-gray-600 text-sm">Kompresja zdjęć...</Text>
          </View>
        )}

        <Button
          title="Sprawdź"
          className="mb-6"
          onPress={predict}
          disabled={isLoading || isCompressing || selectedAssets.length === 0}
        />

        <PredictionModal
          prediction={prediction}
          setPrediction={setPrediction}
          isLoading={isLoading}
        />

        {selectedAssets.length > 0 && (
          <ImagePreviewModal
            visible={previewVisible}
            images={selectedAssets[selectedAssets.length - 1] ? selectedAssets.map(a => ({ uri: a.uri })) : []}
            initialIndex={previewIndex}
            onClose={() => setPreviewVisible(false)}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default PredictPage;
