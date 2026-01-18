import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Button from './Button';
import { useRouter } from 'expo-router';

const CTA = () => {
    const router = useRouter();

    return (
        <View className="flex-1 flex w-full items-center justify-center" >
            {/* Tekst zachęty powyżej przycisku */}
            <Text style={styles.label}>Poznaj gatunek tego drzewa!</Text>

            <Button
                title='Zrób zdjęcie i zidentyfikuj'
                className='flex-row-reverse gap-2 items-center justify-center'
                onPress={() => router.push("/(tabs)/camera")}
            >
                <Ionicons
                    name="camera"
                    size={28}
                    color="#fff"
                />
            </Button>
        </View >
    )
}

export default CTA

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#00964A',
        marginBottom: 12,
        textAlign: 'center',
    },
})