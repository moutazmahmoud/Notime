import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";

interface CountdownTimerProps {
  estimatedCompletionTime: string; // ISO string for completion time
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ estimatedCompletionTime }) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const targetTime = new Date(estimatedCompletionTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remaining = targetTime - now;

      if (remaining <= 0) {
        setTimeRemaining("Order is ready for pickup!");
        clearInterval(interval);
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeRemaining(`${minutes} min ${seconds} sec remaining`);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [estimatedCompletionTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{timeRemaining}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default CountdownTimer;
