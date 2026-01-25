import Ionicons from "@expo/vector-icons/Ionicons";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import AlbumGrid from "@/components/AlbumGrid";
import ImageModal from "@/components/modals/ImageModal";
import RecentPhotosRow from "@/components/RecentPhotosRow";
import Button from "@/components/ui/Button";
import { useMediaLibrary } from "@/lib/hooks/useMediaLibrary";
import { useAssetsStore } from "@/lib/store/assetsStore";
import { useSettingsStore } from "@/lib/store/settingsStore";

interface MediaBrowserProps {
  permissionResponse: MediaLibrary.PermissionResponse | null;
  requestPermission: () => Promise<void>;
}

const MediaBrowser = ({ permissionResponse, requestPermission }: MediaBrowserProps) => {
  const { albumsPerPage, activeWidgets, widgetsEnabled } =
    useSettingsStore();

  const { albums, getAssets, getAlbums } = useMediaLibrary();
  const {
    setAlbum,
    recentImages,
    selectedAlbums,
    removeSelectedAlbum,
  } = useAssetsStore();

  const [selectedImageData, setSelectedImageData] = useState<{
    assets: MediaLibrary.Asset[];
    index: number;
  } | null>(null);
  const [editMode, setEditMode] = useState(false);

  const isPermissionGranted = permissionResponse?.status === "granted";

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
    setSelectedImageData({ assets: recentImages as MediaLibrary.Asset[], index });
  };

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  if (!isPermissionGranted) {
    const showPhotos = widgetsEnabled && activeWidgets.recentPhotos;
    const showAlbums = widgetsEnabled && activeWidgets.albums;

    if (!showPhotos && !showAlbums) return null;

    const canAskAgain = permissionResponse?.canAskAgain !== false;

    return (
      <View className="items-center gap-4 mt-6 px-4 py-8 bg-gray-50 rounded-2xl mx-2">
        <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center">
          <Ionicons name="images-outline" size={32} color="#9ca3af" />
        </View>
        <Text className="text-base text-gray-600 text-center">
          {canAskAgain
            ? "Udziel dostępu do galerii, aby wyświetlić zdjęcia i foldery"
            : "Dostęp do galerii został odmówiony. Zmień uprawnienia w ustawieniach."}
        </Text>
        <Button
          title={canAskAgain ? "Udziel dostępu" : "Otwórz ustawienia"}
          onPress={handleRequestPermission}
          className="mt-2"
        />
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-10">
      {widgetsEnabled && activeWidgets.recentPhotos && (
        <RecentPhotosRow onPhotoSelected={handlePhotoSelected} />
      )}
      <Pressable
        onLongPress={() => setEditMode(true)}
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
      </Pressable>

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
