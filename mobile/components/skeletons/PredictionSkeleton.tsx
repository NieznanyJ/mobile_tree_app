import React from "react";
import { View } from "react-native";

import SkeletonBox from "@/components/ui/SkeletonBox";

export default function PredictionSkeleton() {
  return (
    <View style={{ alignItems: "center", gap: 20, paddingVertical: 24 }}>
      <SkeletonBox width={160} height={160} borderRadius={80} />
      <SkeletonBox width={200} height={20} borderRadius={6} />
      <SkeletonBox width={120} height={16} borderRadius={4} />
      <SkeletonBox width={180} height={44} borderRadius={22} />
    </View>
  );
}
