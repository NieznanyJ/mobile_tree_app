
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react';
import {
    Button,
    Dimensions,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import GoBackButton from '../ui/GoBackButton';
import { useAssetsStore } from '@/lib/store/assetsStore';
import { set } from 'react-hook-form';

interface AssetModalProps {
    visible: boolean;
    onClose: () => void;
    onPhotoSelected: (asset: MediaLibrary.Asset | null) => void;
    selectedPhoto?: MediaLibrary.Asset | null;
}

export default function AssetModal({
    visible,
    onClose,
    onPhotoSelected,
    selectedPhoto,
}: AssetModalProps) {

    const { image, setImage } = useAssetsStore();

    const handleClose = () => {
        onClose();
    };

    const handlePhotoSelect = (asset: MediaLibrary.Asset | null) => {
        setImage(asset);
        console.log("Selected photo in ImageModal:", image?.filename);
        handleClose();
    };



    return (
        <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
            <View style={styles.container}>
                <Button title="Wróć do siatki" onPress={() => handlePhotoSelect(null)} />
                <Image
                    source={{ uri: selectedPhoto?.uri }}
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                />
                <Button title="Użyj tego zdjęcia" onPress={() => handlePhotoSelect(selectedPhoto!)} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 50,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    assetTile: {
        width: Dimensions.get('window').width / 3 - 16,
        height: Dimensions.get('window').width / 3 - 16,
        margin: 2,
        borderRadius: 5,
    },
    fullScreenImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        marginVertical: 10,
        borderRadius: 10,
    },
});
