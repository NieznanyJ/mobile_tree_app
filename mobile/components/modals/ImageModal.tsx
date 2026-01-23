import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, { useRef, useState, useCallback } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  FlatList,
} from "react-native";

import { useAssetsStore } from "@/lib/store/assetsStore";
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
  const { setImage } = useAssetsStore();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleClose = () => {
    onClose();
  };

  const handlePhotoSelect = (asset: MediaLibrary.Asset | null) => {
    if (!asset) return;
    if (onConfirm) {
      onConfirm(asset);
    } else {
      setImage(asset);
      router.push("/predict");
    }
    handleClose();
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  // const viewabilityConfig = {
  //   itemVisiblePercentThreshold: 50,
  // };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.modalContent}>
          <FlatList
            data={assets}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            onViewableItemsChanged={onViewableItemsChanged}
            // viewabilityConfig={viewabilityConfig}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            )}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
          <View className="flex flex-col items-center justify-center p-4 gap-3">
            <Button
              title="Użyj tego zdjęcia"
              onPress={() => handlePhotoSelect(assets[currentIndex])}
            />
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    width: width * 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "90%",
    height: 400,
    borderRadius: 12,
  },
});
