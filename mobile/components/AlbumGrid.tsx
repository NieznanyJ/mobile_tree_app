
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  return (
    <View>
      {headerShown && (
        <View className='w-full flex flex-row items-center justify-between mb-4 px-1'>
          <Text className='text-xl font-bold'>Foldery</Text>
          <Link href="/all-albums" className='text-sm text-gray-600'>Więcej</Link>
        </View>
      )}

      {displayAlbums.length > 0 ? (
        <FlatList
          data={displayAlbums}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item: album }) => (

            <AlbumItem album={album} onAlbumSelected={onAlbumSelected} />
          )}
        />
      ) : (
        <View className='flex flex-col items-center justify-center gap-4 p-5'>
          <TouchableOpacity onPress={onRefresh}>
            <AntDesign name="reload" size={14} color="black" />
          </TouchableOpacity>
          <Text className='text-md text-center mt-4'>Nie znaleziono albumów lub nie udzielono dostępu.</Text>
        </View>
      )}
    </View>
  );
}

