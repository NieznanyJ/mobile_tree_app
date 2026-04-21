import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AlbumGrid from "@/components/AlbumGrid";
import AlbumGridSkeleton from "@/components/skeletons/AlbumGridSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import Checkbox from "@/components/ui/input/Checkbox";
import SearchInput from "@/components/ui/input/SearchInput";
import { useMediaLibrary } from "@/lib/hooks/useMediaLibrary";
import { useAssetsStore } from "@/lib/store/assetsStore";
import { useSettingsStore } from "@/lib/store/settingsStore";

export default function AllAlbumsScreen() {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pickerMode, setPickerMode] = useState(false);
  const [selectedAlbums, setSelectedAlbums] = useState<Set<string>>(new Set());

  const { albums, getAssets, getAlbums } = useMediaLibrary();
  const { setAlbum, addSelectedAlbums, selectedAlbums: storeSelectedAlbums } = useAssetsStore();
  const { displayOption, setDisplayOption, widgetsEnabled, activeWidgets } = useSettingsStore();

  const albumWidgetEnabled = widgetsEnabled && activeWidgets.albums;

  const handleAlbumSelected = (album: MediaLibrary.Album) => {
    if (pickerMode) {
      setSelectedAlbums((prev) => {
        const next = new Set(prev);
        next.has(album.id) ? next.delete(album.id) : next.add(album.id);
        return next;
      });
    } else {
      setAlbum(album);
      getAssets(album);
      router.push(`/(media-browser)/${album.id}`);
    }
  };

  const handleAlbumLongPress = albumWidgetEnabled
    ? (album: MediaLibrary.Album) => {
        if (!pickerMode) {
          setPickerMode(true);
          setSelectedAlbums(new Set([album.id]));
        }
      }
    : undefined;

  const handleAddAlbums = () => {
    const albumsToAdd = albums.filter((album) =>
      selectedAlbums.has(album.id),
    );
    addSelectedAlbums(albumsToAdd);
    setPickerMode(false);
    setSelectedAlbums(new Set());
    router.back();
  };

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const allSelected = filteredAlbums.length > 0 && filteredAlbums.every((a) => selectedAlbums.has(a.id));

  const checkAll = () => {
    if (allSelected) {
      setSelectedAlbums(new Set());
    } else {
      setSelectedAlbums(new Set(filteredAlbums.map((a) => a.id)));
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAlbums = async () => {
        setLoading(true);
        await getAlbums();
        setLoading(false);
      };
      fetchAlbums();
    }, [getAlbums])
  );



  return (
    <SafeAreaView className="flex-1 p-4 bg-background">
      {!pickerMode && albumWidgetEnabled && (
        <Text className="text-xs text-gray-400 mb-2">
          Przytrzymaj folder, aby dodać do widgetu na ekranie głównym
        </Text>
      )}
      {pickerMode && (
        <View className="flex-col gap-2 mb-3">
          <Text className="text-lg font-semibold">Wybierz foldery</Text>
          <View className="flex-row items-center justify-between">
            <Pressable className="flex flex-row items-center gap-2 flex-1" onPress={checkAll}>
              <View pointerEvents="none">
                <Checkbox setIsChecked={() => { }} isChecked={allSelected} />
              </View>
              <Text>{allSelected ? "Odznacz wszystkie" : "Zaznacz wszystkie"}</Text>
            </Pressable>

            <Pressable
              className="bg-secondary px-4 py-3 rounded-full flex-row items-center justify-end"
              onPress={handleAddAlbums}
            >
              <Text className="text-white text-lg w-24">{`Dodaj (${selectedAlbums.size})`}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {loading ? (
        <AlbumGridSkeleton />
      ) : (
        <View className="flex flex-1 flex-col gap-4">
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Szukaj"
            handleReset={() => setSearchText("")}
            showDisplayButton={!pickerMode}
            onPress={setDisplayOption}
            displayOption={displayOption}
          />
          {filteredAlbums.length === 0 ? (
            <EmptyState
              icon={<Ionicons name="folder-open-outline" size={28} color="#9ca3af" />}
              text="Nie znaleziono folderów"
            />
          ) : (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
              <AlbumGrid
                albums={filteredAlbums}
                onAlbumSelected={handleAlbumSelected}
                onAlbumLongPress={handleAlbumLongPress}
                onRefresh={getAlbums}
                albumsPerPage="all"
                headerShown={false}
                pickerMode={pickerMode}
                selectedAlbums={selectedAlbums}
              />
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
