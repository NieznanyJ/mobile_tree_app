import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import React from 'react'
import { Text, View } from 'react-native'

import Button from './Button';

const CTA = () => {
    const router = useRouter();

    return (
        <View className="w-full items-center px-4 py-6">
            <View className="w-full bg-white rounded-2xl p-6 items-center ">
                <Text className="text-lg font-semibold text-gray-900 mb-1 text-center">
                    Poznaj gatunek drzewa
                </Text>
                <Text className="text-sm text-gray-500 mb-5 text-center">
                    Zrób zdjęcie, a my zidentyfikujemy gatunek
                </Text>
                <Button
                    title="Zrób zdjęcie"
                    className="w-full mt-0"
                    onPress={() => router.push("/(tabs)/camera")}
                >
                    <Ionicons name="camera" size={22} color="#fff" />
                </Button>
            </View>
        </View>
    )
}

export default CTA
