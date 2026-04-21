import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ImageModal from "@/components/modals/ImageModal";
import PhotoGridSkeleton from "@/components/skeletons/PhotoGridSkeleton";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Checkbox from "@/components/ui/input/Checkbox";
import SearchInput from "@/components/ui/input/SearchInput";
import { DISPLAY_OPTIONS_CALC, num, PAGE_SIZE } from "@/constants/components";
import { useAssetsStore } from "@/lib/store/assetsStore";





export default function AllPhotosScreen() {
  const pathname = usePathname();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
    mediaTypes: MediaLibrary.MediaType.photo,
  });
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedImageData, setSelectedImageData] = useState<{
    assets: MediaLibrary.Asset[];
    index: number;
  } | null>(null);
  const endCursorRef = useRef<string | undefined>(undefined);
  const hasNextPageRef = useRef(true);

  const { setAssetsCount, setRecentImages, recentImages, addAssetForPrediction } = useAssetsStore();
  const params = useLocalSearchParams();
  const isSingleSelect = params.mode === "single";

  const filteredAssets = searchText
    ? assets.filter((asset) =>
      asset.filename.toLowerCase().includes(searchText.toLowerCase()),
    )
    : assets;

  const layout = DISPLAY_OPTIONS_CALC.find((opt) => opt.ITEMS_PER_ROW === num);

  const handleItemPress = (item: MediaLibrary.Asset, index: number) => {
    if (isSingleSelect) {
      setSelectedImageData({ assets: filteredAssets, index });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        next.has(item.id) ? next.delete(item.id) : next.add(item.id);
        return next;
      });
    }
  };

  const loadAssets = useCallback(async (after?: string) => {
    const result = await MediaLibrary.getAssetsAsync({
      first: PAGE_SIZE,
      after,
      sortBy: [MediaLibrary.SortBy.creationTime],
      mediaType: [MediaLibrary.MediaType.photo],
    });
    endCursorRef.current = result.endCursor;
    hasNextPageRef.current = result.hasNextPage;
    return result.assets;
  }, []);

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
        const firstPage = await loadAssets();
        setAssets(firstPage);
      }
      setLoading(false);
    })();
  }, [permissionResponse?.status]);

  // Aktualizuj assetsCount gdy assets się zmieni (unika setState podczas renderowania)
  useEffect(() => {
    if (assets.length > 0) {
      setAssetsCount(assets.length);
    }
  }, [assets.length, setAssetsCount]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasNextPageRef.current || searchText) return;
    setLoadingMore(true);
    const nextPage = await loadAssets(endCursorRef.current);
    setAssets((prev) => [...prev, ...nextPage]);
    setLoadingMore(false);
  }, [loadingMore, searchText, loadAssets]);

  useEffect(() => {
    if (!recentImages || recentImages.length === 0) {
      setSelected(new Set());
      return;
    }

    const availableIds = new Set(assets.map((a) => a.id));
    const preselected = recentImages
      .filter((a) => availableIds.has(a.id))
      .map((a) => a.id);

    setSelected(new Set(preselected));
  }, [recentImages, assets]);



  const allSelected = filteredAssets.length > 0 && filteredAssets.every((a) => selected.has(a.id));

  const checkAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredAssets.map((a) => a.id)));
    }
  }

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 16, alignItems: "center" }}>
        <ActivityIndicator size="small" color="#00964a" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-background">
      {!isSingleSelect && (
        <View className="flex-col gap-2 mb-3">
          <Text className="text-lg font-semibold">Wybierz zdjęcia</Text>
          <View className="flex-row items-center justify-between">
            <Pressable className="flex flex-row items-center gap-2 flex-1" onPress={checkAll}>
              <View pointerEvents="none">
                <Checkbox setIsChecked={() => {}} isChecked={allSelected} />
              </View>
              <Text>{allSelected ? "Odznacz wszystkie" : "Zaznacz wszystkie"}</Text>
            </Pressable>

            <Pressable
              className="bg-secondary px-4 py-3 rounded-full  flex-row items-center justify-end "
              onPress={() => {
                const chosen = assets.filter((a) => selected.has(a.id));
                setRecentImages(chosen);
                router.back();
              }}
            >

              <Text className="text-white text-lg w-24">{`Dodaj (${selected.size})`}</Text>
            </Pressable>
          </View>
        </View>
      )}
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        handleReset={() => setSearchText("")}
        placeholder="Szukaj"
        showDisplayButton={false}
      />
      {loading ? (
        <View className="mt-2">
          <PhotoGridSkeleton />
        </View>
      ) : assets.length === 0 ? (
        <View className="flex-1 flex-col items-center justify-center gap-3">
          <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center">
            <MaterialCommunityIcons name="image-off" size={28} color="#9ca3af" />
          </View>
          <Text className="text-gray-500">Brak ostatnich zdjęć lub brak dostępu do galerii.</Text>
        </View>
      ) : (
        filteredAssets.length > 0 ?
          (
            <FlashList
              key={num}
              contentContainerStyle={{ paddingTop: 8 }}
              data={filteredAssets}
              keyExtractor={(item) => item.id}
              numColumns={num}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              renderItem={({ item, index }) => (
                <>

                  {recentImages.some((img) => img.id === item.id) && pathname !== "/" && (<MaterialIcons name="widgets" size={16} color="#fff" className="absolute bg-secondary p-2 rounded-full z-10 " />)}

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
                  </TouchableOpacity></>
              )}
            />
          ) : (
            <EmptyState
              icon={<Ionicons name="image-outline" size={28} color="#9ca3af" />}
              text="Brak zdjęć"
            />
          )
      )}
      {isSingleSelect && selectedImageData && (
        <ImageModal
          visible={!!selectedImageData}
          onClose={() => setSelectedImageData(null)}
          assets={selectedImageData.assets}
          initialIndex={selectedImageData.index}
          onConfirm={(asset) => {
            addAssetForPrediction(asset);
            // Wracamy do predict jeśli jest na stacku, inaczej nawigujemy
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/predict");
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
