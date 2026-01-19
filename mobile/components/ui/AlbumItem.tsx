import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

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
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (editMode) {
      startShaking();
    } else {
      stopShaking();
    }
  }, [editMode]);

  const startShaking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stopShaking = () => {
    shakeAnimation.setValue(0);
    Animated.spring(shakeAnimation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [
      {
        rotate: shakeAnimation.interpolate({
          inputRange: [-1, 1],
          outputRange: ["-1deg", "1deg"],
        }),
      },
    ],
  };

  return (
    <Animated.View style={editMode ? animatedStyle : {}}>
      <TouchableOpacity
        onPress={() => onAlbumSelected(album)}
        onLongPress={() => onAlbumLongPress?.(album)}
        activeOpacity={0.7}
        style={
          displayOption === "grid"
            ? styles.albumGridItemContainer
            : styles.albumListItemContainer
        }
      >
        <View
          style={
            displayOption === "grid"
              ? styles.albumGridItem
              : styles.albumListItem
          }
        >
          {editMode && (
            <TouchableOpacity
              onPress={() => onRemove?.(album.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          )}
          <View
            style={
              displayOption === "grid"
                ? styles.albumGridIconContainer
                : styles.albumListIconContainer
            }
          >
            <MaterialIcons name="folder" size={36} color="#e5e7eb" />
            {displayOption === "grid" && (
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
          {displayOption === "list" && (
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
    </Animated.View>
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
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    elevation: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
