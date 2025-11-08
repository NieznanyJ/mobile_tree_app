
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import ImageModal from '@/components/modals/ImageModal';
import GoBackButton from '@/components/ui/GoBackButton';
import { useMediaLibrary } from '@/lib/hooks/useMediaLibrary';
import { useAssetsStore } from '@/lib/store/assetsStore';

const NUM_COLUMNS = 3;
const ITEM_SPACING = 4;
const ITEM_WIDTH = Dimensions.get('window').width / 3 - ITEM_SPACING * 2;

export default function AllPhotosScreen() {
  const { getRecentAssets, permissionResponse, requestPermission } = useMediaLibrary();
  const [selectedImage, setSelectedImage] = useState<MediaLibrary.Asset | null>(null);
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (permissionResponse?.status !== 'granted') {
        const permission = await requestPermission();
        if (!permission.granted) {
          setLoading(false);
          return;
        }
      }
      if (permissionResponse?.status === 'granted') {
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
      return <Text className="text-center mt-10 text-gray-500">Nie znaleziono zdjęć.</Text>;
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
        data={assets}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedImage(item)}
            style={{ width: ITEM_WIDTH, height: ITEM_WIDTH * 1.2, padding: 4 }}>
            <Image
              source={{ uri: item.uri }}
              style={{ width: '100%', height: '100%', borderRadius: 8 }}
            />
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <SafeAreaView className='flex-1 p-4 bg-background'>
      <ScrollView>
        <GoBackButton onPress={() => router.back()} />
        <View className='flex flex-row items-center justify-between my-4'>
          <Text className='text-xl font-bold'>Wszystkie zdjęcia</Text>
          <Text className='text-sm '>{assets?.length} {assets?.length === 1 ? "zdjęcie" : "zdjęcia"}</Text>
        </View>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

});
