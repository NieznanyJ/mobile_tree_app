import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface ImagePreviewModalProps {
  visible: boolean;
  images: ImageSourcePropType[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ImagePreviewModal({
  visible,
  images,
  initialIndex = 0,
  onClose,
}: ImagePreviewModalProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.counter}>
            {currentIndex + 1} / {images.length}
          </Text>
          <Pressable onPress={onClose} hitSlop={16}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
        </View>

        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          onViewableItemsChanged={onViewableItemsChanged}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image
                source={item}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  counter: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width * 0.95,
    height: height * 0.75,
  },
});
