import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface PredictionHistory {
    id: string;
    image: string;
    species: string;
    confidence: number;
    date: Date;
    allPredictions?: Array<{ species: string; confidence: number }>;
}

// Placeholder data
const MOCK_HISTORY: PredictionHistory[] = [
    {
        id: "1",
        image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
        species: "Dąb Szypułkowy",
        confidence: 94.5,
        date: new Date(2026, 0, 18, 14, 30),
        allPredictions: [
            { species: "Dąb Szypułkowy", confidence: 94.5 },
            { species: "Dąb Bezszypułkowy", confidence: 4.2 },
            { species: "Buk Zwyczajny", confidence: 1.3 },
        ],
    },
    {
        id: "2",
        image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
        species: "Sosna Zwyczajna",
        confidence: 89.2,
        date: new Date(2026, 0, 17, 10, 15),
        allPredictions: [
            { species: "Sosna Zwyczajna", confidence: 89.2 },
            { species: "Świerk Pospolity", confidence: 7.8 },
            { species: "Jodła Pospolita", confidence: 3.0 },
        ],
    },
    {
        id: "3",
        image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400",
        species: "Klon Zwyczajny",
        confidence: 97.8,
        date: new Date(2026, 0, 16, 16, 45),
        allPredictions: [
            { species: "Klon Zwyczajny", confidence: 97.8 },
            { species: "Klon Jawor", confidence: 1.5 },
            { species: "Jesion Wyniosły", confidence: 0.7 },
        ],
    },
    {
        id: "4",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
        species: "Brzoza Brodawkowata",
        confidence: 92.1,
        date: new Date(2026, 0, 15, 9, 20),
    },
    {
        id: "5",
        image: "https://images.unsplash.com/photo-1540270776932-e72e7c2d11cd?w=400",
        species: "Świerk Pospolity",
        confidence: 88.7,
        date: new Date(2026, 0, 14, 13, 10),
    },
];

const HistoryScreen = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [historyData, setHistoryData] = useState<PredictionHistory[]>([]);

    useEffect(() => {
        const load = async () => {
            // TODO: replace with real fetch; keep mock for dev/testing
            await new Promise((r) => setTimeout(r, 600));
            setHistoryData(MOCK_HISTORY);
            setIsLoading(false);
        };
        load();
    }, []);

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return `Dzisiaj, ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
        } else if (diffDays === 1) {
            return "Wczoraj";
        } else if (diffDays < 7) {
            return `${diffDays} dni temu`;
        } else {
            return date.toLocaleDateString("pl-PL");
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 90) return "text-green-600";
        if (confidence >= 75) return "text-yellow-600";
        return "text-orange-600";
    };

    const renderItem = ({ item }: { item: PredictionHistory }) => {
        const isExpanded = expandedId === item.id;

        return (
            <Pressable
                onPress={() => setExpandedId(isExpanded ? null : item.id)}
                className="bg-background rounded-lg mb-3 shadow-sm overflow-hidden"
            >
                <View className="flex-row p-4">
                    <Image
                        source={{ uri: item.image }}
                        className="w-20 h-20 rounded-lg"
                        resizeMode="cover"
                    />

                    <View className="flex-1 ml-4 justify-between">
                        <View>
                            <Text className="text-lg font-semibold text-textPrimary mb-1">
                                {item.species}
                            </Text>
                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(item.date)}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between">
                            <Text className={`text-sm font-semibold ${getConfidenceColor(item.confidence)}`}>
                                {item.confidence.toFixed(1)}% pewności
                            </Text>
                            {item.allPredictions && (
                                <MaterialIcons
                                    name={isExpanded ? "expand-less" : "expand-more"}
                                    size={24}
                                    color="#9ca3af"
                                />
                            )}
                        </View>
                    </View>
                </View>

                {isExpanded && item.allPredictions && (
                    <View className="border-t border-gray-200 p-4 bg-gray-50">
                        <Text className="text-sm font-semibold text-textPrimary mb-2">
                            Wszystkie wyniki:
                        </Text>
                        {item.allPredictions.map((pred, index) => (
                            <View key={index} className="flex-row justify-between items-center mb-2">
                                <Text className="text-sm text-gray-600">
                                    {index + 1}. {pred.species}
                                </Text>
                                <Text className={`text-sm font-semibold ${getConfidenceColor(pred.confidence)}`}>
                                    {pred.confidence.toFixed(1)}%
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <View className="flex-1">
                {/* Header with stats and back button */}
                <View className="bg-secondary p-4 pb-6">

                    <View className="flex-row justify-around">
                        <View className="items-center">
                            <Text className="text-3xl font-bold text-white">
                                {MOCK_HISTORY.length}
                            </Text>
                            <Text className="text-sm text-white/80">Przewidywań</Text>
                        </View>

                        <View className="items-center">
                            <Text className="text-3xl font-bold text-white">
                                {new Set(MOCK_HISTORY.map(h => h.species)).size}
                            </Text>
                            <Text className="text-sm text-white/80">Gatunków</Text>
                        </View>

                        <View className="items-center">
                            <Text className="text-3xl font-bold text-white">
                                {(MOCK_HISTORY.reduce((acc, h) => acc + h.confidence, 0) / MOCK_HISTORY.length).toFixed(0)}%
                            </Text>
                            <Text className="text-sm text-white/80">Śr. pewność</Text>
                        </View>
                    </View>
                </View>

                {/* History list */}
                {isLoading ? (
                    <View className="p-4 gap-3">
                        {[1, 2, 3].map((i) => (
                            <View
                                key={i}
                                className="bg-background rounded-lg shadow-sm overflow-hidden border border-gray-100"
                            >
                                <View className="flex-row p-4 gap-4">
                                    <View className="w-20 h-20 rounded-lg bg-gray-200" />
                                    <View className="flex-1 gap-2">
                                        <View className="h-4 w-2/3 bg-gray-200 rounded" />
                                        <View className="h-3 w-1/2 bg-gray-200 rounded" />
                                        <View className="h-3 w-1/3 bg-gray-200 rounded" />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <FlatList
                        data={historyData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 16 }}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-12">
                                <MaterialIcons name="history" size={64} color="#d1d5db" />
                                <Text className="text-xl text-gray-500 mt-4 mb-2">
                                    Brak historii
                                </Text>
                                <Text className="text-sm text-gray-400 text-center">
                                    Zrób pierwsze zdjęcie, aby zobaczyć historię przewidywań
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default HistoryScreen;
