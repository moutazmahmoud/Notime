import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import TopSpacer from "@/components/TopSpacer";
import { API_URL_Image, useUser } from "../../context/UserContext";
import { getMenuItems } from "@/services/menuItemsService";
import LoadingScreen from "@/components/LoadingScreen";
import { MenuItem } from "./menu";
import { router } from "expo-router";

export default function Favorites() {
  const { token, likedMenuItems, setUser, menuItems } = useUser();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState("all"); // Filter state for "all", "drinks", or "desserts"

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getMenuItems(token || "");
        setUser({ menuItems: items });

        const likedItems = menuItems!.filter((item: any) =>
          likedMenuItems?.includes(item._id)
        );
        console.log("likedItems", likedItems);
        setFavorites(likedItems);
      } catch (err) {
        console.error("Failed to fetch menu items", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [likedMenuItems]);

  const filteredFavorites =
    filter === "all"
      ? favorites
      : favorites.filter((item) => item.category === filter);

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
  const toImageUrl = (imageUrl: string) => {
    return `${API_URL_Image}${imageUrl}`;
  };

  const renderFavoriteItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      onPress={() => router.push(`/menu-item/${item._id}`)}
      style={styles.card}
      key={item._id}
    >
        <Image source={{ uri: toImageUrl(item.image) }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category.name}</Text>
          <TouchableOpacity
            onPress={() => handleRemoveFavorite(item._id)}
            style={styles.removeButton}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container} className="bg-background">
      <TopSpacer />

      <Text style={styles.title}>My Favorites</Text>

      {/* Radio-Styled Slider */}
      <View style={styles.slider} className="mt-1">
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
          keyExtractor={(item) => item._id}
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
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  slider: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  sliderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  activeSliderButton: {
    backgroundColor: "#007BFF",
  },
  sliderText: {
    fontSize: 16,
    color: "#000",
  },
  activeSliderText: {
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "#666",
  },
  removeButton: {
    marginTop: 8,
    backgroundColor: "#FF3B30",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    maxWidth: 66,
  },
  removeText: {
    color: "#fff",
    fontSize: 14,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  list: {},
});
