import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { useState } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";

import AlbumGrid from "@/components/AlbumGrid";
import ImageModal from "@/components/modals/ImageModal";
import RecentPhotosRow from "@/components/RecentPhotosRow";
import { useMediaLibrary } from "@/lib/hooks/useMediaLibrary";
import { useAssetsStore } from "@/lib/store/assetsStore";
import { useSettingsStore } from "@/lib/store/settingsStore";
import Button from "@/components/ui/Button";

const MediaBrowser = () => {
  const { albumsPerPage, enableAlbumGrid, activeWidgets, widgetsEnabled } =
    useSettingsStore();

  const { albums, getAssets, getAlbums } = useMediaLibrary();
  const {
    setAlbum,
    selectedAssets,
    selectedAlbums,
    removeSelectedAlbum,
  } = useAssetsStore();

  const [selectedImageData, setSelectedImageData] = useState<{
    assets: MediaLibrary.Asset[];
    index: number;
  } | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleAlbumSelected = (album: MediaLibrary.Album) => {
    if (editMode) return;
    setAlbum(album);
    getAssets(album);
    router.push({
      pathname: "/(media-browser)/[albumId]",
      params: { albumId: album.id },
    });
  };

  const handlePhotoSelected = (asset: MediaLibrary.Asset, index: number) => {
    setSelectedImageData({ assets: selectedAssets as MediaLibrary.Asset[], index });
  };

  const handleOpenPicker = () => {
    router.push("/(media-browser)/all-photos");
  };

  const renderAlbumGrid = () => {
    if (enableAlbumGrid) {
      return <RecentPhotosRow onPhotoSelected={handlePhotoSelected} />;
    }
  };

  return (
    <View className="flex flex-col gap-10">
      {widgetsEnabled && activeWidgets.recentPhotos && renderAlbumGrid()}
      <TouchableOpacity
        onLongPress={() => setEditMode(true)}
        activeOpacity={0.7}
      >
        {editMode && (
          <View className="flex-row justify-end mb-4">
            <Button
              title="Zakończ edycję"
              onPress={() => setEditMode(false)}
              className="w-auto px-4 mt-0"
              textClassName="text-sm"
            />
          </View>
        )}
        {widgetsEnabled && activeWidgets.albums && (
          <AlbumGrid
            albums={albums}
            onAlbumSelected={handleAlbumSelected}
            onRefresh={getAlbums}
            albumsPerPage={albumsPerPage}
            selectedAlbumsToDisplay={selectedAlbums}
            editMode={editMode}
            onRemoveAlbum={removeSelectedAlbum}
          />
        )}
      </TouchableOpacity>

      {selectedImageData && (
        <ImageModal
          visible={!!selectedImageData}
          onClose={() => setSelectedImageData(null)}
          assets={selectedImageData.assets}
          initialIndex={selectedImageData.index}
        />
      )}
    </View>
  );
};

export default MediaBrowser;
