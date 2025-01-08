import { MenuItem } from "@/app/(tabs)/menu";
import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export const API_URL = "http://192.168.1.101:4000";


export default function DrinksHomeView({ items }: { items: MenuItem[] }) {
  console.log("items from flatlist view:", items);
  const renderDrinkItem = ({ item }: { item: MenuItem }) => {
    // Construct the full image URL
    const imageUrl = `${API_URL}${item.image}`;

    return (
      <TouchableOpacity style={styles.card} key={item._id}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container} className="">
      <Text style={styles.title}>Popular Drinks</Text>
      <FlatList
        data={items}
        renderItem={renderDrinkItem}
        keyExtractor={(item) => item._id}
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
