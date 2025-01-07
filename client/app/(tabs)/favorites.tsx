import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

const initialFavorites = [
  { id: "1", name: "Cappuccino", image: "https://via.placeholder.com/100", category: "drinks" },
  { id: "2", name: "Latte", image: "https://via.placeholder.com/100", category: "drinks" },
  { id: "3", name: "Cheesecake", image: "https://via.placeholder.com/100", category: "desserts" },
  { id: "4", name: "Espresso", image: "https://via.placeholder.com/100", category: "drinks" },
  { id: "5", name: "Brownie", image: "https://via.placeholder.com/100", category: "desserts" },
];

export default function Favorites() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [filter, setFilter] = useState("all"); // Filter state for "all", "drinks", or "desserts"

  const filteredFavorites =
    filter === "all" ? favorites : favorites.filter((item) => item.category === filter);

  const handleRemoveFavorite = (id: string) => {
    Alert.alert(
      "Remove Favorite",
      "Are you sure you want to remove this item from favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () =>
            setFavorites((prevFavorites) =>
              prevFavorites.filter((item) => item.id !== id)
            ),
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: typeof initialFavorites[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => handleRemoveFavorite(item.id)}
          style={styles.removeButton}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorites</Text>

      {/* Radio-Styled Slider */}
      <View style={styles.slider}>
        {["all", "drinks", "desserts"].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.sliderButton,
              filter === category && styles.activeSliderButton,
            ]}
            onPress={() => setFilter(category)}
          >
            <Text
              style={[
                styles.sliderText,
                filter === category && styles.activeSliderText,
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Favorites List */}
      {filteredFavorites.length > 0 ? (
        <FlatList
          data={filteredFavorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.emptyMessage}>No favorites in this category.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  slider: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  sliderButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "#E5E5E5",
  },
  activeSliderButton: {
    backgroundColor: "#1E293B",
  },
  sliderText: {
    fontSize: 14,
    color: "#333",
  },
  activeSliderText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
  info: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: "#E63946",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  removeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#A3A3A3",
    marginTop: 32,
  },
});
