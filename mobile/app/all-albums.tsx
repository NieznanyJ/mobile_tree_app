
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import AlbumGrid from '@/components/AlbumGrid';
import AssetModal from '@/components/modals/AssetModal';
import GoBackButton from '@/components/ui/GoBackButton';
import { useMediaLibrary } from '@/lib/hooks/useMediaLibrary';

export default function AllAlbumsScreen() {
  const [selectedImage, setSelectedImage] = useState<MediaLibrary.Asset | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // State for controlling the modal
  const [selectedAlbum, setSelectedAlbum] = useState<MediaLibrary.Album | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Single source of truth hook
  const { albums, assets, getAssets, getAlbums } = useMediaLibrary();

  const handleAlbumSelected = (album: MediaLibrary.Album) => {
    console.log('Album selected:', album);
    setSelectedAlbum(album);
    getAssets(album);
    setModalVisible(true);
  };

  const handlePhotoSelected = (asset: MediaLibrary.Asset) => {
    setSelectedImage(asset);
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      await getAlbums();
      setLoading(false);
    };

    fetchAlbums();
  }, []);



  return (
    <SafeAreaView className='flex-1 p-4 bg-background'>
      <ScrollView>
        <View className="flex-row items-center justify-between px-4 py-2">
          <GoBackButton onPress={() => router.back()} />
          <Text className="text-xl font-bold">Wszystkie foldery</Text>
          <View style={{ width: 40 }} />
        </View>
        <AlbumGrid albums={albums} onAlbumSelected={handleAlbumSelected} onRefresh={getAlbums} albumsPerPage={'all'} headerShown={false} />


        <AssetModal
          visible={isModalVisible}
          album={selectedAlbum}
          assets={assets}
          onClose={() => setModalVisible(false)}
          onPhotoSelected={handlePhotoSelected}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
