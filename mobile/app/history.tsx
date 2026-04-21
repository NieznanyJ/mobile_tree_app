import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/constants/colors";
import { useAuth } from "@/lib/context/AuthContext";
import { useHistory } from "@/lib/hooks/useHistory";
import { getImageUrl, HistoryItem } from "@/lib/services/historyService";
import { formatDate, getConfidenceColor } from "@/lib/utils/helpers";

const HistoryScreen = () => {
  const { token, isGuest } = useAuth();
  const {
    history,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    refresh,
    deleteItem,
    clearAll,
    isDeleting,
  } = useHistory();

  // Odśwież historię przy wejściu na ekran
  useFocusEffect(
    useCallback(() => {
      if (token && !isGuest) {
        refresh();
      }
    }, [token, isGuest, refresh])
  );

  const handleDeleteItem = (id: number) => {
    Alert.alert(
      "Usuń predykcję",
      "Czy na pewno chcesz usunąć tę predykcję z historii?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteItem(id);
            } catch {
              Alert.alert("Błąd", "Nie udało się usunąć predykcji");
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (history.length === 0) return;

    Alert.alert(
      "Wyczyść historię",
      "Czy na pewno chcesz usunąć całą historię predykcji? Ta operacja jest nieodwracalna.",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Wyczyść",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAll();
            } catch {
              Alert.alert("Błąd", "Nie udało się wyczyścić historii");
            }
          },
        },
      ]
    );
  };

  const handleItemPress = (item: HistoryItem) => {
    router.push(`/prediction/${item.id}`);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const thumbnailUrl = getImageUrl(item.thumbnail_url);

    return (
      <Pressable
        onPress={() => handleItemPress(item)}
        onLongPress={() => handleDeleteItem(item.id)}
        className="bg-white rounded-lg mb-3 shadow-sm overflow-hidden border border-gray-100"
      >
        <View className="flex-row p-4">
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 rounded-lg bg-gray-200 items-center justify-center">
              <MaterialIcons name="image" size={32} color="#9ca3af" />
            </View>
          )}

          <View className="flex-1 ml-4 justify-between">
            <View>
              <Text className="text-lg font-semibold text-textPrimary mb-1">
                {item.predicted_class}
              </Text>
              <Text className="text-sm text-gray-500">
                {formatDate(item.created_at)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text
                className={`text-sm font-semibold ${getConfidenceColor(item.confidence)}`}
              >
                {item.confidence.toFixed(1)}% pewności
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={colors.secondary} />
      </View>
    );
  };

  // Jeśli użytkownik jest gościem, pokaż komunikat
  if (isGuest || !token) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-1 items-center justify-center p-8">
          <MaterialIcons name="history" size={64} color="#d1d5db" />
          <Text className="text-xl text-gray-500 mt-4 mb-2 text-center">
            Historia niedostępna
          </Text>
          <Text className="text-sm text-gray-400 text-center">
            Zaloguj się, aby zobaczyć historię swoich predykcji
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Oblicz statystyki
  const totalPredictions = history.length;
  const uniqueSpecies = new Set(history.map((h) => h.tree_id)).size;
  const avgConfidence =
    totalPredictions > 0
      ? history.reduce((acc, h) => acc + h.confidence, 0) / totalPredictions
      : 0;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1">
        {/* Header with stats */}
        <View className="bg-secondary p-4 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View />
            <Pressable
              onPress={handleClearAll}
              disabled={isDeleting || history.length === 0}
              className="flex-row items-center"
              style={{ opacity: history.length === 0 ? 0.5 : 1 }}
            >
              <MaterialIcons name="delete-sweep" size={20} color="white" />
              <Text className="text-white ml-1 text-sm">Wyczyść</Text>
            </Pressable>
          </View>

          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold text-white">
                {totalPredictions}
              </Text>
              <Text className="text-sm text-white/80">Przewidywań</Text>
            </View>

            <View className="items-center">
              <Text className="text-3xl font-bold text-white">
                {uniqueSpecies}
              </Text>
              <Text className="text-sm text-white/80">Gatunków</Text>
            </View>

            <View className="items-center">
              <Text className="text-3xl font-bold text-white">
                {avgConfidence.toFixed(0)}%
              </Text>
              <Text className="text-sm text-white/80">Śr. pewność</Text>
            </View>
          </View>
        </View>


        {isLoading ? (
          <View className="p-4 gap-3">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
              >
                <View className="flex-row p-4 gap-4">
                  <View className="w-20 h-20 rounded-lg bg-gray-200" />
                  <View className="flex-1 gap-2">
                    <View className="h-4 w-2/3 bg-gray-200 rounded" />
                    <View className="h-3 w-1/2 bg-gray-200 rounded" />
                    <View className="h-3 w-1/3 bg-gray-200 rounded" />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-8">
            <MaterialIcons name="error-outline" size={64} color="#ef4444" />
            <Text className="text-lg text-gray-600 mt-4 mb-2 text-center">
              Wystąpił błąd
            </Text>
            <Text className="text-sm text-gray-400 text-center mb-4">
              {error}
            </Text>
            <Pressable
              onPress={refresh}
              className="bg-secondary px-6 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Spróbuj ponownie</Text>
            </Pressable>
          </View>
        ) : (
          <FlashList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <MaterialIcons name="history" size={64} color="#d1d5db" />
                <Text className="text-xl text-gray-500 mt-4 mb-2">
                  Brak historii
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                  Zrób pierwsze zdjęcie, aby zobaczyć historię przewidywań
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
