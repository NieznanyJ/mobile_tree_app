import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from "react-native";

import { useAssetsStore } from "@/lib/store/assetsStore";
import Button from "../ui/Button";

interface AssetModalProps {
  visible: boolean;
  onClose: () => void;
  onPhotoSelected: (asset: MediaLibrary.Asset | null) => void;
  selectedPhoto?: MediaLibrary.Asset | null;
}

export default function AssetModal({
  visible,
  onClose,
  onPhotoSelected,
  selectedPhoto,
}: AssetModalProps) {
  const { image, setImage } = useAssetsStore();
  const router = useRouter();

  const handleClose = () => {
    onClose();
  };

  const handlePhotoSelect = (asset: MediaLibrary.Asset | null) => {
    setImage(asset);
    router.push("/predict");
    handleClose();
  };


  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View
        className="flex-1 bg-black/50 justify-center items-center p-4"
        onTouchEnd={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          className="absolute inset-0"
        />
        <View className="bg-white rounded-2xl overflow-hidden w-full max-w-sm p-4 z-10">
          <Image
            source={{ uri: selectedPhoto?.uri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <View className="flex flex-col items-center justify-centerp-4 gap-3">
            <Button
              title="Użyj tego zdjęcia"
              onPress={() => handlePhotoSelect(selectedPhoto!)}
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
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  assetTile: {
    width: Dimensions.get("window").width / 3 - 16,
    height: Dimensions.get("window").width / 3 - 16,
    margin: 2,
    borderRadius: 5,
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,

  },
});
