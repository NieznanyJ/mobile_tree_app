
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

import GoBackButton from '@/components/ui/GoBackButton';
import { useAssetsStore } from '@/lib/store/assetsStore';

import ImageModal from './ImageModal';

interface AssetModalProps {
  visible: boolean;
  album: MediaLibrary.Album | null;
  assets: MediaLibrary.Asset[];
  onClose: () => void;
  onPhotoSelected: (asset: MediaLibrary.Asset) => void;
}

export default function AssetModal({
  visible,
  album,
  assets,
  onClose,
  onPhotoSelected,
}: AssetModalProps) {
  const [selectedImage, setSelectedImage] = useState<MediaLibrary.Asset | null>(null);

  const handleClose = () => {
    setSelectedImage(null);
    onClose();
  };

  const handlePhotoSelect = (asset: MediaLibrary.Asset) => {
    onPhotoSelected(asset);
    handleClose();
  };

  const renderContent = () => {
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
      <View style={styles.container}>
        <GoBackButton onPress={handleClose} />
        <View className='flex flex-row items-center justify-between'>
          <Text style={styles.title}>{album?.title}</Text>
          <Text className='text-sm '>{album?.assetCount} {album?.assetCount === 1 ? "zdjęcie" : "zdjęcia"}</Text>
        </View>
        <FlatList
          key="asset-grid"
          data={assets}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedImage(item)}>
              <Image source={{ uri: item.uri }} style={styles.assetTile} />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      {renderContent()}
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
