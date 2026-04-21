import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const LIMITATIONS = [
  {
    icon: "time-outline" as const,
    title: "Historia przewidywań",
    description: "Nie masz dostępu do historii swoich zidentyfikowanych drzew. Wyniki nie są zapisywane.",
  },
  {
    icon: "cloud-outline" as const,
    title: "Model serwerowy",
    description:
      "Nie masz dostępu do zaawansowanego modelu klasyfikatora działającego na serwerze. Dostępny jest tylko model lokalny.",
  },
];

export default function GuestInfoScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <View className="flex-1">
        <View className="items-center mb-8 ">
          <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
            <Ionicons className="rounded-full" name="person-outline" size={32} color="#00964A" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Tryb gościa
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-2">
            Korzystasz z aplikacji bez konta. Niektóre funkcje są niedostępne.
          </Text>
        </View>

        <View className="gap-4">
          {LIMITATIONS.map((item, index) => (
            <View
              key={index}
              className="flex-row items-start gap-4 bg-gray-50 p-4 rounded-xl"
            >
              <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mt-0.5">
                <Ionicons name={item.icon} size={20} color="#ef4444" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

      </View>

      <View className="flex flex-col  justify-between ">
        <View className="mt-8 bg-background p-4 rounded-xl">
          <Text className="text-sm text-green-800 font-medium text-center">
            Załóż konto, aby odblokować wszystkie funkcje aplikacji.
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/(auth)/register" as any)}
          className="bg-secondary py-4 rounded-full items-center "
        >
          <Text className="text-white font-semibold text-base">
            Utwórz konto
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
