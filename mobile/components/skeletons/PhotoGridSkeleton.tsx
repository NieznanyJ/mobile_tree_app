import React from "react";
import { Dimensions, View } from "react-native";

import SkeletonBox from "@/components/ui/SkeletonBox";

const ITEMS_PER_ROW = 4;
const ITEM_SPACING = Dimensions.get("window").width / 26;
const ITEM_WIDTH = Dimensions.get("window").width / ITEMS_PER_ROW - ITEM_SPACING;
const ROWS = 5;
const TOTAL_ITEMS = ITEMS_PER_ROW * ROWS;

export default function PhotoGridSkeleton() {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        gap: 4,
      }}
    >
      {Array.from({ length: TOTAL_ITEMS }).map((_, i) => (
        <SkeletonBox
          key={i}
          width={ITEM_WIDTH}
          height={ITEM_WIDTH * 1.1}
          borderRadius={8}
          style={{ margin: 2 }}
        />
      ))}
    </View>
  );
}
