import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const Overlay = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return <View style={styles.overlay}></View>;
};

export default Overlay;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    minWidth: Dimensions.get("window").width,
    minHeight: Dimensions.get("window").height,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
});
