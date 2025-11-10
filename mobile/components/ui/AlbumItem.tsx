import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import * as MediaLibrary from 'expo-media-library';
import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface AlbumItemProps {
    album: MediaLibrary.Album;
    onAlbumSelected: (album: MediaLibrary.Album) => void;
    displayOption: string;
}

const ITEM_WIDTH = Dimensions.get('window').width / 2 - 16;


const AlbumItem = ({ album, onAlbumSelected, displayOption }: AlbumItemProps) => {




    return (
        <TouchableOpacity
            onPress={() => onAlbumSelected(album)}
            activeOpacity={0.7}
            style={displayOption === 'grid' ? styles.albumGridItemContainer : styles.albumListItemContainer}
        >
            <View
                style={displayOption === 'grid' ? styles.albumGridItem : styles.albumListItem}
            >
                <View
                    style={displayOption === 'grid' ? styles.albumGridIconContainer : styles.albumListIconContainer}
                >
                    <MaterialIcons name="folder" size={36} color="#e5e7eb" />
                    {displayOption === 'grid' && <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />}
                </View>
                <View className='flex flex-col items-start justify-center flex-1'>
                    <Text style={styles.albumGridTitle} numberOfLines={1}>{album.title}</Text>
                    <Text style={styles.albumGridCount}>{album.assetCount} {album.assetCount === 1 ? 'plik' : 'pliki'}</Text>
                </View>
                {displayOption === 'list' && <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" className='self-center' />}
            </View>
        </TouchableOpacity>
    )
}

export default AlbumItem

const styles = StyleSheet.create({
    albumGridItemContainer: {
        maxWidth: ITEM_WIDTH,
        flex: 1,
        margin: 4,
        height: 135,
        borderRadius: 8,
    },
    albumListItemContainer: {
        minWidth: ITEM_WIDTH,
        height: 60,
        flex: 1,
        margin: 6,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 2
    },
    albumGridItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 16,
        width: '100%',
        padding: 16,
        borderRadius: 8,
        height: '100%',
        backgroundColor: '#fff',
        elevation: 2
    },
    albumListItem: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
        width: '100%',
        padding: 16,
        borderRadius: 8,
        height: '100%',
        backgroundColor: 'transparent',
    },
    albumGridIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    albumListIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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