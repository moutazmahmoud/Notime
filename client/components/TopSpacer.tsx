import React from "react";
import { View, StyleSheet } from "react-native";

const TopSpacer = () => {
  return <View style={styles.spacer} />;
};

const styles = StyleSheet.create({
  spacer: {
    height: 40,
  },
});

export default TopSpacer;
