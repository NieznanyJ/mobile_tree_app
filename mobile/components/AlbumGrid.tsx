
import { AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useSettingsStore } from '@/lib/store/settingsStore';

import AlbumItem from './ui/AlbumItem';

interface AlbumGridProps {
  albums: MediaLibrary.Album[];
  onAlbumSelected: (album: MediaLibrary.Album) => void;
  onRefresh: () => void;
  albumsPerPage?: string | number;
  headerShown?: boolean;
}

export default function AlbumGrid({ albums, onAlbumSelected, onRefresh, albumsPerPage = 4, headerShown = true }: AlbumGridProps) {
  const displayAlbums = albumsPerPage === 'all' ? albums : albums.slice(0, albumsPerPage as number);

  const { displayOption } = useSettingsStore();

  return (
    <View>
      {headerShown && (
        <View className='w-full flex flex-row items-center justify-between mb-4'>
          <Text className='text-xl font-bold'>Foldery</Text>
          <Link href="/(media-browser)/all-albums" className='text-sm text-gray-600'>Więcej</Link>
        </View>
      )}

      {displayAlbums.length > 0 ? (
        <FlatList
          key={displayOption}
          data={displayAlbums}
          keyExtractor={(item) => item.id}
          numColumns={displayOption === 'grid' ? 2 : 1}
          scrollEnabled={false}
          renderItem={({ item: album }) => (

            <AlbumItem album={album} onAlbumSelected={onAlbumSelected} displayOption={displayOption} />
          )}
        />
      ) : (
        <View className='flex flex-col items-center justify-center gap-2 my-4'>
          <MaterialIcons name="folder-off" size={36} color="#e5e7eb" />
          <Text>Nie znaleziono albumów lub nie udzielono dostępu.</Text>
        </View>
      )}
    </View>
  );
}

