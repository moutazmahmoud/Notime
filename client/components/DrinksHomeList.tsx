import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const drinks = [
  { id: "1", name: "Cappuccino", image: "https://via.placeholder.com/100" },
  { id: "2", name: "Latte", image: "https://via.placeholder.com/100" },
  { id: "3", name: "Espresso", image: "https://via.placeholder.com/100" },
  { id: "4", name: "Mocha", image: "https://via.placeholder.com/100" },
  { id: "5", name: "Iced Coffee", image: "https://via.placeholder.com/100" },
  { id: "6", name: "Green Tea", image: "https://via.placeholder.com/100" },
];

export default function DrinksHomeView() {
  const renderDrinkItem = ({ item }: { item: (typeof drinks)[0] }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container} className="">
      <Text style={styles.title}>Popular Drinks</Text>
      <FlatList
        data={drinks}
        renderItem={renderDrinkItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    width: 150,
    height: 180,
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3, // Add shadow on Android
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
});
