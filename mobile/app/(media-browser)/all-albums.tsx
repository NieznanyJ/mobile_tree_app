import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AlbumGrid from "@/components/AlbumGrid";
import SearchInput from "@/components/ui/input/SearchInput";
import { useMediaLibrary } from "@/lib/hooks/useMediaLibrary";

export default function AllAlbumsScreen() {
  const [selectedImage, setSelectedImage] = useState<MediaLibrary.Asset | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // State for controlling the modal
  const [selectedAlbum, setSelectedAlbum] = useState<MediaLibrary.Album | null>(
    null,
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Single source of truth hook
  const { albums, assets, getAssets, getAlbums } = useMediaLibrary();

  const handleAlbumSelected = (album: MediaLibrary.Album) => {
    console.log("Album selected:", album);
    setSelectedAlbum(album);
    getAssets(album);
    setModalVisible(true);
    router.push(`/(media-browser)/${album.id}`);
  };

  const handlePhotoSelected = (asset: MediaLibrary.Asset) => {
    setSelectedImage(asset);
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      await getAlbums();
      setLoading(false);
    };

    fetchAlbums();
  }, []);

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1  p-4 bg-background">
      <ScrollView>
        <View className="flex flex-col gap-4">
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Szukaj"
            handleReset={() => setSearchText("")}
          />
          <AlbumGrid
            albums={filteredAlbums}
            onAlbumSelected={handleAlbumSelected}
            onRefresh={getAlbums}
            albumsPerPage={"all"}
            headerShown={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
