import Ionicons from "@expo/vector-icons/build/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import treesData from "@/assets/data/trees.json";
import treeImages from "@/assets/images/trees";
import PredictionSkeleton from "@/components/skeletons/PredictionSkeleton";
import Overlay from "@/components/ui/Overlay";
import { PredictionResult, SinglePrediction } from "@/lib/hooks/usePrediction";
import { FlashList } from "@shopify/flash-list";

interface Tree {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  occurrence: string;
  images: string[];
}

interface PredictionModalProps {
  prediction: PredictionResult | null;
  setPrediction: (val: PredictionResult | null) => void;
  isLoading: boolean;
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 70) return "#22c55e"; // zielony
  if (confidence >= 40) return "#eab308"; // żółty
  return "#ef4444"; // czerwony
};

const getConfidenceBgColor = (confidence: number) => {
  if (confidence >= 70) return "rgba(34, 197, 94, 0.15)";
  if (confidence >= 40) return "rgba(234, 179, 8, 0.15)";
  return "rgba(239, 68, 68, 0.15)";
};

export default function PredictionModal({
  prediction,
  setPrediction,
  isLoading,
}: PredictionModalProps) {
  const visible = isLoading || prediction !== null;

  const handleClose = () => {
    setPrediction(null);
  };

  const handleGoToAtlas = (treeId: string) => {
    setPrediction(null);
    router.push(`/tree/${treeId}`);
  };

  // Pobierz predykcje i ogranicz do 3 (lub 1 jeśli 100%)
  let predictions = prediction?.predictions || [];

  // Jeśli najwyższa pewność >= 99%, pokazuj tylko ją
  if (predictions.length > 0 && predictions[0].confidence >= 99) {
    predictions = [predictions[0]];
  } else {
    // Inaczej pokaż max 3
    predictions = predictions.slice(0, 3);
  }

  // Znajdź dane drzew dla predykcji
  const getTreeData = (treeId: string): Tree | undefined => {
    return (treesData as Tree[]).find((tree) => tree.id === treeId);
  };

  return (
    <>
      <Overlay isVisible={visible} />
      <Modal visible={visible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className="flex-1 justify-end">
            <TouchableWithoutFeedback>
              <View
                className="bg-white rounded-t-3xl"
                style={{ maxHeight: "85%" }}
              >
                <SafeAreaView edges={["bottom"]}>
                  {/* Handle bar */}
                  <View className="items-center pt-3 pb-2">
                    <View className="w-10 h-1 bg-gray-300 rounded-full" />
                  </View>

                  {isLoading ? (
                    <View className="p-6">
                      <PredictionSkeleton />
                    </View>
                  ) : predictions.length > 0 ? (
                    <ScrollView
                      className="px-4 pb-4"
                      showsVerticalScrollIndicator={false}
                    >
                      {/* Główna predykcja (najwyższa pewność) */}
                      <TopPredictionCard
                        prediction={predictions[0]}
                        tree={getTreeData(predictions[0].tree_id)}
                        onGoToAtlas={handleGoToAtlas}
                      />

                      {/* Pozostałe predykcje */}
                      {predictions.length > 1 && (
                        <View className="mt-4">
                          <Text className="text-sm text-gray-500 mb-2 px-1">
                            Inne możliwości
                          </Text>
                          {predictions.slice(1).map((pred) => (
                            <SecondaryPredictionCard
                              key={pred.tree_id}
                              prediction={pred}
                              tree={getTreeData(pred.tree_id)}
                              onGoToAtlas={handleGoToAtlas}
                            />
                          ))}
                        </View>
                      )}

                      {/* Przycisk zamknij */}
                      <Pressable
                        onPress={handleClose}
                        className="mt-4 mb-2 py-3 items-center"
                      >
                        <Text className="text-gray-500 text-sm">Zamknij</Text>
                      </Pressable>
                    </ScrollView>
                  ) : null}
                </SafeAreaView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

/**
 * Główna karta predykcji - pokazuje najwyższą pewność
 */
interface TopPredictionCardProps {
  prediction: SinglePrediction;
  tree: Tree | undefined;
  onGoToAtlas: (treeId: string) => void;
}

function TopPredictionCard({ prediction, tree, onGoToAtlas }: TopPredictionCardProps) {
  const images = treeImages[prediction.tree_id] || [];
  const color = getConfidenceColor(prediction.confidence);
  const bgColor = getConfidenceBgColor(prediction.confidence);

  return (
    <View className="bg-gray-50 rounded-2xl">
      {/* Header z procentem i nazwą */}
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-3">
          {/* Procent */}
          <View
            className="flex-row items-center px-3 py-1.5 rounded-full"
            style={{ backgroundColor: bgColor }}
          >
            <View
              className="w-2.5 h-2.5 rounded-full mr-2"
              style={{ backgroundColor: color }}
            />
            <Text
              className="text-lg font-bold"
              style={{ color }}
            >
              {prediction.confidence.toFixed(1)}%
            </Text>
          </View>

          {/* Przycisk do atlasu */}
          <Pressable
            onPress={() => onGoToAtlas(prediction.tree_id)}
            className="flex-row items-center bg-green-600 px-4 py-2 rounded-full"
          >
            <Ionicons name="book-outline" size={16} color="#fff" />
            <Text className="text-white font-medium ml-1.5 text-sm">
              Atlas
            </Text>
          </Pressable>
        </View>

        {/* Nazwa naukowa */}
        <Text className="text-xl font-bold text-gray-900">
          {tree?.scientificName || prediction.predicted_class}
        </Text>

        {/* Nazwa zwyczajowa */}
        <Text className="text-base text-gray-600 mt-0.5">
          {tree?.commonName || ""}
        </Text>
      </View>

      {/* Galeria zdjęć */}
      {images.length > 0 && (
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, height: 100, zIndex: 50 }}
          style={{ marginBottom: 16, zIndex: 50 }}
          renderItem={({ item }) => (
            <Image
              source={item}
              style={{ width: 120, height: 90, borderRadius: 12, zIndex: 0 }}
              resizeMode="cover"
            />
          )}
        />
      )}
    </View>
  );
}

/**
 * Karta dla pozostałych predykcji (mniejsza)
 */
interface SecondaryPredictionCardProps {
  prediction: SinglePrediction;
  tree: Tree | undefined;
  onGoToAtlas: (treeId: string) => void;
}

function SecondaryPredictionCard({ prediction, tree, onGoToAtlas }: SecondaryPredictionCardProps) {
  const images = treeImages[prediction.tree_id] || [];
  const color = getConfidenceColor(prediction.confidence);
  const bgColor = getConfidenceBgColor(prediction.confidence);

  return (
    <Pressable
      onPress={() => onGoToAtlas(prediction.tree_id)}
      className="flex-row items-center bg-white rounded-xl p-3 mb-2 border border-gray-100"
    >
      {/* Zdjęcie */}
      {images.length > 0 ? (
        <Image
          source={images[0]}
          className="w-14 h-14 rounded-lg mr-3"
          resizeMode="cover"
        />
      ) : (
        <View className="w-14 h-14 bg-gray-100 rounded-lg items-center justify-center mr-3">
          <MaterialCommunityIcons name="tree" size={24} color="#00964a" />
        </View>
      )}

      {/* Nazwa */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
          {tree?.scientificName || prediction.predicted_class}
        </Text>
        <Text className="text-sm text-gray-500" numberOfLines={1}>
          {tree?.commonName || ""}
        </Text>
      </View>

      {/* Procent */}
      <View
        className="flex-row items-center px-2.5 py-1 rounded-full mr-2"
        style={{ backgroundColor: bgColor }}
      >
        <View
          className="w-2 h-2 rounded-full mr-1.5"
          style={{ backgroundColor: color }}
        />
        <Text
          className="text-sm font-bold"
          style={{ color }}
        >
          {prediction.confidence.toFixed(1)}%
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </Pressable>
  );
}
