import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Linking,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import AlbumGrid from '@/components/AlbumGrid';
import ImageModal from '@/components/modals/ImageModal';
import AlbumGridSkeleton from '@/components/skeletons/AlbumGridSkeleton';
import PhotoGridSkeleton from '@/components/skeletons/PhotoGridSkeleton';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import SearchInput from '@/components/ui/input/SearchInput';
import { useMediaLibrary } from '@/lib/hooks/useMediaLibrary';
import { useAssetsStore } from '@/lib/store/assetsStore';
import { useSettingsStore } from '@/lib/store/settingsStore';

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEMS_PER_ROW = 4;
const ITEM_WIDTH = SCREEN_WIDTH / ITEMS_PER_ROW - 6;
const PAGE_SIZE = 50;

const Gallery = () => {
    const [galleryShowing, setGalleryShowing] = useState<'albums' | 'photos'>('photos');
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);

    const [pickerMode, setPickerMode] = useState(false);
    const [selectedAlbums, setSelectedAlbums] = useState<Set<string>>(new Set());

    // Photo grid state
    const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const endCursorRef = useRef<string | undefined>(undefined);
    const hasNextPageRef = useRef(true);
    const [selectedImageData, setSelectedImageData] = useState<{
        assets: MediaLibrary.Asset[];
        index: number;
    } | null>(null);

    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
        mediaTypes: MediaLibrary.MediaType.photo,
    });

    const { albums, getAssets, getAlbums } = useMediaLibrary();
    const { setAlbum, selectedAlbums: storeSelectedAlbums, addAssetForPrediction, selectedAssets } = useAssetsStore();
    const { displayOption, setDisplayOption } = useSettingsStore();

    const translateX = useSharedValue(0);

    const switchTo = useCallback((tab: 'photos' | 'albums') => {
        setGalleryShowing(tab);
        translateX.value = withTiming(tab === 'photos' ? 0 : -SCREEN_WIDTH, { duration: 200 });
    }, [translateX]);

    const slidingStyle = useAnimatedStyle(() => ({
        flexDirection: 'row' as const,
        width: SCREEN_WIDTH * 2,
        transform: [{ translateX: translateX.value }],
    }));

    const isPermissionGranted = permissionResponse?.status === "granted";

    const handleRequestPermission = async () => {
        if (permissionResponse?.canAskAgain === false) {
            Linking.openSettings();
            return;
        }
        await requestPermission();
    };

    const handleAddAssetToPrediction = (asset: MediaLibrary.Asset) => {
        addAssetForPrediction(asset);
        router.push("/predict");
    }

    const handleAlbumSelected = (album: MediaLibrary.Album) => {
        if (pickerMode) {
            setSelectedAlbums((prev) => {
                const next = new Set(prev);
                next.has(album.id) ? next.delete(album.id) : next.add(album.id);
                return next;
            });
        } else {
            setAlbum(album);
            getAssets(album);
            router.push(`/(media-browser)/${album.id}`);
        }
    };

    const loadPhotos = useCallback(async (after?: string) => {
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

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasNextPageRef.current || searchText) return;
        setLoadingMore(true);
        const nextPage = await loadPhotos(endCursorRef.current);
        setPhotos((prev) => [...prev, ...nextPage]);
        setLoadingMore(false);
    }, [loadingMore, searchText, loadPhotos]);

    // Ładuj zdjęcia przy pierwszym wejściu
    useFocusEffect(
        useCallback(() => {
            if (!isPermissionGranted) return;
            if (photos.length === 0) {
                setLoadingPhotos(true);
                endCursorRef.current = undefined;
                hasNextPageRef.current = true;
                loadPhotos().then((firstPage) => {
                    setPhotos(firstPage);
                    setLoadingPhotos(false);
                });
            }
        }, [isPermissionGranted, loadPhotos, photos.length])
    );

    // Ładuj albumy gdy przełączysz się na "Foldery"
    useEffect(() => {
        if (!isPermissionGranted) return;
        if (galleryShowing === 'albums' && albums.length === 0) {
            setLoading(true);
            getAlbums().finally(() => setLoading(false));
        }
    }, [galleryShowing, isPermissionGranted, albums.length, getAlbums]);

    const filteredAlbums = albums
        .filter((album) => !storeSelectedAlbums.some((sa) => sa.id === album.id))
        .filter((album) =>
            album.title.toLowerCase().includes(searchText.toLowerCase()),
        );

    const filteredPhotos = useMemo(() => {
        return photos
            .filter((photo) => !selectedAssets.some((selected) => selected.uri === photo.uri))
            .filter((photo) =>
                searchText ? photo.filename.toLowerCase().includes(searchText.toLowerCase()) : true,
            );
    }, [photos, selectedAssets, searchText]);

    const handlePhotoPress = (photo: MediaLibrary.Asset, index: number) => {
        setSelectedImageData({ assets: filteredPhotos, index });
    };

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={{ paddingVertical: 16, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#00964a" />
            </View>
        );
    };

    // Permission denied view
    if (!isPermissionGranted) {
        const canAskAgain = permissionResponse?.canAskAgain !== false;

        return (
            <View className='flex-1 pt-4 bg-background'>
                <Text className='text-2xl font-bold text-textPrimary mb-4'>Galeria</Text>
                <View className="flex-1 items-center justify-center gap-4 px-4">
                    <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center">
                        <Ionicons name="images-outline" size={40} color="#9ca3af" />
                    </View>
                    <Text className="text-lg text-gray-600 text-center">
                        {canAskAgain
                            ? "Aby przeglądać galerię, udziel dostępu do zdjęć"
                            : "Dostęp do galerii został odmówiony. Zmień uprawnienia w ustawieniach."}
                    </Text>
                    <Button
                        title={canAskAgain ? "Udziel dostępu" : "Otwórz ustawienia"}
                        onPress={handleRequestPermission}
                        className="mt-4 px-8"
                    />
                </View>
            </View>
        );
    }

    return (
        <View className='flex-1 p-4 pt-0 bg-background'>
            <Text className='text-2xl font-bold text-textPrimary mb-4'>Galeria</Text>
            <View className='flex flex-row items-center justify-between gap-2' >
                <Button
                    className='flex-1'
                    textClassName='text-sm'
                    variant={galleryShowing === 'photos' ? 'primary' : 'outline'}
                    title="Zdjęcia"
                    onPress={() => switchTo('photos')}
                />
                <Button
                    className='flex-1'
                    textClassName='text-sm'
                    variant={galleryShowing === 'albums' ? 'primary' : 'outline'}
                    title="Foldery"
                    onPress={() => switchTo('albums')}
                />
            </View >

            <View className='flex flex-row items-center gap-2'>
                <View className="my-4 flex-1">
                    <SearchInput
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholder="Szukaj"
                        handleReset={() => setSearchText("")}
                        onPress={setDisplayOption}
                        displayOption={displayOption}
                        showDisplayButton={galleryShowing === 'albums'}
                    />
                </View>
            </View>

            <View style={{ flex: 1, overflow: 'hidden' }}>
                <Animated.View style={[{ flex: 1 }, slidingStyle]}>
                    <View style={{ width: SCREEN_WIDTH, flex: 1, paddingRight: 32 }}>
                        {loadingPhotos ? (
                            <PhotoGridSkeleton />
                        ) : filteredPhotos.length === 0 ? (
                            <EmptyState
                                icon={<Ionicons name="image-outline" size={28} color="#9ca3af" />}
                                text="Brak zdjęć"
                            />
                        ) : (
                            <FlashList
                                data={filteredPhotos}
                                keyExtractor={(item) => item.id}
                                numColumns={ITEMS_PER_ROW}
                                onEndReached={loadMore}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={renderFooter}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => handlePhotoPress(item, index)}
                                        style={{
                                            width: ITEM_WIDTH,
                                            height: ITEM_WIDTH * 1.1,
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
                        )}
                    </View>

                    {/* Panel: Foldery */}
                    <View style={{ width: SCREEN_WIDTH, flex: 1, paddingRight: 32 }}>
                        {loading ? (
                            <AlbumGridSkeleton />
                        ) : filteredAlbums.length === 0 ? (
                            <EmptyState
                                icon={<Ionicons name="folder-open-outline" size={28} color="#9ca3af" />}
                                text="Nie znaleziono folderów"
                            />
                        ) : (
                            <ScrollView
                                style={{ flex: 1 }}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                showsVerticalScrollIndicator={false}
                            >
                                <AlbumGrid
                                    albums={filteredAlbums}
                                    onAlbumSelected={handleAlbumSelected}
                                    onRefresh={getAlbums}
                                    albumsPerPage="all"
                                    headerShown={false}
                                    pickerMode={pickerMode}
                                    selectedAlbums={selectedAlbums}
                                />
                            </ScrollView>
                        )}
                    </View>
                </Animated.View>
            </View>

            {
                selectedImageData && (
                    <ImageModal
                        visible={!!selectedImageData}
                        onClose={() => setSelectedImageData(null)}
                        onConfirm={handleAddAssetToPrediction}
                        assets={selectedImageData.assets}
                        initialIndex={selectedImageData.index}
                    />
                )
            }
        </View >
    )
}

export default Gallery