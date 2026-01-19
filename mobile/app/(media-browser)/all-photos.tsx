import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
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

import Button from "@/components/ui/Button";
import ImageModal from "@/components/modals/ImageModal";
import SearchInput from "@/components/ui/input/SearchInput";
import { useMediaLibrary } from "@/lib/hooks/useMediaLibrary";
import { useAssetsStore } from "@/lib/store/assetsStore";

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
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedImageData, setSelectedImageData] = useState<{
    assets: MediaLibrary.Asset[];
    index: number;
  } | null>(null);

  const { setAssetsCount, setSelectedAssets, selectedAssets } = useAssetsStore();
  const { setImage } = useAssetsStore();
  const params = useLocalSearchParams();
  const isSingleSelect = params.mode === "single";

  const filteredAssets = assets.filter((asset) =>
    asset.filename.toLowerCase().includes(searchText.toLowerCase()),
  );

  const layout = DISPLAY_OPTIONS_CALC.find((opt) => opt.ITEMS_PER_ROW === num);

  const handleItemPress = (item: MediaLibrary.Asset, index: number) => {
    if (isSingleSelect) {
      // Single select: show modal
      setSelectedImageData({ assets: filteredAssets, index });
    } else {
      // Multi-select: toggle selection
      setSelected((prev) => {
        const next = new Set(prev);
        next.has(item.id) ? next.delete(item.id) : next.add(item.id);
        return next;
      });
    }
  };

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
        setAssetsCount!(allAssets.length);
      }
      setLoading(false);
    })();
  }, [permissionResponse?.status]);

  // Prefill selection with already chosen assets, but only those still available
  useEffect(() => {
    if (!selectedAssets || selectedAssets.length === 0) {
      setSelected(new Set());
      return;
    }

    const availableIds = new Set(assets.map((a) => a.id));
    const preselected = selectedAssets
      .filter((a) => availableIds.has(a.id))
      .map((a) => a.id);

    setSelected(new Set(preselected));
  }, [selectedAssets, assets]);

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

    return (

      <FlatList
        key={num}
        style={{ marginTop: 10 }}
        data={filteredAssets}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        numColumns={num}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleItemPress(item, index)}
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
            {!isSingleSelect && selected.has(item.id) && (
              <View
                style={{
                  position: "absolute",
                  inset: 4,
                  borderRadius: 8,
                  backgroundColor: "rgba(0,0,0,0.35)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="text-white font-bold">✓</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

    );
  };

  const allSelected = filteredAssets.length > 0 && filteredAssets.every((a) => selected.has(a.id));

  return (
    <SafeAreaView className="flex-1 p-4 bg-background">
      <ScrollView >
        {!isSingleSelect && (
          <View className="flex-col gap-2 mb-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold">Wybierz zdjęcia</Text>
              <Button
                title={`Dodaj (${selected.size})`}
                style={{ width: '25%', marginTop: 0 }}
                textClassName="text-sm"
                onPress={() => {
                  const chosen = assets.filter((a) => selected.has(a.id));
                  setSelectedAssets(chosen);
                  router.back();
                }}
              />
            </View>
            <Button
              title={allSelected ? "Odznacz wszystkie" : "Zaznacz wszystkie"}
              className="w-full"
              textClassName="text-sm"
              onPress={() => {
                if (allSelected) {
                  setSelected(new Set());
                } else {
                  const allIds = new Set(filteredAssets.map((a) => a.id));
                  setSelected(allIds);
                }
              }}
            />
          </View>
        )}
        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          handleReset={() => setSearchText("")}
          placeholder="Szukaj"
        />
        {filteredAssets.length > 0 ? (
          renderContent()
        ) : (
          <View className="flex  flex-col items-center justify-center gap-2 my-4 flex-1  h-full">
            <MaterialCommunityIcons
              name="image-off"
              size={36}
              color="#e5e7eb"
            />
            <Text>Brak ostatnich zdjęć lub brak dostępu do galerii.</Text>
          </View>
        )}
      </ScrollView>
      {isSingleSelect && selectedImageData && (
        <ImageModal
          visible={!!selectedImageData}
          onClose={() => setSelectedImageData(null)}
          assets={selectedImageData.assets}
          initialIndex={selectedImageData.index}
          onConfirm={(asset) => {
            setImage(asset);
            router.replace("/predict");
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
