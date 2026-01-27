import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import treesData from "@/assets/data/trees.json";
import treeImages from "@/assets/images/trees";
import SearchInput from "@/components/ui/input/SearchInput";
import { useSettingsStore } from "@/lib/store/settingsStore";

interface Tree {
    id: string;
    commonName: string;
    scientificName: string;
    description: string;
    occurrence: string;
    images: string[];
}

const Atlas = () => {
    const router = useRouter();
    const { setDisplayOption, displayOption } = useSettingsStore();
    const [search, setSearch] = useState("");

    const filteredTrees = useMemo(() => {
        if (!search.trim()) return treesData as Tree[];
        const query = search.toLowerCase().trim();
        return (treesData as Tree[]).filter(
            (tree) =>
                tree.commonName.toLowerCase().includes(query) ||
                tree.scientificName.toLowerCase().includes(query)
        );
    }, [search]);

    const handleTreePress = (id: string) => {
        router.push(`/tree/${id}`);
    };

    const renderCardItem = ({ item }: { item: Tree }) => (
        <Pressable
            className="flex-1 m-1.5 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            onPress={() => handleTreePress(item.id)}
        >
            {treeImages[item.id]?.[0] ? (
                <Image
                    source={treeImages[item.id][0]}
                    className="w-full h-24 rounded-xl mb-3"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-full h-24 bg-gray-100 rounded-xl mb-3 items-center justify-center">
                    <MaterialCommunityIcons name="tree" size={40} color="#00964a" />
                </View>
            )}
            <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                {item.commonName}
            </Text>
            <Text className="text-sm italic text-gray-500 mt-0.5" numberOfLines={1}>
                {item.scientificName}
            </Text>
        </Pressable>
    );

    const renderListItem = ({ item }: { item: Tree }) => (
        <Pressable
            className="flex-row items-center bg-white rounded-xl p-3 mx-3 mb-2 shadow-sm border border-gray-100"
            onPress={() => handleTreePress(item.id)}
        >
            {treeImages[item.id]?.[0] ? (
                <Image
                    source={treeImages[item.id][0]}
                    className="w-12 h-12 rounded-xl mr-3"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mr-3">
                    <MaterialCommunityIcons name="tree" size={24} color="#00964a" />
                </View>
            )}
            <View className="flex-1">
                <Text className="text-base font-bold text-gray-900">
                    {item.commonName}
                </Text>
                <Text className="text-sm italic text-gray-500">
                    {item.scientificName}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </Pressable>
    );

    return (
        <View className="flex-1 pt-4 bg-background">
            <View className="px-4 pt-2 pb-3 gap-3">
                <View className="flex-row items-center justify-between">
                    <Text className="text-2xl font-bold text-gray-900">
                        Atlas drzew
                    </Text>
                    <Pressable
                        className="bg-gray-100 rounded-xl p-2"
                        onPress={() => {
                            setDisplayOption(displayOption === "grid" ? "list" : "grid");
                        }}
                    >
                        <Ionicons
                            name={displayOption === "grid" ? "list" : "grid"}
                            size={20}
                            color="#00964a"
                        />
                    </Pressable>
                </View>
                <SearchInput
                    value={search}
                    onChangeText={setSearch}
                    handleReset={() => setSearch("")}
                    placeholder="Szukaj drzewa..."
                />
            </View>

            {
                filteredTrees.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-4">
                        <MaterialCommunityIcons name="tree" size={48} color="#d1d5db" />
                        <Text className="text-gray-400 text-base mt-3">
                            Nie znaleziono drzew
                        </Text>
                    </View>
                ) : displayOption === "grid" ? (
                    <FlashList
                        data={filteredTrees}
                        renderItem={renderCardItem}
                        numColumns={2}
                        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <FlashList
                        data={filteredTrees}
                        renderItem={renderListItem}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyExtractor={(item) => item.id}
                    />
                )
            }
        </View >
    );
};

export default Atlas;
