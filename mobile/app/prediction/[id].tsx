import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ImagePreviewModal from "@/components/modals/ImagePreviewModal";
import Button from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { useAuth } from "@/lib/context/AuthContext";
import { useImagePreview } from "@/lib/hooks/useImagePreview";
import {
  deletePrediction,
  fetchPredictionDetail,
  getImageUrl,
  HistoryDetail,
} from "@/lib/services/historyService";
import { formatDate, getConfidenceColor } from "@/lib/utils/helpers";

export default function PredictionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();

  const preview = useImagePreview();
  const [prediction, setPrediction] = useState<HistoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadPrediction = async () => {
      if (!token || !id) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchPredictionDetail(token, parseInt(id, 10));
        setPrediction(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Wystąpił błąd");
      } finally {
        setIsLoading(false);
      }
    };

    loadPrediction();
  }, [token, id]);


  const handleDelete = () => {
    Alert.alert(
      "Usuń predykcję",
      "Czy na pewno chcesz usunąć tę predykcję z historii?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            if (!token || !id) return;

            setIsDeleting(true);
            try {
              await deletePrediction(token, parseInt(id, 10));
              router.back();
            } catch {
              Alert.alert("Błąd", "Nie udało się usunąć predykcji");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleOpenAtlas = (treeId: string) => {
    router.push(`/tree/${treeId}`);
  };

  const filteredPredictions = prediction?.all_predictions.some(
    (pred) => pred.confidence >= 100
  )
    ? prediction?.all_predictions.filter((pred) => pred.confidence >= 100)
    : prediction?.all_predictions.filter((pred) => pred.confidence > 0);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Stack.Screen options={{ headerTitle: "Ładowanie..." }} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !prediction) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Stack.Screen options={{ headerTitle: "Błąd" }} />
        <View className="flex-1 items-center justify-center p-8">
          <MaterialIcons name="error-outline" size={64} color={colors.error} />
          <Text className="text-lg text-gray-600 mt-4 mb-2 text-center">
            {error || "Nie znaleziono predykcji"}
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="bg-secondary px-6 py-2 rounded-lg mt-4"
          >
            <Text className="text-white font-semibold">Wróć</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-background">
        <Stack.Screen
          options={{
            headerTitle: "Szczegóły predykcji",
            headerRight: () => (
              <Pressable
                onPress={handleDelete}
                disabled={isDeleting}
                className="mr-4"
              >
                <MaterialIcons
                  name="delete-outline"
                  size={24}
                  color={isDeleting ? colors.gray[400] : colors.error}
                />
              </Pressable>
            ),
          }}
        />

        <ScrollView className="flex-1">
          {/* Główna predykcja */}
          <View className="bg-secondary p-6">
            <Text className="text-white text-2xl font-bold text-center">
              {prediction.predicted_class}
            </Text>
            <View className="flex-row items-center justify-center mt-2">
              <Text
                className="text-white text-4xl font-bold"
              >
                {prediction.confidence.toFixed(1)}%
              </Text>
              <Text className="text-white/80 ml-2">pewności</Text>
            </View>
            <Text className="text-white/60 text-center mt-2">
              {formatDate(prediction.created_at)}
            </Text>
          </View>

          {/* Zdjęcia */}
          <View className="p-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="images-outline" size={20} color={colors.secondary} />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Zdjęcia ({prediction.image_urls.length})
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {prediction.image_urls.map((url, index) => (
                <Pressable key={index} onPress={() => preview.open(index)}>
                  <Image
                    source={{ uri: getImageUrl(url) }}
                    className="w-40 h-40 rounded-xl mr-3"
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Wszystkie predykcje */}
          <View className="p-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="analytics-outline" size={20} color={colors.secondary} />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Wszystkie wyniki
              </Text>
            </View>

            <View className="bg-white rounded-xl overflow-hidden border border-gray-100">
              {filteredPredictions?.map((pred, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleOpenAtlas(pred.tree_id)}
                  className={`flex-row items-center justify-between p-4 ${index < filteredPredictions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                    }`}
                >
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-800">
                      {index + 1}. {pred.predicted_class}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text
                      className="text-lg font-bold mr-2"
                      style={{ color: getConfidenceColor(pred.confidence) }}
                    >
                      {pred.confidence.toFixed(1)}%
                    </Text>
                    <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Przycisk do atlasu */}
          <View className="p-4 pb-8">
            <Button
              title="Zobacz w atlasie drzew"
              onPress={() => handleOpenAtlas(prediction.tree_id)}
              className="w-full"
            >
              <Ionicons name="book-outline" size={20} color="white" />

            </Button>
          </View>
        </ScrollView>

      </SafeAreaView>
      <ImagePreviewModal
        visible={preview.isVisible}
        images={prediction.image_urls.map((a) => ({ uri: getImageUrl(a) }))}
        initialIndex={preview.currentIndex}
        onClose={preview.close}
      />
    </>
  );

}
