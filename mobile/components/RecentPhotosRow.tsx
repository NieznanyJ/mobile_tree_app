
import * as MediaLibrary from 'expo-media-library';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useMediaLibrary } from '@/lib/hooks/useMediaLibrary';

interface RecentPhotosRowProps {
  onPhotoSelected?: (asset: MediaLibrary.Asset) => void;
  photosPerPage?: number;
}

const ITEM_WIDTH = Dimensions.get('window').width / 3 - 10; // Roughly 3 items per row with some margin

export default function RecentPhotosRow({ onPhotoSelected, photosPerPage = 6 }: RecentPhotosRowProps) {
  const { getRecentAssets, permissionResponse, requestPermission } = useMediaLibrary();
  const [recentAssets, setRecentAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (permissionResponse?.status !== 'granted') {
        const permission = await requestPermission();
        if (!permission.granted) {
          setLoading(false);
          return;
        }
      }
      if (permissionResponse?.status === 'granted') {
        const assets = await getRecentAssets(10); // Fetch last 10 photos
        setRecentAssets(assets);
      }
      setLoading(false);
    })();
  }, [permissionResponse?.status]);

  if (loading) {
    return <Text style={styles.message}><ActivityIndicator size='small' color='#000' /></Text>;
  }

  if (recentAssets.length === 0) {
    return <Text style={styles.message}>Brak ostatnich zdjęć lub brak dostępu do galerii.</Text>;
  }

  return (
    <View className='flex flex-col p-1'>
      <View className='w-full flex flex-row items-center justify-between mb-4'>
        <Text className='text-xl font-bold '>Ostatnie zdjęcia</Text>
        <Link href="/all-photos" className='text-sm text-gray-600'>Więcej</Link>
      </View>
      <FlatList
        horizontal
        data={recentAssets.splice(0, photosPerPage)}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexWrap: 'wrap' }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPhotoSelected && onPhotoSelected(item)}>
            <Image source={{ uri: item.uri }} style={styles.image} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    marginRight: 10,
    borderRadius: 8,
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
