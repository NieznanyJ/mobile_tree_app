import React from "react";
import { Dimensions, View } from "react-native";

import SkeletonBox from "@/components/ui/SkeletonBox";

const COLUMNS = 2;
const SPACING = 12;
const ITEM_WIDTH = (Dimensions.get("window").width - 32 - SPACING) / COLUMNS;
const TOTAL_ITEMS = 6;

export default function AlbumGridSkeleton() {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SPACING,
        paddingVertical: 8,
      }}
    >
      {Array.from({ length: TOTAL_ITEMS }).map((_, i) => (
        <View key={i} style={{ width: ITEM_WIDTH, gap: 8 }}>
          <SkeletonBox
            width={ITEM_WIDTH}
            height={ITEM_WIDTH}
            borderRadius={12}
          />
          <SkeletonBox
            width={ITEM_WIDTH * 0.6}
            height={14}
            borderRadius={4}
          />
        </View>
      ))}
    </View>
  );
}
