import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PredictionModal from "@/components/modals/PredictionModal";
import Button from "@/components/ui/Button";
import { useAssetsStore } from "@/lib/store/assetsStore";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

const PredictPage = () => {
  const { image } = useAssetsStore();
  const [prediction, setPrediction] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const predict = async () => {
    if (!image) return;
    setIsLoading(true);
    try {
      // TODO: Integrate with /predict API
      await new Promise((resolve) => setTimeout(resolve, 900));
      setPrediction("Dąb szypułkowy"); // placeholder wynik
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 flex flex-col items-center justify-between ">
      {isLoading && <LoadingOverlay text="Analizujemy zdjęcie..." />}
      {/* <View>
        <Text className="text-2xl font-semibold">Sprawdź gatunek drzewa</Text>
      </View> */}
      <View className="mb-4 w-full flex-1 justify-center items-center flex-col gap-4 ">
        <View className="flex-1 h-full w-full rounded-lg">
          <Image
            className="rounded-lg h-full w-full"
            source={{ uri: image?.uri }}
            resizeMode="cover"
          />
        </View>

        <View className="flex-col justify-between w-full gap-4 py-4">
          <View className="flex flex-row justify-between items-center w-full">
            <Text>Wybierz inne zdjęcie</Text>
            <Pressable className="bg-secondary p-2 rounded-full" onPress={() => router.push("/(media-browser)/all-photos")} >
              <MaterialCommunityIcons
                name="image-outline"
                size={24}
                color="#fff"
              />
            </Pressable>
          </View>

          <View className="flex flex-row justify-between items-center w-full ">
            <Text>Zdjęcia z aparatu</Text>
            <Pressable className="bg-secondary p-2 rounded-full" onPress={() => router.push("/(tabs)/camera")} >
              <Ionicons name="camera-outline" size={24} color="#fff" />
            </Pressable>

          </View>
        </View>
      </View>

      <Button title="Sprawdź" onPress={predict} isLoading={isLoading} disabled={!image} />

      <PredictionModal prediction={prediction} setPrediction={setPrediction} />
    </SafeAreaView>
  );
};

export default PredictPage;
