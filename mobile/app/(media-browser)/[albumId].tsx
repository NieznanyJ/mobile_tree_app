import * as MediaLibrary from "expo-media-library";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ImageModal from "@/components/modals/ImageModal";
import SearchInput from "@/components/ui/input/SearchInput";
import { useMediaLibrary } from "@/lib/hooks/useMediaLibrary";
import { useAssetsStore } from "@/lib/store/assetsStore";

interface AssetModalProps {
  visible: boolean;
  album: MediaLibrary.Album | null;
  assets: MediaLibrary.Asset[];
  onClose: () => void;
  onPhotoSelected: (asset: MediaLibrary.Asset) => void;
}

export default function AlbumPage() {
  const { albumId } = useLocalSearchParams();
  const { album } = useAssetsStore();
  const [searchText, setSearchText] = useState("");
  const { addAssetForPrediction, selectedAssets } = useAssetsStore();

  const { assets, getAssets } = useMediaLibrary();

  const [selectedImageData, setSelectedImageData] = useState<{
    assets: MediaLibrary.Asset[];
    index: number;
  } | null>(null);

  const handleClose = () => {
    setSelectedImageData(null);
  };

  const handlePhotoSelect = (asset: MediaLibrary.Asset) => {
    addAssetForPrediction(asset);
    handleClose();
    router.push("/predict");
  };

  useEffect(() => {
    if (albumId && album) {
      getAssets(album);
    }
  }, [albumId, album, getAssets]);

  const filteredAssets = assets.filter((asset) =>
    selectedAssets.some(selected => selected.uri !== asset.uri) && asset.filename.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderContent = () => {
    if (selectedImageData) {
      return (
        <ImageModal
          visible={!!selectedImageData}
          onClose={handleClose}
          assets={selectedImageData.assets}
          initialIndex={selectedImageData.index}
          onConfirm={handlePhotoSelect}
        />
      );
    }

    return (
      <View className="flex flex-col w-full gap-4">
        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Szukaj"
          handleReset={() => setSearchText("")}
        />
        <FlatList
          key="asset-grid"
          data={filteredAssets}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                setSelectedImageData({ assets: filteredAssets, index })
              }
            >
              <Image source={{ uri: item.uri }} style={styles.assetTile} />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle:
            `${album?.title} (${album?.assetCount})` || "Ładowanie...",
          headerTitleAlign: "center",
        }}
      />
      <SafeAreaView className="flex-1 bg-background p-4">
        {renderContent()}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
