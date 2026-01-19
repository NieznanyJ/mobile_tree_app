import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

import Button from "@/components/ui/Button";
import { useAssetsStore } from "@/lib/store/assetsStore";

const Library = () => {
  const { selectedAssets } = useAssetsStore();
  const router = useRouter();

  const openPicker = () => router.push("/(media-browser)/all-photos");

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold">Twoje zdjęcia</Text>
        <Button title="Dodaj" onPress={openPicker} />
      </View>

      {selectedAssets.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-base text-gray-600 text-center">
            Nie wybrałeś jeszcze zdjęć. Kliknij, aby dodać.
          </Text>
          <Button title="Wybierz z galerii" onPress={openPicker} />
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-8">
          {selectedAssets.map((asset) => (
            <Image
              key={asset.id}
              source={{ uri: asset.uri }}
              style={{ width: 110, height: 110, borderRadius: 12 }}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Library;
