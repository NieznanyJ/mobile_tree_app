import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

interface CheckboxProps {
    isChecked: boolean;
    setIsChecked: (checked: boolean) => void;
}

const Checkbox = ({ isChecked, setIsChecked }: CheckboxProps) => {
    return (
        <Pressable
            onPress={() => setIsChecked(!isChecked)}
            style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: isChecked ? '#00964a' : '#9ca3af',
                backgroundColor: isChecked ? '#00964a' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {isChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
        </Pressable>
    )
}

export default Checkbox

const styles = StyleSheet.create({})