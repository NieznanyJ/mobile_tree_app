import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import treesData from "@/assets/data/trees.json";
import treeImages from "@/assets/images/trees";
import ImagePreviewModal from "@/components/modals/ImagePreviewModal";

interface Tree {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  occurrence: string;
  images: string[];
}

export default function TreeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tree = (treesData as Tree[]).find((t) => t.id === id);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  if (!tree) {
    return (
      <>
        <Stack.Screen options={{ headerTitle: "Nie znaleziono" }} />
        <View className="flex-1 items-center justify-center bg-background px-4">
          <MaterialCommunityIcons name="tree" size={64} color="#d1d5db" />
          <Text className="text-gray-400 text-lg mt-4">
            Nie znaleziono drzewa
          </Text>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerTitle: tree.commonName }} />
      <ScrollView className="flex-1 bg-background">
        {treeImages[tree.id]?.[0] ? (
          <Pressable onPress={() => openPreview(0)}>
            <Image
              source={treeImages[tree.id][0]}
              className="w-full h-52"
              resizeMode="cover"
            />
          </Pressable>
        ) : (
          <View className="w-full h-52 bg-gray-100 items-center justify-center">
            <MaterialCommunityIcons name="tree" size={80} color="#00964a" />
          </View>
        )}

        <View className="px-5 pt-5 pb-8">
          <Text className="text-2xl font-bold text-gray-900">
            {tree.commonName}
          </Text>
          <Text className="text-lg italic text-gray-500 mt-1">
            {tree.scientificName}
          </Text>

          <View className="mt-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="document-text-outline" size={18} color="#00964a" />
              <Text className="text-base font-bold text-gray-800 ml-2">
                Opis
              </Text>
            </View>
            <Text className="text-base text-gray-700 leading-6">
              {tree.description}
            </Text>
          </View>

          <View className="mt-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={18} color="#00964a" />
              <Text className="text-base font-bold text-gray-800 ml-2">
                Występowanie
              </Text>
            </View>
            <Text className="text-base text-gray-700 leading-6">
              {tree.occurrence}
            </Text>
          </View>

          {treeImages[tree.id] && treeImages[tree.id].length > 0 && (
            <View className="mt-6">
              <View className="flex-row items-center mb-3">
                <Ionicons name="images-outline" size={18} color="#00964a" />
                <Text className="text-base font-bold text-gray-800 ml-2">
                  Galeria
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {treeImages[tree.id].map((imageSource, index) => (
                  <Pressable key={index} onPress={() => openPreview(index)}>
                    <Image
                      source={imageSource}
                      className="w-40 h-40 rounded-xl mr-3"
                      resizeMode="cover"
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {treeImages[tree.id] && (
        <ImagePreviewModal
          visible={previewVisible}
          images={treeImages[tree.id]}
          initialIndex={previewIndex}
          onClose={() => setPreviewVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}
