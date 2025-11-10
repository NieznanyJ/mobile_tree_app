import { Stack } from "expo-router";
import React from "react";

const MediaBrowserLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="all-photos"
                options={{
                    headerTitle: "Wszystkie zdjęcia",
                    headerShadowVisible: false,
                    headerTitleAlign: "center",
                    headerShown: true, // Upewniamy się, że nagłówek jest widoczny
                }}
            />
            <Stack.Screen
                name="all-albums"
                options={{
                    headerTitle: "Wszystkie foldery",
                    headerShadowVisible: false,
                    headerTitleAlign: "center",
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="[albumId]"
                options={{
                    headerTitle: "Album",
                    headerShadowVisible: false,
                    headerTitleAlign: "center",
                    headerShown: true,
                }}
            />
        </Stack>
    );
};

export default MediaBrowserLayout;