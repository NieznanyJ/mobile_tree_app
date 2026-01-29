import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AlbumGrid from "@/components/AlbumGrid";
import AlbumGridSkeleton from "@/components/skeletons/AlbumGridSkeleton";
import Button from "@/components/ui/Button";
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
  const { displayOption, setDisplayOption } = useSettingsStore();

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

  const handleAlbumLongPress = (album: MediaLibrary.Album) => {
    if (!pickerMode) {
      setPickerMode(true);
      setSelectedAlbums(new Set([album.id]));
    }
  };

  const handleAddAlbums = () => {
    const albumsToAdd = albums.filter((album) =>
      selectedAlbums.has(album.id),
    );
    addSelectedAlbums(albumsToAdd);
    setPickerMode(false);
    setSelectedAlbums(new Set());
    router.back();
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
      {pickerMode && (
        <View className="flex-col gap-2 mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold">Wybierz foldery</Text>

          </View>
          <View className="flex flex-row items-center justify-between gap-2">
            <Button
              title="Anuluj"
              variant="outline"
              className="flex-1 w-full mt-0 p-0"
              textClassName="text-sm"
              onPress={() => {
                setPickerMode(false);
                setSelectedAlbums(new Set());
              }}
            />
            <Button
              title={`Dodaj (${selectedAlbums.size})`}
              className="flex-1 w-full  mt-0 p-0"
              textClassName="text-sm"
              onPress={handleAddAlbums}
            />
          </View>

        </View>
      )}

      {loading ? (
        <AlbumGridSkeleton />
      ) : (
        <View className="flex flex-col gap-4">
          {!pickerMode && (
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-500">Przytrzymaj album, aby wybrać wiele</Text>
              <Pressable
                className="bg-gray-100 rounded-xl p-2"
                onPress={() => setDisplayOption(displayOption === "grid" ? "list" : "grid")}
              >
                <Ionicons
                  name={displayOption === "grid" ? "list" : "grid"}
                  size={18}
                  color="#00964a"
                />
              </Pressable>
            </View>
          )}
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Szukaj"
            handleReset={() => setSearchText("")}
          />
          <ScrollView>
            <AlbumGrid
              albums={albums}
              onAlbumSelected={handleAlbumSelected}
              onAlbumLongPress={handleAlbumLongPress}
              onRefresh={getAlbums}
              albumsPerPage="all"
              headerShown={false}
              pickerMode={pickerMode}
              selectedAlbums={selectedAlbums}
            />
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}
