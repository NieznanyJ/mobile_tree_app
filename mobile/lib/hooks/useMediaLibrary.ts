import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";

export function useMediaLibrary() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

  async function getAlbums() {
    if (
      permissionResponse?.status !== "granted" &&
      permissionResponse?.canAskAgain
    ) {
      const permission = await requestPermission();
      if (!permission.granted) {
        // User denied permission, do nothing or show a message
        return;
      }
    }
    // Check if permission is granted before fetching
    if (permissionResponse?.status === "granted") {
      const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
      });
      setAlbums(fetchedAlbums);
    }
  }

  async function getAssets(album: MediaLibrary.Album) {
    const albumAssets = await MediaLibrary.getAssetsAsync({
      album: album.id,
      first: 100,
      sortBy: [MediaLibrary.SortBy.creationTime],
      mediaType: [MediaLibrary.MediaType.photo],
    });
    setAssets(albumAssets.assets);
    return albumAssets.assets; // Return assets directly for immediate use
  }

  async function getRecentAssets(count: number = 10) {
    if (
      permissionResponse?.status !== "granted" &&
      permissionResponse?.canAskAgain
    ) {
      const permission = await requestPermission();
      if (!permission.granted) {
        return [];
      }
    }
    if (permissionResponse?.status === "granted") {
      const recentAssets = await MediaLibrary.getAssetsAsync({
        first: count,
        sortBy: [MediaLibrary.SortBy.creationTime],
        mediaType: [MediaLibrary.MediaType.photo],
      });
      return recentAssets.assets;
    }
    return [];
  }

  useEffect(() => {
    getAlbums();
  }, [permissionResponse?.status]); // Re-run only when permission status changes

  return {
    albums,
    assets,
    getAssets,
    getAlbums,
    getRecentAssets,
    permissionResponse,
    requestPermission,
  };
}
