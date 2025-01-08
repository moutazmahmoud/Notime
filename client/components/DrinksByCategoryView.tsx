import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DrinksHomeView from "./DrinksHomeList";
import { MenuItem } from "@/app/(tabs)/menu";

interface Category {
  name: string;
  id: string;
}

export default function DrinksByCategoryView({ items }: { items: MenuItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Extract unique categories from the items
  const categories: Category[] = [
    { name: "All", id: "All" },
    ...Array.from(
      new Map(items.map((item) => [item.category.id, item.category])).values()
    ),
  ];

  // Filter items by the selected category
  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category.id === selectedCategory);

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 8,
          marginTop: 8,
        }}
      >
        Filter by Category
      </Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      />
      <DrinksHomeView items={filteredItems} title="" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  categoryList: {
    marginVertical: 10,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: "#4CAF50",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
