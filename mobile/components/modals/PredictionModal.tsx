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
import { getConfidenceBgColor, getConfidenceColor } from "@/lib/utils/helpers";
import { PredictionModalProps, SecondaryPredictionCardProps, Tree } from "@/types/components";



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

  let predictions = prediction?.predictions || [];

  if (predictions.length > 0 && predictions[0].confidence >= 99) {
    predictions = [predictions[0]];
  } else {
    predictions = predictions.slice(0, 3);
  }

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
                      <TopPredictionCard
                        prediction={predictions[0]}
                        tree={getTreeData(predictions[0].tree_id)}
                        onGoToAtlas={handleGoToAtlas}
                      />

                      {predictions.length > 1 && (
                        <View className="mt-4">
                          <Text className="text-sm text-gray-500 mb-2 px-1">
                            Inne możliwości
                          </Text>
                          {predictions.slice(1).map((pred: PredictionResult) => (
                            <SecondaryPredictionCard
                              key={pred.tree_id}
                              prediction={pred}
                              tree={getTreeData(pred.tree_id)}
                              onGoToAtlas={handleGoToAtlas}
                            />
                          ))}
                        </View>
                      )}

                      <Pressable
                        onPress={handleClose}
                        className="mt-4 mb-2 py-3 items-center"
                      >
                        <Text className="text-gray-500 text-sm">Zamknij</Text>
                      </Pressable>
                    </ScrollView>
                  ) : (
                    <View className="px-6 py-8 items-center">
                      <Text className="text-lg font-semibold text-gray-800 mt-4 text-center">
                        Nie rozpoznano drzewa
                      </Text>
                      <Text className="text-sm text-gray-500 mt-2 text-center">
                        Upewnij się że zdjęcie przedstawia drzewo i spróbuj ponownie
                      </Text>
                      <Pressable
                        onPress={handleClose}
                        className="mt-6 py-3 px-8 bg-gray-100 rounded-full"
                      >
                        <Text className="text-gray-600 text-sm font-medium">Zamknij</Text>
                      </Pressable>
                    </View>
                  )}
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
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-3">
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

        <Text className="text-xl font-bold text-gray-900">
          {tree?.scientificName || prediction.predicted_class}
        </Text>

        <Text className="text-base text-gray-600 mt-0.5">
          {tree?.commonName || ""}
        </Text>
      </View>

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
function SecondaryPredictionCard({ prediction, tree, onGoToAtlas }: SecondaryPredictionCardProps) {
  const images = treeImages[prediction.tree_id] || [];
  const color = getConfidenceColor(prediction.confidence);
  const bgColor = getConfidenceBgColor(prediction.confidence);

  return (
    <Pressable
      onPress={() => onGoToAtlas(prediction.tree_id)}
      className="flex-row items-center bg-white rounded-xl p-3 mb-2 border border-gray-100"
    >
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

      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
          {tree?.scientificName || prediction.predicted_class}
        </Text>
        <Text className="text-sm text-gray-500" numberOfLines={1}>
          {tree?.commonName || ""}
        </Text>
      </View>

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
