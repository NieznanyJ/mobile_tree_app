import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/lib/context/AuthContext";

export default function InfoBanner() {
    const { isOnline, refreshUser } = useAuth();
    const [isRetrying, setIsRetrying] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleRetry = async () => {
        setIsRetrying(true);
        setMessage(null);

        const result = await refreshUser();

        setIsRetrying(false);

        // Feedback na podstawie wyniku
        if (result?.ok) {
            setMessage("✓ Połączono ponownie");
            setTimeout(() => setMessage(null), 3000);
        } else if (result?.unauthorized) {
            setMessage("✗ Sesja wygasła. Zaloguj się ponownie");
            setTimeout(() => setMessage(null), 5000);
        } else if (result?.network) {
            setMessage("⚠ Wciąż brak połączenia");
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (isOnline && !message) return null;

    const showOffline = !isOnline;
    const bgColor = message?.includes("✓")
        ? "bg-green-600"
        : message?.includes("✗")
            ? "bg-red-600"
            : "bg-amber-500";

    return (
        <SafeAreaView className={bgColor}>
            <View className="px-4 py-2 flex-row items-center justify-between">
                <Text className="text-white font-semibold flex-1">
                    {message || "Brak połączenia. Tryb offline."}
                </Text>

                {showOffline && !message && (
                    <Pressable
                        onPress={handleRetry}
                        disabled={isRetrying}
                        className="bg-white/20 px-3 py-1 rounded-lg flex-row items-center gap-2"
                    >
                        {isRetrying ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-white text-sm">Spróbuj ponownie</Text>}
                    </Pressable>
                )}
            </View>
        </SafeAreaView>
    );
}
