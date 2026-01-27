import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MAX_PREDICTION_ASSETS, useAssetsStore } from "@/lib/store/assetsStore";

import Button from "../ui/Button";

const { width } = Dimensions.get("window");

interface AssetModalProps {
  visible: boolean;
  onClose: () => void;
  assets: MediaLibrary.Asset[];
  initialIndex: number;
  onConfirm?: (asset: MediaLibrary.Asset) => void;
}

export default function AssetModal({
  visible,
  onClose,
  assets,
  initialIndex,
  onConfirm,
}: AssetModalProps) {
  const { selectedAssets, addAssetForPrediction } = useAssetsStore();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const isFull = selectedAssets.length >= MAX_PREDICTION_ASSETS;

  const handleClose = () => {
    onClose();
  };

  const handlePhotoSelect = (asset: MediaLibrary.Asset | null) => {
    if (!asset) return;
    if (onConfirm) {
      onConfirm(asset);
    } else {
      addAssetForPrediction(asset);
      // Wracamy do predict jeśli jest na stacku, inaczej nawigujemy
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/predict");
      }
    }
    handleClose();
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View className="flex-1 w-full bg-black/80 justify-center items-center">
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          className="absolute inset-0"
        />
        <View className="w-[90%] mx-5 bg-white rounded-2xl overflow-hidden">
          {/* Counter badge */}
          <View className="absolute top-3 right-3 z-10 bg-black/60 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-semibold">
              {selectedAssets.length}/{MAX_PREDICTION_ASSETS}
            </Text>
          </View>

          <FlatList
            data={assets}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            onViewableItemsChanged={onViewableItemsChanged}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{ width: width * 0.9 }}
                className="justify-center items-center"
              >
                <Image
                  source={{ uri: item.uri }}
                  className="w-[90%] rounded-xl"
                  style={{ height: 400 }}
                  resizeMode="contain"
                />
              </View>
            )}
            getItemLayout={(data, index) => ({
              length: width * 0.9,
              offset: width * 0.9 * index,
              index,
            })}
          />

          <View className="flex-col items-center justify-center p-4 gap-3 bg-gray-50 rounded-b-2xl">
            {isFull ? (
              <>
                <Text className="text-gray-500 text-sm">
                  Wybrano już {MAX_PREDICTION_ASSETS} zdjęcia
                </Text>
                <Button
                  title="Przejdź do analizy"
                  onPress={() => {
                    handleClose();
                    router.replace("/predict");
                  }}
                />
              </>
            ) : (
              <Button
                title="Dodaj to zdjęcie"
                onPress={() => handlePhotoSelect(assets[currentIndex])}
              />
            )}
            <TouchableOpacity
              onPress={handleClose}
              activeOpacity={0.7}
              className="py-2"
            >
              <Text className="text-center text-gray-500">Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
