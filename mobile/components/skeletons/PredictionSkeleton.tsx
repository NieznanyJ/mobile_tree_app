import React from "react";
import { ScrollView, View } from "react-native";

import SkeletonBox from "@/components/ui/SkeletonBox";

export default function PredictionSkeleton() {
  return (
    <View>
      {/* Główna karta predykcji */}
      <View className="bg-gray-50 rounded-2xl">
        <View className="p-4">
          {/* Header - procent i przycisk atlas */}
          <View className="flex-row items-center justify-between mb-3">
            <SkeletonBox width={90} height={32} borderRadius={16} />
            <SkeletonBox width={80} height={36} borderRadius={18} />
          </View>

          {/* Nazwa naukowa */}
          <SkeletonBox width={180} height={24} borderRadius={6} style={{ marginBottom: 8 }} />

          {/* Nazwa zwyczajowa */}
          <SkeletonBox width={140} height={18} borderRadius={4} />
        </View>

        {/* Galeria zdjęć */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 16 }}
        >
          <SkeletonBox width={120} height={90} borderRadius={12} />
          <SkeletonBox width={120} height={90} borderRadius={12} />
          <SkeletonBox width={120} height={90} borderRadius={12} />
        </ScrollView>
      </View>

      {/* Sekcja "Inne możliwości" */}
      <View className="mt-4">
        <SkeletonBox width={100} height={14} borderRadius={4} style={{ marginBottom: 8, marginLeft: 4 }} />

        {/* Pierwsza karta drugorzędna */}
        <View className="flex-row items-center bg-white rounded-xl p-3 mb-2 border border-gray-100">
          <SkeletonBox width={56} height={56} borderRadius={8} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <SkeletonBox width={120} height={16} borderRadius={4} style={{ marginBottom: 6 }} />
            <SkeletonBox width={80} height={14} borderRadius={4} />
          </View>
          <SkeletonBox width={60} height={26} borderRadius={13} style={{ marginRight: 8 }} />
          <SkeletonBox width={20} height={20} borderRadius={4} />
        </View>

        {/* Druga karta drugorzędna */}
        <View className="flex-row items-center bg-white rounded-xl p-3 mb-2 border border-gray-100">
          <SkeletonBox width={56} height={56} borderRadius={8} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <SkeletonBox width={100} height={16} borderRadius={4} style={{ marginBottom: 6 }} />
            <SkeletonBox width={70} height={14} borderRadius={4} />
          </View>
          <SkeletonBox width={60} height={26} borderRadius={13} style={{ marginRight: 8 }} />
          <SkeletonBox width={20} height={20} borderRadius={4} />
        </View>
      </View>

      {/* Przycisk zamknij */}
      <View className="mt-4 mb-2 items-center">
        <SkeletonBox width={60} height={16} borderRadius={4} />
      </View>
    </View>
  );
}
