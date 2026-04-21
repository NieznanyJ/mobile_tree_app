import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Button from "@/components/ui/Button";
import SkeletonBox from "@/components/ui/SkeletonBox";
import { useAssetsStore } from "@/lib/store/assetsStore";

export default function Picker() {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
        mediaTypes: MediaLibrary.MediaType.photo,
    });
    const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const { setRecentImages } = useAssetsStore();

    useEffect(() => {
        (async () => {
            if (permissionResponse?.status !== "granted") {
                const permission = await requestPermission();
                if (!permission.granted) return;
            }

            const res = await MediaLibrary.getAssetsAsync({
                first: 200,
                sortBy: [MediaLibrary.SortBy.creationTime],
                mediaType: [MediaLibrary.MediaType.photo],
            });
            setAssets(res.assets);
        })();
    }, [permissionResponse?.status]);

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleConfirm = () => {
        const chosen = assets.filter((a) => selected.has(a.id));
        setRecentImages(chosen);
        router.back();
    };

    const renderItem = ({ item }: { item: MediaLibrary.Asset }) => {
        const active = selected.has(item.id);
        return (
            <TouchableOpacity onPress={() => toggle(item.id)} activeOpacity={0.85}>
                <Image
                    source={{ uri: item.uri }}
                    style={{ width: 120, height: 120, borderRadius: 8 }}
                />
                {active && (
                    <View
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(0,0,0,0.35)",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 8,
                        }}
                    >
                        <Text className="text-white font-bold text-lg">✓</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (permissionResponse?.status === "denied") {
        return (
            <View className="flex-1 items-center justify-center p-6 bg-background">
                <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                    <MaterialCommunityIcons name="image-off" size={28} color="#9ca3af" />
                </View>
                <Text className="text-center text-base text-gray-700 mb-2">
                    Brak dostępu do galerii
                </Text>
                <Text className="text-center text-sm text-gray-500 mb-6">
                    Musisz udzielić dostępu do galerii, aby wybrać zdjęcia.
                </Text>
                <Button title="Daj dostęp" onPress={requestPermission} className="w-auto px-8" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <View className="flex-row justify-between items-center p-4">
                <Pressable onPress={() => router.back()} hitSlop={8}>
                    <Text className="text-secondary font-semibold">Anuluj</Text>
                </Pressable>
                <Text className="text-lg font-semibold">Wybierz zdjęcia</Text>
                <Button
                    title={`Dodaj (${selected.size})`}
                    onPress={handleConfirm}
                    disabled={selected.size === 0}
                    className="w-auto px-6"
                    textClassName="text-sm"
                />
            </View>

            {assets.length === 0 ? (
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 6,
                        padding: 8,
                    }}
                >
                    {Array.from({ length: 15 }).map((_, i) => (
                        <SkeletonBox
                            key={i}
                            width={120}
                            height={120}
                            borderRadius={8}
                        />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={assets}
                    numColumns={3}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ gap: 6, padding: 8 }}
                    columnWrapperStyle={{ gap: 6 }}
                />
            )}
        </View>
    );
}
