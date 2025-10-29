import SimpleInput from '@/components/ui/input/SimpleInput';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Href, Link } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native'; // Użyj Pressable dla przycisków
import { SafeAreaView } from 'react-native-safe-area-context';



const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const inputsData = [
        { id: 'email', type: 'emailAddress', label: 'Email', placeholder: 'email@example.com', value: email, onChangeText: setEmail },
        { id: 'password', type: 'password', label: 'Password', placeholder: 'Password', value: password, onChangeText: setPassword },
    ];



    return (
        <SafeAreaView className='flex-1 bg-white'>


            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <Link href="/" className='w-full p-4 absolute top-10 left-4 z-10'>
                    <AntDesign name="arrow-left" size={24} color="black" />
                </Link>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        padding: 16
                    }}
                    keyboardShouldPersistTaps="handled"
                >


                    <View className='w-full p-4 flex items-center gap-10 justify-center'>
                        <Text className="text-3xl font-bold text-secondary text-center mt-28">Zaloguj się na swoje konto</Text>

                        {inputsData.map((item) => (
                            <SimpleInput
                                key={item.id}
                                label={item.label}
                                placeholder={item.placeholder}
                                value={item.value}
                                onChangeText={item.onChangeText}
                                type={item.type}
                            />
                        ))}


                        <Pressable
                            onPress={() => { }}
                            className="main-button"
                        >
                            <Text className="main-button-text">Zaloguj się</Text>
                        </Pressable>
                    </View>


                    <Text className="mt-10 text-xl text-textPrimary text-center">
                        Nie masz konta?{" "}
                        <Link href={"/register" as Href} className="text-secondary font-bold">Zarejestruj się</Link>
                    </Text>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Login;