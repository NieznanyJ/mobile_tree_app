import * as MediaLibrary from "expo-media-library";
import { useCallback, useState } from "react";

export function useMediaLibrary() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
    mediaTypes: MediaLibrary.MediaType.photo,
  });
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

  const getAlbums = useCallback(async () => {
    if (permissionResponse?.status === "granted") {
      const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
      });

      // Filter albums to show only those with photos
      const albumsWithPhotos = await Promise.all(
        fetchedAlbums.map(async (album) => {
          const albumAssets = await MediaLibrary.getAssetsAsync({
            album: album.id,
            first: 1,
            mediaType: [MediaLibrary.MediaType.photo],
          });
          return { album, hasPhotos: albumAssets.assets.length > 0 };
        }),
      );

      const filtered = albumsWithPhotos
        .filter(({ hasPhotos }) => hasPhotos)
        .map(({ album }) => album);

      setAlbums(filtered);
    }
  }, [permissionResponse?.status]);

  const getAssets = useCallback(async (album: MediaLibrary.Album) => {
    const albumAssets = await MediaLibrary.getAssetsAsync({
      album: album.id,
      first: 100,
      sortBy: [MediaLibrary.SortBy.creationTime],
      mediaType: [MediaLibrary.MediaType.photo],
    });
    setAssets(albumAssets.assets);
    return albumAssets.assets; // Return assets directly for immediate use
  }, []);

  const getRecentAssets = useCallback(async (count: number = 10) => {
    if (permissionResponse?.status === "granted") {
      const recentAssets = await MediaLibrary.getAssetsAsync({
        first: count,
        sortBy: [MediaLibrary.SortBy.creationTime],
        mediaType: [MediaLibrary.MediaType.photo],
      });
      return recentAssets.assets;
    }
    return [];
  }, [permissionResponse?.status]);

  // Don't auto-fetch albums anymore - only fetch when explicitly requested
  // This way albums are not loaded on app startup

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
