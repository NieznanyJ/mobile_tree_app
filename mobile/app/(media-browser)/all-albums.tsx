import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AlbumGrid from "@/components/AlbumGrid";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/input/SearchInput";
import { useMediaLibrary } from "@/lib/hooks/useMediaLibrary";
import { useAssetsStore } from "@/lib/store/assetsStore";

export default function AllAlbumsScreen() {
  const [selectedImage, setSelectedImage] = useState<MediaLibrary.Asset | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<MediaLibrary.Album | null>(
    null,
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pickerMode, setPickerMode] = useState(false);
  const [selectedAlbums, setSelectedAlbums] = useState<Set<string>>(new Set());

  const { albums, assets, getAssets, getAlbums } = useMediaLibrary();
  const { setAlbum, addSelectedAlbums, selectedAlbums: storeSelectedAlbums } = useAssetsStore();

  const handleAlbumSelected = (album: MediaLibrary.Album) => {
    if (pickerMode) {
      // In picker mode: toggle selection
      setSelectedAlbums((prev) => {
        const next = new Set(prev);
        next.has(album.id) ? next.delete(album.id) : next.add(album.id);
        return next;
      });
    } else {
      // Normal mode: navigate
      setAlbum(album);
      setSelectedAlbum(album);
      getAssets(album);
      setModalVisible(true);
      router.push(`/(media-browser)/${album.id}`);
    }
  };

  const handleAlbumLongPress = (album: MediaLibrary.Album) => {
    if (!pickerMode) {
      // First long-press: activate picker mode
      setPickerMode(true);
      setSelectedAlbums(new Set([album.id]));
    }
  };

  const handlePhotoSelected = (asset: MediaLibrary.Asset) => {
    setSelectedImage(asset);
    setModalVisible(false);
  };

  const handleAddAlbums = () => {
    // Convert Set to Array and save to store
    const albumsToAdd = albums.filter((album) =>
      selectedAlbums.has(album.id),
    );
    addSelectedAlbums(albumsToAdd);

    // Reset picker mode
    setPickerMode(false);
    setSelectedAlbums(new Set());

    // Go back
    router.back();
  };

  // Load albums when screen comes into focus
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

  const filteredAlbums = albums
    .filter((album) => !storeSelectedAlbums.some((sa) => sa.id === album.id))
    .filter((album) =>
      album.title.toLowerCase().includes(searchText.toLowerCase()),
    );

  return (
    <SafeAreaView className="flex-1 p-4 bg-background">
      <ScrollView>
        {pickerMode && (
          <View className="flex-col gap-2 mb-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold">Wybierz foldery</Text>
              <Button
                title={`Dodaj (${selectedAlbums.size})`}
                className="w-1/4 mt-0"
                textClassName="text-sm"
                onPress={handleAddAlbums}
              />
            </View>
            <Button
              title="Anuluj"
              className="w-full"
              textClassName="text-sm"
              onPress={() => {
                setPickerMode(false);
                setSelectedAlbums(new Set());
              }}
            />
          </View>
        )}

        {loading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="mt-4 text-gray-600">Ładowanie albumów...</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {!pickerMode && (<Text className="p-2">Kliknij i przytrzymaj, aby wybrać wiele albumów</Text>)}
            <SearchInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Szukaj"
              handleReset={() => setSearchText("")}
            />
            <AlbumGrid
              albums={filteredAlbums}
              onAlbumSelected={handleAlbumSelected}
              onAlbumLongPress={handleAlbumLongPress}
              onRefresh={getAlbums}
              albumsPerPage={"all"}
              headerShown={false}
              pickerMode={pickerMode}
              selectedAlbums={selectedAlbums}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
