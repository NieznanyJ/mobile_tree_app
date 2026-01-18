import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface LoadingOverlayProps {
    text?: string;
}

const LoadingOverlay = ({ text = "Ładowanie..." }: LoadingOverlayProps) => {
    return (
        <View className="absolute inset-0 bg-black/40 items-center justify-center z-20">
            <View className="bg-white/90 px-4 py-3 rounded-xl items-center gap-2 min-w-[180px]">
                <ActivityIndicator size="large" color="#16a34a" />
                <Text className="text-sm font-semibold text-gray-800">{text}</Text>
            </View>
        </View>
    );
};

export default LoadingOverlay;
