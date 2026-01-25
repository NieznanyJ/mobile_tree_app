import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import { useAuth } from "@/lib/context/AuthContext";

const DISMISS_THRESHOLD = 60;

type BannerType = "offline" | "online" | "guest";

interface BannerConfig {
    bg: string;
    text: string;
    type: BannerType;
}

export default function InfoBanner() {
    const { isOnline, isGuest, refreshUser } = useAuth();
    const [isRetrying, setIsRetrying] = useState(false);
    const [activeBanner, setActiveBanner] = useState<BannerConfig | null>(null);
    const [dismissed, setDismissed] = useState<Set<BannerType>>(new Set());

    const prevOnlineRef = useRef(isOnline);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    // Handle offline/online transitions
    useEffect(() => {
        const wasOnline = prevOnlineRef.current;
        prevOnlineRef.current = isOnline;

        if (!isOnline) {
            // Went offline - show yellow banner, reset dismissed for offline
            setDismissed((prev) => {
                const next = new Set(prev);
                next.delete("offline");
                return next;
            });
            setActiveBanner({
                bg: "bg-amber-500",
                text: "Brak połączenia. Tryb offline.",
                type: "offline",
            });
            resetAnimation();
        } else if (!wasOnline && isOnline) {
            // Came back online - show green banner
            setDismissed((prev) => {
                const next = new Set(prev);
                next.delete("online");
                return next;
            });
            setActiveBanner({
                bg: "bg-green-600",
                text: "Połączono ponownie.",
                type: "online",
            });
            resetAnimation();
            // Auto-dismiss after 3s
            setTimeout(() => {
                setDismissed((prev) => new Set(prev).add("online"));
            }, 3000);
        }
    }, [isOnline]);

    // Handle guest banner (show only if online and guest, and no network banner active)
    useEffect(() => {
        if (isGuest && isOnline && !activeBanner) {
            setActiveBanner({
                bg: "bg-blue-500",
                text: "Tryb gościa — niektóre funkcje są ograniczone.",
                type: "guest",
            });
            resetAnimation();
        }
    }, [isGuest, isOnline]);

    // Determine which banner to show based on priority
    useEffect(() => {
        if (!isOnline && !dismissed.has("offline")) {
            setActiveBanner({
                bg: "bg-amber-500",
                text: "Brak połączenia. Tryb offline.",
                type: "offline",
            });
        } else if (activeBanner?.type === "online" && !dismissed.has("online")) {
            // keep online banner
        } else if (isGuest && isOnline && !dismissed.has("guest")) {
            setActiveBanner({
                bg: "bg-blue-500",
                text: "Tryb gościa — niektóre funkcje są ograniczone.",
                type: "guest",
            });
        } else if (activeBanner && dismissed.has(activeBanner.type)) {
            setActiveBanner(null);
        }
    }, [dismissed, isOnline, isGuest]);

    const resetAnimation = () => {
        translateX.value = withSpring(0);
        opacity.value = withTiming(1, { duration: 200 });
    };

    const dismiss = () => {
        if (activeBanner) {
            setDismissed((prev) => new Set(prev).add(activeBanner.type));
        }
    };

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (e.translationX > 0) {
                translateX.value = e.translationX;
            }
        })
        .onEnd((e) => {
            if (e.translationX > DISMISS_THRESHOLD) {
                translateX.value = withTiming(400, { duration: 200 });
                opacity.value = withTiming(0, { duration: 200 }, () => {
                    runOnJS(dismiss)();
                });
            } else {
                translateX.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value,
    }));

    const handleRetry = async () => {
        setIsRetrying(true);
        const result = await refreshUser();
        setIsRetrying(false);

        if (result?.ok) {
            // online transition will be handled by useEffect
        } else if (result?.unauthorized) {
            setActiveBanner({
                bg: "bg-red-600",
                text: "Sesja wygasła. Zaloguj się ponownie.",
                type: "offline",
            });
        }
    };

    // Don't render if no active banner or it's dismissed
    if (!activeBanner || dismissed.has(activeBanner.type)) return null;

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View
                style={animatedStyle}
                className={`${activeBanner.bg} w-[96%] absolute top-10 z-50 px-5 py-4 rounded-lg self-center`}
            >
                <View className="flex-row items-center justify-between">
                    <Text className="text-white font-semibold flex-1 text-[13px]">
                        {activeBanner.text}
                    </Text>

                    {activeBanner.type === "offline" && (
                        <Pressable
                            onPress={handleRetry}
                            disabled={isRetrying}
                            className="bg-white/20 px-3 py-1.5 rounded-lg ml-2"
                        >
                            {isRetrying ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text className="text-white text-xs font-medium">Ponów</Text>
                            )}
                        </Pressable>
                    )}

                    {activeBanner.type === "guest" && (
                        <Pressable
                            onPress={() => router.push("/guest-info" as any)}
                            className="bg-white/20 px-3 py-1.5 rounded-lg ml-2"
                        >
                            <Text className="text-white text-xs font-medium">Więcej</Text>
                        </Pressable>
                    )}
                </View>
            </Animated.View>
        </GestureDetector>
    );
}
