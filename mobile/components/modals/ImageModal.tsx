
import * as MediaLibrary from 'expo-media-library';
import React from 'react';
import {
    Button,
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAssetsStore } from '@/lib/store/assetsStore';
import { SafeAreaView } from 'react-native-safe-area-context';


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
    const router = useRouter();

    const handleClose = () => {
        onClose();
    };

    const handlePhotoSelect = (asset: MediaLibrary.Asset | null) => {
        setImage(asset);
        console.log("Selected photo in ImageModal:", image?.filename);
        router.push('/predict');
        handleClose();
    };



    return (
        <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
            <SafeAreaView className='flex-1'>
                <View style={styles.container}>
                    <Button title="Wróć do siatki" onPress={() => handleClose()} />
                    <Image
                        source={{ uri: selectedPhoto?.uri }}
                        style={styles.fullScreenImage}
                        resizeMode="cover"
                    />
                    <Button title="Użyj tego zdjęcia" onPress={() => handlePhotoSelect(selectedPhoto!)} />
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 50,
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
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
        maxHeight: 300,
        marginVertical: 10,
        borderRadius: 10,
    },
});
