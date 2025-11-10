import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsStore {
  albumsPerPage: number;
  setAlbumsPerPage: (count: number) => void;
  imagesPerPage: number;
  setImagesPerPage: (count: number) => void;
  displayOption: string;
  setDisplayOption: (option: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      albumsPerPage: 4,
      setAlbumsPerPage: (count) => set({ albumsPerPage: count }),
      imagesPerPage: 10,
      setImagesPerPage: (count) => set({ imagesPerPage: count }),
      displayOption: "grid",
      setDisplayOption: (option) => set({ displayOption: option }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
