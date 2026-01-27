import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as MediaLibrary from "expo-media-library";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";

import { colors } from "@/constants/colors";
import { useAssetsStore } from "@/lib/store/assetsStore";

import Button from "./ui/Button";
import ImageGridLayout, { GridAsset } from "./ui/ImageGridLayout";

interface RecentPhotosRowProps {
  onPhotoSelected?: (asset: MediaLibrary.Asset, index: number) => void;
  photosPerPage?: number;
}

export default function RecentPhotosRow({
  onPhotoSelected,
  photosPerPage = 12,
}: RecentPhotosRowProps) {
  const { recentImages } = useAssetsStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImagePress = (asset: GridAsset, index: number) => {
    if (onPhotoSelected) {
      onPhotoSelected(asset as MediaLibrary.Asset, index);
    }
  };

  const handleOpenPicker = () => {
    router.push("/(media-browser)/all-photos");
  };

  if (loading) {
    return (
      <View className="items-center mt-4 py-6">
        <ActivityIndicator size="small" color={colors.secondary} />
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

  // Podziel zdjęcia na grupy po 4
  const grids = [];
  for (let i = 0; i < recentImages.length; i += 4) {
    const gridAssets = recentImages.slice(i, i + 4) as GridAsset[];
    grids.push(
      <ImageGridLayout
        key={i}
        assets={gridAssets}
        startIndex={i}
        onImagePress={handleImagePress}
      />
    );
  }

  return (
    <View className="flex flex-col">
      <View className="w-full flex flex-row items-center justify-between mb-4">
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
