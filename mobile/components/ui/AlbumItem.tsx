import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import * as MediaLibrary from 'expo-media-library';
import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface AlbumItemProps {
    album: MediaLibrary.Album;
    onAlbumSelected: (album: MediaLibrary.Album) => void;
}

const ITEM_WIDTH = Dimensions.get('window').width / 2 - 16;


const AlbumItem = ({ album, onAlbumSelected }: AlbumItemProps) => {
    return (
        <TouchableOpacity
            onPress={() => onAlbumSelected(album)}
            activeOpacity={0.7}
            style={styles.albumGridItem}
        >
            <View
                className='flex flex-col items-start justify-start gap-4 w-full p-4 rounded-lg bg-white h-full'
                style={{ elevation: 2 }}
            >
                <View className='flex flex-row w-full justify-between items-center'>
                    <FontAwesome name="folder-open" size={36} color="#e5e7eb" />
                    <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
                </View>
                <View className='flex flex-col items-start justify-center'>
                    <Text style={styles.albumGridTitle} numberOfLines={1}>{album.title}</Text>
                    <Text style={styles.albumGridCount}>{album.assetCount} {album.assetCount === 1 ? 'plik' : 'pliki'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default AlbumItem

const styles = StyleSheet.create({
    albumGridItem: {
        maxWidth: ITEM_WIDTH,
        flex: 1,
        margin: 6,
        height: 135,
        borderRadius: 8,
    },
    albumGridTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    albumGridCount: {
        fontSize: 12,
        color: '#666',
    },
});