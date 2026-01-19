import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Button from "@/components/ui/Button";
import { useAssetsStore } from "@/lib/store/assetsStore";

export default function Picker() {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
        mediaTypes: MediaLibrary.MediaType.photo,
    });
    const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const { setSelectedAssets } = useAssetsStore();

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
        setSelectedAssets(chosen);
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
            <View className="flex-1 items-center justify-center p-6 bg-white">
                <Text className="text-center text-base mb-4">
                    Musisz udzielić dostępu do galerii, aby wybrać zdjęcia.
                </Text>
                <Button title="Daj dostęp" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row justify-between items-center p-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-blue-600 font-semibold">Anuluj</Text>
                </TouchableOpacity>
                <Text className="text-lg font-semibold">Wybierz zdjęcia</Text>
                <Button
                    title={`Dodaj (${selected.size})`}
                    onPress={handleConfirm}
                    disabled={selected.size === 0}
                    size="sm"
                />
            </View>

            {assets.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="small" />
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
