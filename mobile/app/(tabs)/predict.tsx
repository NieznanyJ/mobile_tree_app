import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
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
import PredictionModal from "@/components/modals/PredictionModal";
import Button from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { useImagePreview } from "@/lib/hooks/useImagePreview";
import { useSmartPrediction } from "@/lib/hooks/useSmartPrediction";
import { MAX_PREDICTION_ASSETS, useAssetsStore } from "@/lib/store/assetsStore";

const GRID_SPACING = 12;
const GRID_COLUMNS = 2;
const SLOT_SIZE =
  (Dimensions.get("window").width - 32 - GRID_SPACING) / GRID_COLUMNS;

const PredictPage = () => {
  const { selectedAssets, removeAssetForPrediction } = useAssetsStore();
  const preview = useImagePreview();
  const {
    prediction,
    isLoading,
    isCompressing,
    predict,
    clearPrediction,
    source,
  } = useSmartPrediction();

  const handlePredict = async () => {
    if (selectedAssets.length === 0) return;
    await predict(selectedAssets);
  };

  const handleClearAll = () => {
    selectedAssets.forEach((asset) => removeAssetForPrediction(asset.id));
    clearPrediction();
  };

  const slots = Array.from({ length: MAX_PREDICTION_ASSETS }, (_, i) => {
    return selectedAssets[i] || null;
  });

  const isDisabled = isLoading || isCompressing;
  const canAddMore = selectedAssets.length < MAX_PREDICTION_ASSETS;


  return (
    <>
      <Pressable onPress={handleClearAll} className="px-4 bg-background" disabled={selectedAssets.length === 0} >
        <View className="flex flex-row items-center gap-4 justify-start" style={{ opacity: selectedAssets.length === 0 ? 0.5 : 1 }}>
          <MaterialIcons name="clear-all" className="bg-gray-50 rounded-full p-2" size={24} color={selectedAssets.length === 0 ? colors.gray[500] : colors.secondary} />
        </View>
      </Pressable>
      <View className="flex-1 p-4 flex-col items-center justify-between bg-background">
        <View className="w-full flex-1">
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
                    <Pressable onPress={() => preview.open(index)}>
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
                      router.push("/(tabs)/gallery")
                    }
                    className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl items-center justify-center bg-gray-50"
                  >
                    <Ionicons name="add" size={32} color={colors.text.muted} />
                    <Text className="text-gray-400 text-xs mt-1">Dodaj</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>

          <View className="flex-row items-center mt-4 px-1 gap-2">
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.gray[500]}
            />
            <Text className="text-sm text-gray-500 flex-1">
              Więcej zdjęć to większa precyzja. Sfotografuj różne detale: liść,
              korę oraz owoce lub kwiaty
            </Text>
          </View>



          <View className="flex-row justify-center gap-4 mt-4">
            <Pressable
              disabled={isDisabled || !canAddMore}
              style={{ opacity: isDisabled || !canAddMore ? 0.5 : 1 }}
              onPress={() =>
                router.push("/(tabs)/gallery")
              }
              className="flex-row items-center gap-2 px-5 py-3 bg-gray-100 rounded-full"
            >
              <MaterialCommunityIcons
                name="image-outline"
                size={20}
                color={colors.gray[700]}
              />
              <Text className="text-gray-700 font-medium">Galeria</Text>
            </Pressable>

            <Pressable
              disabled={isDisabled || !canAddMore}
              style={{ opacity: isDisabled || !canAddMore ? 0.5 : 1 }}
              onPress={() => router.push("/camera")}
              className="flex-row items-center gap-2 px-5 py-3 bg-gray-100 rounded-full"
            >
              <Ionicons
                name="camera-outline"
                size={20}
                color={colors.gray[700]}
              />
              <Text className="text-gray-700 font-medium">Aparat</Text>
            </Pressable>
          </View>

          {source === "local" && (
            <View className="flex-row items-center justify-center mt-4 px-1 gap-1">
              <Ionicons
                name="phone-portrait-outline"
                size={14}
                color={colors.gray[400]}
              />
              <Text className="text-xs text-gray-400">
                Tryb offline - wyniki mogą być mniej dokładne
              </Text>
            </View>
          )}


        </View>

        {isCompressing && (
          <View className="flex-row items-center gap-2 mb-2">
            <ActivityIndicator size="small" color={colors.secondary} />
            <Text className="text-gray-600 text-sm">Kompresja zdjęć...</Text>
          </View>
        )}

        <Button
          title="Identyfikuj"
          className="mb-2 border-0"
          onPress={handlePredict}
          disabled={isDisabled || selectedAssets.length === 0}
          isLoading={isLoading}
        />

        <PredictionModal
          prediction={prediction}
          setPrediction={() => clearPrediction()}
          isLoading={isLoading}
        />

        {selectedAssets.length > 0 && (
          <ImagePreviewModal
            visible={preview.isVisible}
            images={selectedAssets.map((a) => ({ uri: a.uri }))}
            initialIndex={preview.currentIndex}
            onClose={preview.close}
          />
        )}
      </View>
    </>
  );
};

export default PredictPage;
