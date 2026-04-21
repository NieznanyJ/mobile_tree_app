import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  icon: React.ReactNode;
  text: string;
}

export default function EmptyState({ icon, text }: EmptyStateProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center">
        {icon}
      </View>
      <Text className="text-gray-500">{text}</Text>
    </View>
  );
}
