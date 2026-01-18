import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';

export default function TestErrorButtonDev() {
    return (
        <View className="mt-6 pt-6 border-t border-gray-300">
            <Text className="text-lg font-bold text-red-600 mb-3">
                🧪 Developer Tools
            </Text>
            <Pressable
                onPress={() => {
                    throw new Error("🔴 Test Error Boundary - Intentional Error!");
                }}
                className="bg-red-600 active:bg-red-700 rounded-lg p-4 flex-row items-center justify-center gap-2"
            >
                <MaterialIcons name="bug-report" size={20} color="#fff" />
                <Text className="text-white font-semibold">
                    Test Error Boundary
                </Text>
            </Pressable>
            <Text className="text-xs text-gray-500 text-center mt-2">
                Kliknij aby wyzwolić testowy error
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({})