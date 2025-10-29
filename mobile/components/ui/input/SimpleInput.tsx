import React from 'react';
import { Text, TextInput, View } from 'react-native';


export interface InputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    type?: string;
    label?: string;
    error?: string;
    className?: string;
    setError?: (error: string) => void;
}

const SimpleInput = ({ placeholder, value, onChangeText, label, className, type = 'default', error, setError }: InputProps) => {

    const onChange = (value: string) => {
        onChangeText(value)
        setError?.('')
    }

    const keyboardType = type === 'emailAddress' ? 'email-address' : type === 'numeric' ? 'numeric' : 'default'
    const secureTextEntry = type === 'password'

    return (
        <View className='w-full flex flex-col gap-3'>
            {label && <Text className='text-gray-600 mb-1'>{label}</Text>}
            <TextInput keyboardType={keyboardType} secureTextEntry={secureTextEntry} className={`form-input border-b-2 text-xl ${className}`} placeholder={placeholder} value={value} onChangeText={onChange} style={{ borderColor: error ? '#dc2626' : '#d1d5db' }} />
            <View className="h-5 mt-1">
                {error && (
                    <Text className='text-red-500 text-sm' style={{ color: '#dc2626' }}>
                        {error}
                    </Text>
                )}
            </View>
        </View>
    )
}

export default SimpleInput

