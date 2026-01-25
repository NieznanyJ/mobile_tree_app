import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as MediaLibrary from "expo-media-library";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAssetsStore } from "@/lib/store/assetsStore";

import Button from "./ui/Button";

interface RecentPhotosRowProps {
  onPhotoSelected?: (asset: MediaLibrary.Asset, index: number) => void;
  photosPerPage?: number;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_SIZE = SCREEN_WIDTH - 32; // Width of one grid block (with padding)

export default function RecentPhotosRow({
  onPhotoSelected,
  photosPerPage = 12,
}: RecentPhotosRowProps) {
  const { recentImages } = useAssetsStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const renderPhotoGrid = (
    assets: any[],
    startIndex: number,
  ) => {
    const gridAssets = assets.slice(startIndex, startIndex + 4);

    if (gridAssets.length === 0) return null;

    const numberOfImages = gridAssets.length;

    // Helper function to get image source (thumbnail first, fallback to original)
    const getImageSource = (asset: any) => ({
      uri: asset.thumbnailUri || asset.uri,
    });

    if (numberOfImages === 4) {
      return (
        <View
          key={startIndex}
          style={{ width: GRID_SIZE }}
          className="flex flex-row gap-2"
        >
          <View>
            <TouchableOpacity onPress={() => onPhotoSelected?.(gridAssets[0], startIndex)}>
              <Image
                source={getImageSource(gridAssets[0])}
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
                onPress={() => onPhotoSelected?.(gridAssets[1], startIndex + 1)}
              >
                <Image
                  source={getImageSource(gridAssets[1])}
                  style={[
                    styles.image,
                    { width: GRID_SIZE / 4 - 8, height: GRID_SIZE / 4 - 8 },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onPhotoSelected?.(gridAssets[2], startIndex + 2)}
              >
                <Image
                  source={getImageSource(gridAssets[2])}
                  style={[
                    styles.image,
                    { width: GRID_SIZE / 4 - 8, height: GRID_SIZE / 4 - 8 },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => onPhotoSelected?.(gridAssets[3], startIndex + 3)}
              >
                <Image
                  source={getImageSource(gridAssets[3])}
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
            <TouchableOpacity onPress={() => onPhotoSelected?.(gridAssets[0], startIndex)}>
              <Image
                source={getImageSource(gridAssets[0])}
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
                onPress={() => onPhotoSelected?.(gridAssets[1], startIndex + 1)}
              >
                <Image
                  source={getImageSource(gridAssets[1])}
                  style={[
                    styles.image,
                    { width: GRID_SIZE / 2 - 8, height: GRID_SIZE / 4 - 8 },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row ">
              <TouchableOpacity
                onPress={() => onPhotoSelected?.(gridAssets[2], startIndex + 2)}
              >
                <Image
                  source={getImageSource(gridAssets[2])}
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
            <TouchableOpacity onPress={() => onPhotoSelected?.(gridAssets[0], startIndex)}>
              <Image
                source={getImageSource(gridAssets[0])}
                style={[
                  styles.image,
                  { width: GRID_SIZE / 2, height: GRID_SIZE / 2 - 8 },
                ]}
              />
            </TouchableOpacity>
          </View>
          <View className="flex-1 flex flex-col justify-between" style={{ marginLeft: SCREEN_WIDTH * 0.02 }}>
            <View className="flex flex-row">
              <TouchableOpacity
                onPress={() => onPhotoSelected?.(gridAssets[1], startIndex + 1)}
              >
                <Image
                  source={getImageSource(gridAssets[1])}
                  style={[
                    styles.image,
                    { width: GRID_SIZE / 2, height: GRID_SIZE / 2 - 8 },
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
        <TouchableOpacity onPress={() => onPhotoSelected?.(gridAssets[0], startIndex)}>
          <Image
            source={getImageSource(gridAssets[0])}
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
  for (let i = 0; i < recentImages.length; i += 4) {
    grids.push(renderPhotoGrid(recentImages as any[], i));
  }

  const handleOpenPicker = () => {
    router.push("/(media-browser)/all-photos");
  };

  if (loading) {
    return (
      <View className="items-center mt-4 py-6">
        <ActivityIndicator size="small" color="#00964a" />
      </View>
    );
  }

  if (!recentImages || recentImages.length === 0) {
    return (
      <View className="items-center gap-3 mt-4 px-4 py-6 bg-background rounded-2xl mx-2">
        <View className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center">
          <Ionicons name="images-outline" size={28} color="#9ca3af" />
        </View>
        <Text className="text-sm text-gray-500 text-center">
          Nie wybrałeś jeszcze żadnych zdjęć
        </Text>
        <Button
          title="Wybierz z galerii"
          onPress={handleOpenPicker}
          className="mt-1"
          textClassName="text-sm"
        >
          <MaterialIcons name="photo-library" size={20} color="#fff" />
        </Button>
      </View>
    );
  }

  return (
    <View className="flex flex-col ">
      <View className="w-full flex flex-row items-center justify-between mb-4 ">
        <Text className="text-xl font-bold">Wybrane zdjęcia</Text>
        <Link
          href="/(media-browser)/all-photos"
          className="text-sm text-gray-600"
        >
          Edytuj
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
});
