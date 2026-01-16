import * as MediaLibrary from "expo-media-library";
import { Stack, useLocalSearchParams } from "expo-router";
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

  console.log("Rendering AssetModal for album ID:", album);

  const { assets, getAssets } = useMediaLibrary();

  console.log("Album ID in AssetModal:", albumId);
  const [selectedImage, setSelectedImage] = useState<MediaLibrary.Asset | null>(
    null,
  );

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handlePhotoSelect = (asset: MediaLibrary.Asset) => {
    // onPhotoSelected(asset);
    handleClose();
  };

  useEffect(() => {
    if (albumId && album) {
      getAssets(album);
    }
  }, [albumId, album, getAssets]);

  const filteredAssets = assets.filter((asset) =>
    asset.filename.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderContent = () => {
    if (selectedImage) {
      return (
        <ImageModal
          visible={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          onPhotoSelected={setSelectedImage}
          selectedPhoto={selectedImage}
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
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedImage(item)}>
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
