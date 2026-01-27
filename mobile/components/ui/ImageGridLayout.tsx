import * as MediaLibrary from "expo-media-library";
import React from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DEFAULT_GRID_SIZE = SCREEN_WIDTH - 32;

export interface GridAsset {
  uri: string;
  thumbnailUri?: string;
}

interface ImageGridLayoutProps {
  assets: GridAsset[];
  gridSize?: number;
  onImagePress?: (asset: GridAsset, index: number) => void;
  startIndex?: number;
}

const getImageSource = (asset: GridAsset): ImageSourcePropType => ({
  uri: asset.thumbnailUri || asset.uri,
});

interface ImageCellProps {
  asset: GridAsset;
  width: number;
  height: number;
  onPress?: () => void;
}

const ImageCell = ({ asset, width, height, onPress }: ImageCellProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Image
      source={getImageSource(asset)}
      style={[styles.image, { width, height }]}
    />
  </TouchableOpacity>
);

const FourImageLayout = ({
  assets,
  gridSize,
  onImagePress,
  startIndex,
}: Required<Omit<ImageGridLayoutProps, "assets">> & { assets: GridAsset[] }) => {
  const halfSize = gridSize / 2 - 8;
  const quarterSize = gridSize / 4 - 8;

  return (
    <View style={{ width: gridSize }} className="flex flex-row gap-2">
      <ImageCell
        asset={assets[0]}
        width={halfSize}
        height={halfSize}
        onPress={() => onImagePress?.(assets[0], startIndex)}
      />
      <View className="flex-1 flex flex-col justify-between">
        <View className="flex flex-row gap-2">
          <ImageCell
            asset={assets[1]}
            width={quarterSize}
            height={quarterSize}
            onPress={() => onImagePress?.(assets[1], startIndex + 1)}
          />
          <ImageCell
            asset={assets[2]}
            width={quarterSize}
            height={quarterSize}
            onPress={() => onImagePress?.(assets[2], startIndex + 2)}
          />
        </View>
        <View className="flex-row">
          <ImageCell
            asset={assets[3]}
            width={halfSize}
            height={quarterSize}
            onPress={() => onImagePress?.(assets[3], startIndex + 3)}
          />
        </View>
      </View>
    </View>
  );
};

const ThreeImageLayout = ({
  assets,
  gridSize,
  onImagePress,
  startIndex,
}: Required<Omit<ImageGridLayoutProps, "assets">> & { assets: GridAsset[] }) => {
  const halfSize = gridSize / 2 - 8;
  const quarterHeight = gridSize / 4 - 8;

  return (
    <View
      style={{ width: gridSize, marginRight: 16 }}
      className="flex flex-row gap-2"
    >
      <ImageCell
        asset={assets[0]}
        width={halfSize}
        height={halfSize}
        onPress={() => onImagePress?.(assets[0], startIndex)}
      />
      <View className="flex-1 flex flex-col justify-between">
        <ImageCell
          asset={assets[1]}
          width={halfSize}
          height={quarterHeight}
          onPress={() => onImagePress?.(assets[1], startIndex + 1)}
        />
        <ImageCell
          asset={assets[2]}
          width={halfSize}
          height={quarterHeight}
          onPress={() => onImagePress?.(assets[2], startIndex + 2)}
        />
      </View>
    </View>
  );
};

const TwoImageLayout = ({
  assets,
  gridSize,
  onImagePress,
  startIndex,
}: Required<Omit<ImageGridLayoutProps, "assets">> & { assets: GridAsset[] }) => {
  const halfWidth = gridSize / 2;
  const halfHeight = gridSize / 2 - 8;
  const gap = SCREEN_WIDTH * 0.02;

  return (
    <View
      style={{ width: gridSize, marginRight: 16 }}
      className="flex flex-row"
    >
      <ImageCell
        asset={assets[0]}
        width={halfWidth}
        height={halfHeight}
        onPress={() => onImagePress?.(assets[0], startIndex)}
      />
      <View style={{ marginLeft: gap }}>
        <ImageCell
          asset={assets[1]}
          width={halfWidth}
          height={halfHeight}
          onPress={() => onImagePress?.(assets[1], startIndex + 1)}
        />
      </View>
    </View>
  );
};

const SingleImageLayout = ({
  assets,
  gridSize,
  onImagePress,
  startIndex,
}: Required<Omit<ImageGridLayoutProps, "assets">> & { assets: GridAsset[] }) => {
  const size = gridSize / 2 - 8;

  return (
    <View style={{ width: gridSize, marginRight: 16 }}>
      <ImageCell
        asset={assets[0]}
        width={size}
        height={size}
        onPress={() => onImagePress?.(assets[0], startIndex)}
      />
    </View>
  );
};

export default function ImageGridLayout({
  assets,
  gridSize = DEFAULT_GRID_SIZE,
  onImagePress,
  startIndex = 0,
}: ImageGridLayoutProps) {
  if (assets.length === 0) return null;

  const layoutProps = {
    assets,
    gridSize,
    onImagePress: onImagePress || (() => {}),
    startIndex,
  };

  switch (assets.length) {
    case 4:
      return <FourImageLayout {...layoutProps} />;
    case 3:
      return <ThreeImageLayout {...layoutProps} />;
    case 2:
      return <TwoImageLayout {...layoutProps} />;
    default:
      return <SingleImageLayout {...layoutProps} />;
  }
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    objectFit: "cover",
  },
});
