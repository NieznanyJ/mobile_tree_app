import { ImageSourcePropType } from "react-native";

const context = require.context("./", true, /\.(jpg|jpeg|png)$/);

const treeImages: Record<string, ImageSourcePropType[]> = {};

context.keys().forEach((key: string) => {
  // key format: "./betula-pendula/betula_pendula_1.jpg"
  const parts = key.split("/");
  if (parts.length >= 3) {
    const treeId = parts[1];
    if (!treeImages[treeId]) {
      treeImages[treeId] = [];
    }
    treeImages[treeId].push(context(key));
  }
});

export default treeImages;
