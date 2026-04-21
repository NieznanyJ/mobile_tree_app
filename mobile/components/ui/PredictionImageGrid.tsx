import Ionicons from '@expo/vector-icons/build/Ionicons'
import { router } from 'expo-router'
import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

import { PredictionImageGridProps } from '@/types/components'



const PredictionImageGrid = ({ slots, preview, removeAssetForPrediction, colors, GRID_SPACING, SLOT_SIZE }: PredictionImageGridProps) => {
    return (
        <View
            className="flex-row flex-wrap justify-between"
            style={{ gap: GRID_SPACING }}
        >
            {slots.map((asset, index) => (
                <View
                    key={asset?.id ?? `empty-${index}`}
                    style={{ width: SLOT_SIZE, height: SLOT_SIZE }}
                    className="rounded-xl overflow-hidden"
                >
                    {asset ? (
                        <View className="relative w-full h-full">
                            <Pressable onPress={() => preview.open(index)}>
                                <Image
                                    source={{ uri: asset.uri }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </Pressable>
                            <Pressable
                                onPress={() => removeAssetForPrediction(asset.id)}
                                className="absolute top-2 right-2 bg-black/60 rounded-full w-7 h-7 items-center justify-center"
                            >
                                <Ionicons name="close" size={18} color="#fff" />
                            </Pressable>
                        </View>
                    ) : (
                        <Pressable
                            onPress={() =>
                                router.push("/(tabs)/gallery")
                            }
                            className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl items-center justify-center bg-gray-50"
                        >
                            <Ionicons name="add" size={32} color={colors.text.muted} />
                            <Text className="text-gray-400 text-xs mt-1">Dodaj</Text>
                        </Pressable>
                    )}
                </View>
            ))}
        </View>
    )
}

export default PredictionImageGrid

const styles = StyleSheet.create({})