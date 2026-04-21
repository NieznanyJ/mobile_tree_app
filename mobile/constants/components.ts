import { Dimensions } from "react-native";

export const ICON_SIZE = 24;
export const GRID_SPACING = 12;
export const GRID_COLUMNS = 2;
export const SLOT_SIZE =
  (Dimensions.get("window").width - 32 - GRID_SPACING) / GRID_COLUMNS;
export const ITEMS_PER_ROW = 4;
export const ITEM_SPACING = 6;

export const DISPLAY_OPTIONS_CALC = [
  {
    id: 2,
    ITEMS_PER_ROW: 2,
    ITEM_SPACING: 10,
    ITEM_WIDTH: Dimensions.get("window").width / 2 - 14,
  },
  {
    id: 3,
    ITEMS_PER_ROW: 3,
    ITEM_SPACING: 8,
    ITEM_WIDTH: Dimensions.get("window").width / 3 - 10,
  },
  {
    id: 4,
    ITEMS_PER_ROW: 4,
    ITEM_SPACING: 6,
    ITEM_WIDTH: Dimensions.get("window").width / 4 - 6,
  },
  {
    id: 5,
    ITEMS_PER_ROW: 5,
    ITEM_SPACING: 6,
    ITEM_WIDTH: Dimensions.get("window").width / 5 - 6,
  },
];

export const num = 4;

export const PAGE_SIZE = 50;
