import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MediaBrowser() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<MediaLibrary.Album | null>(
    null,
  );
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaLibrary.Asset | null>(
    null,
  );

  async function getAlbums() {
    if (permissionResponse?.status !== "granted") {
      const permission = await requestPermission();
      if (!permission.granted) {
        alert("Permission to access media library is required!");
        return;
      }
    }

    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }

  async function getAssets(album: MediaLibrary.Album) {
    const albumAssets = await MediaLibrary.getAssetsAsync({
      album: album.id,
      first: 100,
      sortBy: [MediaLibrary.SortBy.creationTime],
      mediaType: [MediaLibrary.MediaType.photo],
    });
    setAssets(albumAssets.assets);
  }

  useEffect(() => {
    getAlbums();
  }, [permissionResponse]);

  useEffect(() => {
    if (selectedAlbum) {
      getAssets(selectedAlbum);
    } else {
      setAssets([]); // Clear assets when going back to album list
    }
  }, [selectedAlbum]);

  // Full-screen photo view
  if (selectedPhoto) {
    return (
      <View style={styles.container}>
        <Button title="Wróć do siatki" onPress={() => setSelectedPhoto(null)} />
        <Image
          source={{ uri: selectedPhoto.uri }}
          style={styles.fullScreenImage}
          resizeMode="contain"
        />
        <Button
          title="Użyj tego zdjęcia"
          onPress={() => alert(`Wybrano zdjęcie: ${selectedPhoto.filename}`)}
        />
      </View>
    );
  }

  // Album assets grid view
  if (selectedAlbum) {
    return (
      <View style={styles.container}>
        <Button
          title="Wróć do albumów"
          onPress={() => setSelectedAlbum(null)}
        />
        <Text style={styles.title}>{selectedAlbum.title}</Text>
        <FlatList
          data={assets}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedPhoto(item)}>
              <Image source={{ uri: item.uri }} style={styles.assetTile} />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // Album list view
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Twoje Albumy</Text>
      {albums.length > 0 ? (
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedAlbum(item)}>
              <View style={styles.albumContainer}>
                <Text style={styles.albumTitle}>
                  {item.title} ({item.assetCount})
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View className="flex flex-col items-center justify-center gap-2">
          <MaterialIcons name="folder-off" size={24} color="black" />
          <Text>Nie znaleziono albumów lub nie udzielono dostępu.</Text>
        </View>
      )}
      <Button title="Odśwież" onPress={getAlbums} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  albumContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  albumTitle: {
    fontSize: 18,
  },
  assetTile: {
    width: Dimensions.get("window").width / 3 - 16,
    height: Dimensions.get("window").width / 3 - 16,
    margin: 2,
  },
  fullScreenImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    marginVertical: 10,
  },
});
