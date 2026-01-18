import * as MediaLibrary from "expo-media-library";
import { create } from "zustand";

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
  assets: MediaLibrary.Asset[];
  setAssets: (assets: MediaLibrary.Asset[]) => void;
  assetsCount?: number;
  setAssetsCount?: (count: number) => void;
  image: ImageAsset | null;
  setImage: (image: ImageAsset | null) => void;
  album: MediaLibrary.Album | null;
  setAlbum: (album: MediaLibrary.Album | null) => void;
  albumCount?: number;
  setAlbumCount?: (count: number) => void;
}

export const useAssetsStore = create<AssetsStore>((set) => ({
  albums: [],
  setAlbums: (albums) => set({ albums }),
  assets: [],
  setAssets: (assets) => set({ assets }),
  assetsCount: 0,
  setAssetsCount: (count) => set({ assetsCount: count }),
  image: null,
  setImage: (image) => set({ image }),
  album: null,
  setAlbum: (album) => set({ album }),
  albumCount: 0,
  setAlbumCount: (count) => set({ albumCount: count }),
}));
