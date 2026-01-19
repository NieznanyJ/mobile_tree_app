import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import GoBackButton from "@/components/ui/GoBackButton";

import ImageModal from "./ImageModal";

interface AssetModalProps {
  visible: boolean;
  album: MediaLibrary.Album | null;
  assets: MediaLibrary.Asset[];
  onClose: () => void;
  onPhotoSelected: (asset: MediaLibrary.Asset) => void;
}

export default function AssetModal({
  visible,
  album,
  assets,
  onClose,
  onPhotoSelected,
}: AssetModalProps) {
  const [selectedImageData, setSelectedImageData] = useState<{
    assets: MediaLibrary.Asset[];
    index: number;
  } | null>(null);

  const handleClose = () => {
    setSelectedImageData(null);
    onClose();
  };

  const handlePhotoPress = (asset: MediaLibrary.Asset, index: number) => {
    setSelectedImageData({ assets, index });
  };

  const renderContent = () => {
    if (selectedImageData) {
      return (
        <ImageModal
          visible={!!selectedImageData}
          onClose={() => setSelectedImageData(null)}
          assets={selectedImageData.assets}
          initialIndex={selectedImageData.index}
          onConfirm={onPhotoSelected}
        />
      );
    }

    return (
      <View style={styles.container}>
        <GoBackButton onPress={handleClose} />
        <View className="flex flex-row items-center justify-between">
          <Text style={styles.title}>{album?.title}</Text>
          <Text className="text-sm ">
            {album?.assetCount}{" "}
            {album?.assetCount === 1 ? "zdjęcie" : "zdjęcia"}
          </Text>
        </View>
        <FlatList
          key="asset-grid"
          data={assets}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handlePhotoPress(item, index)}>
              <Image source={{ uri: item.uri }} style={styles.assetTile} />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      {renderContent()}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
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
  fullScreenImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    marginVertical: 10,
    borderRadius: 10,
  },
});
