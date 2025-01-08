import { MenuItem } from "@/app/(tabs)/menu";
import { AntDesign } from "@expo/vector-icons";
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

export default function DrinksHomeView({
  items,
  title,
  classes,
}: {
  items: MenuItem[];
  title?: string;
  classes?: string;
}) {
  console.log("items from flatlist view:", items);
  const renderDrinkItem = ({ item }: { item: MenuItem }) => {
    // Construct the full image URL
    const imageUrl = `${API_URL}${item.image}`;

    return (
      <TouchableOpacity className="" key={item._id} style={styles.card}>
        <View className="flex-col items-center justify-between bg-white rounded-lg w-full p-3">
          <Image source={{ uri: imageUrl }} style={styles.image} className="" />
          <Text className="text-textPrimary text-lg" style={styles.name}>
            {item.name}
          </Text>
          <Text className="w-full text-textSecondary text-sm">
            {item.category.name}
          </Text>

          <View className="flex-row justify-between items-center mt-2 w-full">
            <Text className="text-lg">${item.basePrice.toFixed(2)}</Text>
            <TouchableOpacity className="bg-primary-10 rounded-xl p-2">
              <AntDesign name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container} className={classes}>
      {title && (
        <Text style={styles.title} className="text-2xl">
          {title}
        </Text>
      )}
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
    // backgroundColor: "black",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  list: {
    // padding: 16,
    marginTop: 8,
  },
  card: {
    width: 150,
    // height: 220,
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3, // Add shadow on Android
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    borderRadius: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    width: "100%",
  },
});
