import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const GoBackButton = ({ onPress }: { onPress: () => void }) => {
    return (
        <Pressable onPress={onPress}>
            <AntDesign
                style={{ fontWeight: 'bold' }}
                name="arrow-left"
                size={18}
                color="black"
            />
        </Pressable>
    )
}

export default GoBackButton

