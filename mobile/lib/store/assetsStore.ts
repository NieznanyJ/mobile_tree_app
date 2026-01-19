import * as MediaLibrary from "expo-media-library";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Type for camera-captured photos (before saving to library)
export interface CameraPhoto {
  id: string;
  uri: string;
  mediaType: "photo";
  width: number;
  height: number;
}

// Union type for images that can come from library or camera
export type ImageAsset = MediaLibrary.Asset | CameraPhoto;

interface AssetsStore {
  albums: MediaLibrary.Album[];
  setAlbums: (albums: MediaLibrary.Album[]) => void;
  selectedAlbums: MediaLibrary.Album[];
  addSelectedAlbums: (albums: MediaLibrary.Album[]) => void;
  removeSelectedAlbum: (albumId: string) => void;
  assets: MediaLibrary.Asset[];
  setAssets: (assets: MediaLibrary.Asset[]) => void;
  image: MediaLibrary.Asset | null;
  setImage: (image: MediaLibrary.Asset | null) => void;
  compressedImageUri: string | null;
  setCompressedImageUri: (uri: string | null) => void;
  album: MediaLibrary.Album | null;
  setAlbum: (album: MediaLibrary.Album | null) => void;
  albumCount?: number;
  setAlbumCount?: (count: number) => void;
  selectedAssets: ImageAsset[];
  setSelectedAssets: (assets: ImageAsset[]) => void;
  clearSelectedAssets: () => void;
}

export const useAssetsStore = create<AssetsStore>()(
  persist(
    (set) => ({
      albums: [],
      setAlbums: (albums) => set({ albums }),
      selectedAlbums: [],
      _setSelectedAlbums: (albums) => set({ selectedAlbums: albums }),
      addSelectedAlbums: (albums) =>
        set((state) => ({
          selectedAlbums: [...state.selectedAlbums, ...albums],
        })),
      removeSelectedAlbum: (albumId) =>
        set((state) => ({
          selectedAlbums: state.selectedAlbums.filter(
            (album) => album.id !== albumId,
          ),
        })),
      assets: [],
      setAssets: (assets) => set({ assets }),
      assetsCount: 0,
      setAssetsCount: (count) => set({ assetsCount: count }),
      image: null,
      setImage: (image) => set({ image }),
      compressedImageUri: null,
      setCompressedImageUri: (uri) => set({ compressedImageUri: uri }),
      album: null,
      setAlbum: (album) => set({ album }),
      albumCount: 0,
      setAlbumCount: (count) => set({ albumCount: count }),
      selectedAssets: [],
      setSelectedAssets: (assets) => set({ selectedAssets: assets }),
      clearSelectedAssets: () => set({ selectedAssets: [] }),
    }),
    {
      name: "assets-storage", // unique name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedAlbums: state.selectedAlbums,
        selectedAssets: state.selectedAssets,
      }),
    },
  ),
);
