import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
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
import { SafeAreaView } from "react-native-safe-area-context";

import ImageModal from "@/components/modals/ImageModal";
import SearchInput from "@/components/ui/input/SearchInput";
import { useMediaLibrary } from "@/lib/hooks/useMediaLibrary";

const ITEMS_PER_ROW = 4;
const ITEM_SPACING = 6;
const ITEM_WIDTH =
  Dimensions.get("window").width / ITEMS_PER_ROW - ITEM_SPACING;

export const DISPLAY_OPTIONS_CALC = [
  {
    id: 2,
    ITEMS_PER_ROW: 2,
    ITEM_SPACING: 10,
    ITEM_WIDTH: Dimensions.get("window").width / 2 - 14,
  },
  {
    id: 3,
    ITEMS_PER_ROW: 3,
    ITEM_SPACING: 8,
    ITEM_WIDTH: Dimensions.get("window").width / 3 - 10,
  },
  {
    id: 4,
    ITEMS_PER_ROW: 4,
    ITEM_SPACING: 6,
    ITEM_WIDTH: Dimensions.get("window").width / 4 - 6,
  },
  {
    id: 5,
    ITEMS_PER_ROW: 5,
    ITEM_SPACING: 6,
    ITEM_WIDTH: Dimensions.get("window").width / 5 - 6,
  },
];

const num = 4;

export default function AllPhotosScreen() {
  const { getRecentAssets, permissionResponse, requestPermission } =
    useMediaLibrary();
  const [selectedImage, setSelectedImage] = useState<MediaLibrary.Asset | null>(
    null,
  );
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const filteredAssets = assets.filter((asset) =>
    asset.filename.toLowerCase().includes(searchText.toLowerCase()),
  );

  const layout = DISPLAY_OPTIONS_CALC.find((opt) => opt.ITEMS_PER_ROW === num);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (permissionResponse?.status !== "granted") {
        const permission = await requestPermission();
        if (!permission.granted) {
          setLoading(false);
          return;
        }
      }
      if (permissionResponse?.status === "granted") {
        // Get all assets, with a reasonable limit for performance
        const allAssets = await getRecentAssets(1000);
        setAssets(allAssets);
      }
      setLoading(false);
    })();
  }, [permissionResponse?.status]);

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#000" className="mt-10" />;
    }

    if (assets.length === 0) {
      return (
        <Text className="text-center mt-10 text-gray-500">
          Nie znaleziono zdjęć.
        </Text>
      );
    }

    if (selectedImage) {
      return (
        <ImageModal
          visible={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          onPhotoSelected={setSelectedImage}
          selectedPhoto={selectedImage}
        />
      );
    }

    return (
      <FlatList
        key={num}
        data={filteredAssets}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        numColumns={num}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedImage(item)}
            style={{
              width: layout?.ITEM_WIDTH,
              height: layout!.ITEM_WIDTH * 1.1,
              padding: 4,
            }}
          >
            <Image
              source={{ uri: item.uri }}
              style={{ width: "100%", height: "100%", borderRadius: 8 }}
            />
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-background">
      <ScrollView>
        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          handleReset={() => setSearchText("")}
          placeholder="Szukaj"
        />
        <Text className="text-sm ">
          {assets?.length} {assets?.length === 1 ? "zdjęcie" : "zdjęcia"}
        </Text>
        {filteredAssets.length > 0 ? (
          renderContent()
        ) : (
          <View className="flex  flex-col items-center justify-center gap-2 my-4">
            <MaterialCommunityIcons
              name="image-off"
              size={36}
              color="#e5e7eb"
            />
            <Text>Brak ostatnich zdjęć lub brak dostępu do galerii.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
