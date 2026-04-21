import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAssetsStore } from "@/lib/store/assetsStore";
import { usePathname } from "expo-router";

interface AlbumItemProps {
  album: MediaLibrary.Album;
  onAlbumSelected: (album: MediaLibrary.Album) => void;
  onAlbumLongPress?: (album: MediaLibrary.Album) => void;
  displayOption: string;
  pickerMode?: boolean;
  isSelected?: boolean;
  editMode?: boolean;
  onRemove?: (albumId: string) => void;
}

const ITEM_WIDTH = Dimensions.get("window").width / 2 - 16;

const AlbumItem = ({
  album,
  onAlbumSelected,
  onAlbumLongPress,
  displayOption,
  pickerMode = false,
  isSelected = false,
  editMode = false,
  onRemove,
}: AlbumItemProps) => {
  const pathname = usePathname();
  const { selectedAlbums } = useAssetsStore();
  const [isInSelectedAlbums] = useState<boolean>(
    album.id ? selectedAlbums.some((a) => a.id === album.id) : false
  );

  return (
    <TouchableOpacity
      onPress={() => editMode ? onRemove?.(album.id) : onAlbumSelected(album)}
      onLongPress={() => !isInSelectedAlbums && onAlbumLongPress?.(album)}
      activeOpacity={0.7}
      style={[
        displayOption === "grid"
          ? styles.albumGridItemContainer
          : styles.albumListItemContainer,
        editMode && styles.editModeContainer,
      ]}
    >
      {isInSelectedAlbums && pathname !== "/" && (
        <MaterialIcons name="widgets" size={16} color="#fff" className="absolute bg-secondary p-2 rounded-full z-10" />
      )}
      {editMode && (
        <TouchableOpacity
          onPress={() => onRemove?.(album.id)}
          style={styles.removeButton}
        >
          <Ionicons name="close" size={12} color="#6b7280" />
        </TouchableOpacity>
      )}
        <View
          style={
            displayOption === "grid"
              ? styles.albumGridItem
              : styles.albumListItem
          }
        >
          <View
            style={
              displayOption === "grid"
                ? styles.albumGridIconContainer
                : styles.albumListIconContainer
            }
          >
            <MaterialIcons name="folder" size={36} color="#e5e7eb" />
            {displayOption === "grid" && !editMode && (
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color="black"
              />
            )}
          </View>
          <View className="flex flex-col items-start justify-center flex-1">
            <Text style={styles.albumGridTitle} numberOfLines={1}>
              {album.title}
            </Text>
            <Text style={styles.albumGridCount}>
              {album.assetCount} {album.assetCount === 1 ? "plik" : "pliki"}
            </Text>
          </View>
          {displayOption === "list" && !editMode && (
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color="black"
              className="self-center"
            />
          )}
          {pickerMode && isSelected && (
            <>
              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 10,
                  backgroundColor: "rgba(0,0,0,0.3)",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="text-white font-bold text-2xl">✓</Text>
              </View>
            </>
          )}
        </View>
    </TouchableOpacity>
  );
};

export default AlbumItem;

const styles = StyleSheet.create({
  albumGridItemContainer: {
    maxWidth: ITEM_WIDTH - 4,
    flex: 1,
    margin: 4,
    height: 135,
    borderRadius: 8,
  },
  albumListItemContainer: {
    minWidth: ITEM_WIDTH,
    height: 60,
    flex: 1,
    margin: 6,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  editModeContainer: {
    opacity: 0.85,
  },
  albumGridItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 16,
    width: "100%",
    padding: 16,
    borderRadius: 8,
    height: "100%",
    backgroundColor: "#fff",
    elevation: 2,
  },
  albumListItem: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 16,
    width: "100%",
    padding: 16,
    borderRadius: 8,
    height: "100%",
    backgroundColor: "transparent",
  },
  albumGridIconContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  albumListIconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  albumGridTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  albumGridCount: {
    fontSize: 12,
    color: "#666",
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#f3f4f6",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});
