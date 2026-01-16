import * as MediaLibrary from "expo-media-library";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useMediaLibrary } from "@/lib/hooks/useMediaLibrary";

interface RecentPhotosRowProps {
  onPhotoSelected?: (asset: MediaLibrary.Asset) => void;
  photosPerPage?: number;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_SIZE = SCREEN_WIDTH - 32; // Width of one grid block (with padding)

export default function RecentPhotosRow({
  onPhotoSelected,
  photosPerPage = 12,
}: RecentPhotosRowProps) {
  const { getRecentAssets, permissionResponse, requestPermission } =
    useMediaLibrary();
  const [recentAssets, setRecentAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (permissionResponse?.status !== "granted") {
        const permission = await requestPermission();
        if (!permission.granted) {
          setLoading(false);
          return;
        }
      }
      if (permissionResponse?.status === "granted") {
        const assets = await getRecentAssets(photosPerPage);
        setRecentAssets(assets);
      }
      setLoading(false);
    })();
  }, [permissionResponse?.status]);

  const renderPhotoGrid = (
    assets: MediaLibrary.Asset[],
    startIndex: number,
  ) => {
    const gridAssets = assets.slice(startIndex, startIndex + 4);

    if (gridAssets.length === 0) return null;

    const numberOfImages = gridAssets.length;

    if (numberOfImages === 4) {
      return (
        <View
          key={startIndex}
          style={{ width: GRID_SIZE }}
          className="flex flex-row gap-2"
        >
          <View>
            <TouchableOpacity onPress={() => onPhotoSelected?.(gridAssets[0])}>
              <Image
                source={{ uri: gridAssets[0].uri }}
                style={[
                  styles.image,
                  { width: GRID_SIZE / 2 - 8, height: GRID_SIZE / 2 - 8 },
                ]}
              />
            </TouchableOpacity>
          </View>
          <View className="flex-1 flex flex-col justify-between ">
            <View className="flex flex-row gap-2">
              <TouchableOpacity
                onPress={() => onPhotoSelected?.(gridAssets[1])}
              >
                <Image
                  source={{ uri: gridAssets[1].uri }}
                  style={[
                    styles.image,
                    { width: GRID_SIZE / 4 - 8, height: GRID_SIZE / 4 - 8 },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onPhotoSelected?.(gridAssets[2])}
              >
                <Image
                  source={{ uri: gridAssets[2].uri }}
                  style={[
                    styles.image,
                    { width: GRID_SIZE / 4 - 8, height: GRID_SIZE / 4 - 8 },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => onPhotoSelected?.(gridAssets[3])}
              >
                <Image
                  source={{ uri: gridAssets[3].uri }}
                  style={[
                    styles.image,
                    { width: GRID_SIZE / 2 - 8, height: GRID_SIZE / 4 - 8 },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    if (numberOfImages === 3) {
      return (
        <View
          key={startIndex}
          style={{ width: GRID_SIZE, marginRight: 16 }}
          className="flex flex-row gap-2"
        >
          <View>
            <TouchableOpacity onPress={() => onPhotoSelected?.(gridAssets[0])}>
              <Image
                source={{ uri: gridAssets[0].uri }}
                style={[
                  styles.image,
                  { width: GRID_SIZE / 2 - 8, height: GRID_SIZE / 2 - 8 },
                ]}
              />
            </TouchableOpacity>
          </View>
          <View className="flex-1 flex flex-col justify-between">
            <View className="flex flex-row ">
              <TouchableOpacity
                onPress={() => onPhotoSelected?.(gridAssets[1])}
              >
                <Image
                  source={{ uri: gridAssets[1].uri }}
                  style={[
                    styles.image,
                    { width: GRID_SIZE / 2 - 8, height: GRID_SIZE / 4 - 8 },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row ">
              <TouchableOpacity
                onPress={() => onPhotoSelected?.(gridAssets[2])}
              >
                <Image
                  source={{ uri: gridAssets[2].uri }}
                  style={[
                    styles.image,
                    { width: GRID_SIZE / 2 - 8, height: GRID_SIZE / 4 - 8 },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    if (numberOfImages === 2) {
      return (
        <View
          key={startIndex}
          style={{ width: GRID_SIZE, marginRight: 16 }}
          className="flex flex-row"
        >
          <View>
            <TouchableOpacity onPress={() => onPhotoSelected?.(gridAssets[0])}>
              <Image
                source={{ uri: gridAssets[0].uri }}
                style={[
                  styles.image,
                  { width: GRID_SIZE / 2 - 8, height: GRID_SIZE / 2 - 8 },
                ]}
              />
            </TouchableOpacity>
          </View>
          <View className="flex-1 flex flex-col justify-between">
            <View className="flex flex-row">
              <TouchableOpacity
                onPress={() => onPhotoSelected?.(gridAssets[1])}
              >
                <Image
                  source={{ uri: gridAssets[1].uri }}
                  style={[
                    styles.image,
                    { width: GRID_SIZE / 2 - 8, height: GRID_SIZE / 2 - 8 },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View key={startIndex} style={{ width: GRID_SIZE, marginRight: 16 }}>
        <TouchableOpacity onPress={() => onPhotoSelected?.(gridAssets[0])}>
          <Image
            source={{ uri: gridAssets[0].uri }}
            style={[
              styles.image,
              { width: GRID_SIZE / 2 - 8, height: GRID_SIZE / 2 - 8 },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const grids = [];
  for (let i = 0; i < recentAssets.length; i += 4) {
    grids.push(renderPhotoGrid(recentAssets, i));
  }

  if (loading) {
    return (
      <Text style={styles.message}>
        <ActivityIndicator size="small" color="#000" />
      </Text>
    );
  }

  if (recentAssets.length === 0) {
    return (
      <Text style={styles.message}>
        Brak ostatnich zdjęć lub brak dostępu do galerii.
      </Text>
    );
  }

  return (
    <View className="flex flex-col ">
      <View className="w-full flex flex-row items-center justify-between mb-4 ">
        <Text className="text-xl font-bold">Ostatnie zdjęcia</Text>
        <Link
          href="/(media-browser)/all-photos"
          className="text-sm text-gray-600"
        >
          Więcej
        </Link>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View className="flex flex-row">{grids}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    objectFit: "cover",
  },
  message: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});
