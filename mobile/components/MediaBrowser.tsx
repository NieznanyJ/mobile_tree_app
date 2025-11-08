
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import AlbumGrid from '@/components/AlbumGrid';
import AssetModal from '@/components/modals/AssetModal';
import ImageModal from '@/components/modals/ImageModal';
import RecentPhotosRow from '@/components/RecentPhotosRow';
import { useMediaLibrary } from '@/lib/hooks/useMediaLibrary';
import { useAssetsStore } from '@/lib/store/assetsStore';

const MediaBrowser = () => {

  const { albums, assets, getAssets, getAlbums } = useMediaLibrary();
  const { album, setAlbum } = useAssetsStore();

  const [isAssetsModalVisible, setAssetsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaLibrary.Asset | null>(null);


  const handleAlbumSelected = (album: MediaLibrary.Album) => {
    setAlbum(album);
    getAssets(album);
    setAssetsModalVisible(true);
  };

  const handlePhotoSelected = (asset: MediaLibrary.Asset) => {
    setSelectedImage(asset);
  };

  return (
    <View className='flex flex-col  gap-10'>
      <RecentPhotosRow onPhotoSelected={handlePhotoSelected} />

      <AlbumGrid albums={albums} onAlbumSelected={handleAlbumSelected} onRefresh={getAlbums} albumsPerPage={4} />

      <AssetModal
        visible={isAssetsModalVisible}
        album={album}
        assets={assets}
        onClose={() => setAssetsModalVisible(false)}
        onPhotoSelected={handlePhotoSelected}
      />

      <ImageModal
        visible={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onPhotoSelected={setSelectedImage}
        selectedPhoto={selectedImage}
      />
    </View>
  )
}

export default MediaBrowser

