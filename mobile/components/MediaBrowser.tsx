import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import AlbumGrid from "@/components/AlbumGrid";
import ImageModal from "@/components/modals/ImageModal";
import RecentPhotosRow from "@/components/RecentPhotosRow";
import { useMediaLibrary } from "@/lib/hooks/useMediaLibrary";
import { useAssetsStore } from "@/lib/store/assetsStore";
import { useSettingsStore } from "@/lib/store/settingsStore";

const MediaBrowser = () => {
  const { albumsPerPage, enableAlbumGrid, activeWidgets, widgetsEnabled } = useSettingsStore();

  const { albums, getAssets, getAlbums } = useMediaLibrary();
  const { setAlbum } = useAssetsStore();

  const [selectedImage, setSelectedImage] = useState<MediaLibrary.Asset | null>(
    null,
  );

  const handleAlbumSelected = (album: MediaLibrary.Album) => {
    setAlbum(album);
    getAssets(album);
    router.push({
      pathname: "/(media-browser)/[albumId]",
      params: { albumId: album.id },
    });
  };

  const handlePhotoSelected = (asset: MediaLibrary.Asset) => {
    setSelectedImage(asset);
  };

  const renderAlbumGrid = () => {
    if (enableAlbumGrid) {
      return (
        <RecentPhotosRow onPhotoSelected={handlePhotoSelected} />
      );
    }
  };

  return (
    <View className="flex flex-col gap-10">


      {widgetsEnabled && activeWidgets.recentPhotos && renderAlbumGrid()}
      {widgetsEnabled && activeWidgets.albums && (
        <AlbumGrid
          albums={albums}
          onAlbumSelected={handleAlbumSelected}
          onRefresh={getAlbums}
          albumsPerPage={albumsPerPage}
        />
      )}

      <ImageModal
        visible={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onPhotoSelected={setSelectedImage}
        selectedPhoto={selectedImage}
      />
    </View>
  );
};

export default MediaBrowser;
