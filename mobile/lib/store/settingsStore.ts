import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AtlasViewMode = "cards" | "list";

interface SettingsStore {
  albumsPerPage: number;
  setAlbumsPerPage: (count: number) => void;
  imagesPerPage: number;
  setImagesPerPage: (count: number) => void;
  displayOption: string;
  setDisplayOption: (option: string) => void;
  enableAlbumGrid: boolean;
  setEnableAlbumGrid: (enabled: boolean) => void;
  enableTreeFacts: boolean;
  setEnableTreeFacts: (enabled: boolean) => void;
  widgetsEnabled: boolean;
  setWidgetsEnabled: (enabled: boolean) => void;
  activeWidgets: Record<string, boolean>;
  toggleWidget: (widgetId: string) => void;
  atlasViewMode: AtlasViewMode;
  setAtlasViewMode: (mode: AtlasViewMode) => void;
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
      enableAlbumGrid: true,
      setEnableAlbumGrid: (enabled) => set({ enableAlbumGrid: enabled }),
      enableTreeFacts: true,
      setEnableTreeFacts: (enabled) => set({ enableTreeFacts: enabled }),
      widgetsEnabled: true,
      setWidgetsEnabled: (enabled) => set({ widgetsEnabled: enabled }),
      activeWidgets: {
        treeFacts: true,
        recentPhotos: true,
        albums: true,
      },
      toggleWidget: (widgetId) =>
        set((state) => ({
          activeWidgets: {
            ...state.activeWidgets,
            [widgetId]: !state.activeWidgets[widgetId],
          },
        })),
      atlasViewMode: "cards",
      setAtlasViewMode: (mode) => set({ atlasViewMode: mode }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
