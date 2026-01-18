import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { generateThumbnailsBatch } from "@/lib/utils/imageOptimization";
import { useMediaLibrary } from "./useMediaLibrary";

interface CachedAsset extends MediaLibrary.Asset {
  thumbnailUri?: string;
}

export function useMediaLibraryWithCache() {
  const {
    albums,
    assets,
    getAlbums,
    getAssets,
    getRecentAssets,
    permissionResponse,
    requestPermission,
  } = useMediaLibrary();

  const [cachedAssets, setCachedAssets] = useState<CachedAsset[]>([]);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);

  // Generate thumbnails when assets change
  useEffect(() => {
    if (assets.length > 0) {
      generateThumbnails();
    }
  }, [assets]);

  const generateThumbnails = async () => {
    if (assets.length === 0) return;

    setIsGeneratingThumbnails(true);
    try {
      // Convert assets to format expected by generateThumbnailsBatch
      const assetsToProcess = assets.map((asset) => ({
        uri: asset.uri,
        id: asset.id,
      }));

      const thumbnails = await generateThumbnailsBatch(assetsToProcess);

      // Merge thumbnails into assets
      const assetsWithThumbnails: CachedAsset[] = assets.map((asset) => ({
        ...asset,
        thumbnailUri: thumbnails[asset.id],
      }));

      setCachedAssets(assetsWithThumbnails);
    } catch (error) {
      console.error("Failed to generate thumbnails:", error);
      // Fallback to original assets without thumbnails
      setCachedAssets(assets as CachedAsset[]);
    } finally {
      setIsGeneratingThumbnails(false);
    }
  };

  return {
    albums,
    assets: cachedAssets,
    originalAssets: assets,
    getAlbums,
    getAssets,
    getRecentAssets,
    permissionResponse,
    requestPermission,
    isGeneratingThumbnails,
  };
}
