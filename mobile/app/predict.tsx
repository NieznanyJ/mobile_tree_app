import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PredictionModal from "@/components/modals/PredictionModal";
import Button from "@/components/ui/Button";
import { useAssetsStore } from "@/lib/store/assetsStore";

const PredictPage = () => {
  const { image } = useAssetsStore();
  const [prediction, setPrediction] = React.useState<string | null>(null);

  const predict = () => {
    // Prediction logic will go here
    setPrediction("Dąb szypułkowy"); // Example prediction
  };

  return (
    <SafeAreaView className="flex-1 p-4 flex flex-col items-center justify-between ">
      <View>
        <Text className="text-2xl font-semibold">Sprawdź gatunek drzewa</Text>
      </View>
      <View className="mb-4 w-full h-96  justify-center items-center flex-col gap-4 ">
        <Image
          className="w-full h-full rounded-lg"
          source={{ uri: image?.uri }}
          resizeMode="cover"
        />

        <View className="flex-col justify-between w-full">
          <View className="flex flex-row justify-between items-center w-full">
            <Text>Wybierz inne zdjęcie</Text>
            <Button
              title=""
              className="flex flex-row items-center justify-center gap-0 w-24 h-14 px-0 py-0"
              textClassName=""
              onPress={() => router.push("/(media-browser)/all-photos")}
            >
              <MaterialCommunityIcons
                name="image-outline"
                size={24}
                color="#fff"
              />
            </Button>
          </View>

          <View className="flex flex-row justify-between items-center w-full ">
            <Text>Zdjęcia z aparatu</Text>
            <Button
              title=""
              className="flex flex-row items-center justify-center gap-0 w-24 h-14 px-0 py-0"
              textClassName=""
              onPress={() => router.push("/(tabs)/camera")}
            >
              <Ionicons name="camera-outline" size={24} color="#fff" />
            </Button>
          </View>
        </View>
      </View>

      <Button title="Sprawdź" onPress={predict} />

      <PredictionModal prediction={prediction} setPrediction={setPrediction} />
    </SafeAreaView>
  );
};

export default PredictPage;
