import React from "react";
import { View, ActivityIndicator, StyleSheet, Text, Animated, Easing } from "react-native";

const LoadingScreen = () => {
  const spinValue = new Animated.Value(0);

  // Spin animation
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  // Map the animation value to rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
        <View style={styles.circle} />
      </Animated.View>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  spinner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "#3498db",
    borderRightColor: "transparent",
    marginBottom: 20,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "transparent",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db",
  },
});

export default LoadingScreen;
