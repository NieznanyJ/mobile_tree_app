import * as MediaLibrary from "expo-media-library";
import { create } from "zustand";

interface AssetsStore {
  albums: MediaLibrary.Album[];
  setAlbums: (albums: MediaLibrary.Album[]) => void;
  assets: MediaLibrary.Asset[];
  setAssets: (assets: MediaLibrary.Asset[]) => void;
  image: MediaLibrary.Asset | null;
  setImage: (image: MediaLibrary.Asset | null) => void;
  album: MediaLibrary.Album | null;
  setAlbum: (album: MediaLibrary.Album | null) => void;
}

export const useAssetsStore = create<AssetsStore>((set) => ({
  albums: [],
  setAlbums: (albums) => set({ albums }),
  assets: [],
  setAssets: (assets) => set({ assets }),
  image: null,
  setImage: (image) => set({ image }),
  album: null,
  setAlbum: (album) => set({ album }),
}));
