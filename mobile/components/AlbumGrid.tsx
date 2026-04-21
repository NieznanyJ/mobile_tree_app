import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as MediaLibrary from "expo-media-library";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { useAssetsStore } from "@/lib/store/assetsStore";
import { useSettingsStore } from "@/lib/store/settingsStore";

import AlbumItem from "./ui/AlbumItem";
import EmptyState from "./ui/EmptyState";

interface AlbumGridProps {
  albums: MediaLibrary.Album[];
  onAlbumSelected: (album: MediaLibrary.Album) => void;
  onAlbumLongPress?: (album: MediaLibrary.Album) => void;
  onRefresh: () => void;
  albumsPerPage?: string | number;
  headerShown?: boolean;
  pickerMode?: boolean;
  selectedAlbums?: Set<string>;
  selectedAlbumsToDisplay?: MediaLibrary.Album[];
  editMode?: boolean;
  onRemoveAlbum?: (albumId: string) => void;
  permissionGranted?: boolean;
}

export default function AlbumGrid({
  albums,
  onAlbumSelected,
  onAlbumLongPress,
  onRefresh,
  albumsPerPage = 4,
  headerShown = true,
  pickerMode = false,
  selectedAlbums = new Set(),
  selectedAlbumsToDisplay,
  editMode = false,
  onRemoveAlbum,
  permissionGranted
}: AlbumGridProps) {
  const albumsToDisplay =
    selectedAlbumsToDisplay && selectedAlbumsToDisplay.length > 0
      ? selectedAlbumsToDisplay
      : albumsPerPage === "all"
        ? albums
        : albums.slice(0, albumsPerPage as number);

  const { displayOption, setDisplayOption } = useSettingsStore();
  const { setAlbumCount } = useAssetsStore();

  useEffect(() => {
    setAlbumCount?.(albums.length);
  }, [albums.length]);

  return (
    <View className="relative">
      {headerShown && (
        <View className="w-full flex flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold">Foldery</Text>
          <View className="flex-row items-center gap-3">
            {selectedAlbumsToDisplay && selectedAlbumsToDisplay.length > 0 && (
              <Pressable
                className="bg-gray-100 rounded-xl p-2"
                onPress={() =>
                  setDisplayOption(displayOption === "grid" ? "list" : "grid")
                }
              >
                <Ionicons
                  name={displayOption === "grid" ? "list" : "grid"}
                  size={18}
                  color="#00964a"
                />
              </Pressable>
            )}
            <Link
              href="/(media-browser)/all-albums"
              className="text-sm text-gray-600"
            >
              Więcej
            </Link>
          </View>
        </View>
      )}

      {albumsToDisplay.length > 0 ? (
        <FlatList
          key={displayOption}
          data={albumsToDisplay}
          keyExtractor={(item) => item.id}
          numColumns={displayOption === "grid" ? 2 : 1}
          scrollEnabled={false}
          renderItem={({ item: album }) => (
            <AlbumItem
              album={album}
              onAlbumSelected={onAlbumSelected}
              onAlbumLongPress={onAlbumLongPress}
              displayOption={displayOption}
              pickerMode={pickerMode}
              isSelected={selectedAlbums.has(album.id)}
              editMode={editMode}
              onRemove={onRemoveAlbum}
            />
          )}
        />
      ) : (
        <EmptyState icon={<Ionicons name="folder-open-outline" size={28} color="#9ca3af" />} text={permissionGranted ? "nie udzielono dostępu" : "Nie znaleziono folderów"} />
      )}
    </View>
  );
}
