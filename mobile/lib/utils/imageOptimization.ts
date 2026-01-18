import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";

interface CompressedImage {
  originalUri: string;
  compressedUri: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

/**
 * Compresses an image to max 1200x1200px and ~70% quality
 * Optimized for backend transmission to /predict endpoint
 */
export async function compressImage(
  imageUri: string,
): Promise<CompressedImage> {
  try {
    // Get original file size
    const originalInfo = await FileSystem.getInfoAsync(imageUri);
    const originalSize =
      originalInfo.exists && "size" in originalInfo ? originalInfo.size : 0;

    // Get image dimensions
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width: 1200,
            height: 1200,
          },
        },
      ],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
    );

    // Get compressed file size
    const compressedInfo = await FileSystem.getInfoAsync(manipulatedImage.uri);
    const compressedSize =
      compressedInfo.exists && "size" in compressedInfo
        ? compressedInfo.size
        : 0;

    // If "compression" made file larger, use original instead
    const useOriginal = compressedSize >= originalSize;

    return {
      originalUri: imageUri,
      compressedUri: useOriginal ? imageUri : manipulatedImage.uri,
      originalSize,
      compressedSize: useOriginal ? originalSize : compressedSize,
      width: manipulatedImage.width,
      height: manipulatedImage.height,
    };
  } catch (error) {
    console.error("Image compression failed:", error);
    // Fallback: return original if compression fails
    return {
      originalUri: imageUri,
      compressedUri: imageUri,
      originalSize: 0,
      compressedSize: 0,
      width: 0,
      height: 0,
    };
  }
}

/**
 * Calculate compression ratio
 */
export function getCompressionRatio(
  original: number,
  compressed: number,
): number {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Get cache directory path
 */
export async function getCacheDirPath(): Promise<string> {
  // Ensure absolute path - cacheDirectory already includes trailing slash
  const cacheDirPath = `${FileSystem.cacheDirectory}image-thumbnails/`;

  try {
    const dirInfo = await FileSystem.getInfoAsync(cacheDirPath);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(cacheDirPath, {
        intermediates: true,
      });
    }
  } catch (error) {
    // Directory might already exist, ignore error
  }

  return cacheDirPath;
}

/**
 * Generate thumbnail (150x150px) and cache it
 * Returns cached thumbnail URI if available, otherwise null
 */
export async function generateAndCacheThumbnail(
  imageUri: string,
  assetId: string,
): Promise<string | null> {
  try {
    const cacheDir = await getCacheDirPath();
    const thumbnailPath = `${cacheDir}${assetId}-thumb.jpg`;

    // Check if already cached
    const thumbnailInfo = await FileSystem.getInfoAsync(thumbnailPath);
    if (thumbnailInfo.exists) {
      return thumbnailPath;
    }

    // Generate thumbnail
    const thumbnail = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width: 150,
            height: 150,
          },
        },
      ],
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG },
    );

    // Save to cache
    await FileSystem.copyAsync({
      from: thumbnail.uri,
      to: thumbnailPath,
    });

    return thumbnailPath;
  } catch (error) {
    console.error("Thumbnail generation failed:", error);
    return null;
  }
}

/**
 * Batch generate thumbnails for multiple assets
 */
export async function generateThumbnailsBatch(
  assets: Array<{ uri: string; id: string }>,
): Promise<Record<string, string>> {
  const thumbnails: Record<string, string> = {};

  for (const asset of assets) {
    const thumbUri = await generateAndCacheThumbnail(asset.uri, asset.id);
    if (thumbUri) {
      thumbnails[asset.id] = thumbUri;
    }
  }

  return thumbnails;
}

/**
 * Clear old cache files (older than 7 days)
 */
export async function clearOldThumbnailCache(
  daysThreshold: number = 7,
): Promise<void> {
  try {
    const cacheDirPath = await getCacheDirPath();

    const dirInfo = await FileSystem.getInfoAsync(cacheDirPath);
    if (!dirInfo.exists) return;

    const files = await FileSystem.readDirectoryAsync(cacheDirPath);
    const now = new Date().getTime();
    const thresholdMs = daysThreshold * 24 * 60 * 60 * 1000;

    for (const fileName of files) {
      try {
        const filePath = `${cacheDirPath}${fileName}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);

        if (fileInfo.exists && "modificationTime" in fileInfo) {
          const fileModTime = fileInfo.modificationTime
            ? fileInfo.modificationTime * 1000
            : 0;

          if (fileModTime && now - fileModTime > thresholdMs) {
            await FileSystem.deleteAsync(filePath);
            console.log(`Deleted old cache: ${fileName}`);
          }
        }
      } catch (err) {
        console.warn(`Failed to process file: ${fileName}`, err);
      }
    }
  } catch (error) {
    console.error("Cache cleanup failed:", error);
  }
}
