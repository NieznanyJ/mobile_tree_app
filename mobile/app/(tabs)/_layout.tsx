import { Tabs } from 'expo-router'
import React from 'react'

const _layout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ headerShown: false, title: 'Index' }} />
            <Tabs.Screen name="profile" options={{ headerShown: false, title: 'Profile' }} />
            <Tabs.Screen name="history" options={{ headerShown: false, title: 'History' }} />
            <Tabs.Screen name="camera" options={{ headerShown: false, title: 'Camera' }} />
        </Tabs>
    )
}

export default _layout