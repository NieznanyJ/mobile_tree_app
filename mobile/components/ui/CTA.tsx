import { Dimensions, StyleSheet, Text, View, Pressable } from 'react-native'
import React, { act } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Button from './Button';
import { useSettingsStore } from '@/lib/store/settingsStore';

const { width } = Dimensions.get("window");

const CTA = () => {
    return (
        <View className="flex-1 flex w-full items-center justify-center" >
            {/* Tekst zachęty powyżej przycisku */}
            < Text style={styles.label}> Ciekawi Cię to drzewo ?</Text>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed
                ]}
                onPress={() => router.push("/camera")}
            >
                <Button title='Zidentyfikuj drzewo' className='flex-row-reverse gap-2 items-center justify-center'  >
                    <Ionicons
                        name="camera"
                        size={28}
                        color="#fff"
                    />
                </Button>

            </Pressable>
        </View >
    )
}

export default CTA

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#00964A',
        marginBottom: 12,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#4CAF50', // Żywa zieleń
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 30, // Zaokrąglony kształt jest bardziej przyjazny
        width: width * 0.8, // Przycisk na 80% szerokości ekranu (wygodniejszy niż 1/3)
        gap: 12,
        elevation: 5, // Cień na Androida
        shadowColor: '#000', // Cień na iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }]
    }
})