import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getMenuItemById } from "../../services/menuItemsService";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { MenuItem } from "../(tabs)/menu";
import { API_URL_Image, useUser } from "@/context/UserContext";
import { toggleLikedMenuItem } from "@/services/authService";

const MenuItemDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = useGlobalSearchParams() as { id: string }; // ("" as string); // Ensure 'id' is a string
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const { token, userId, setUser, updateLikedMenuItems } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMenuItem = async () => {
      try {
        const fetchedItem = await getMenuItemById(id?.toString());
        setMenuItem(fetchedItem);
      } catch (err) {
        setError("Failed to fetch menu item.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const handleLikeMenuItem = async () => {
    try {
      const likedMenuItems = await toggleLikedMenuItem(
        token as string,
        userId as string,
        id
      );
      console.log("likedMenuItems:", likedMenuItems);
      updateLikedMenuItems(likedMenuItems.likedItems);
    } catch (error) {
      console.error("Error toggling liked menu item:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="left" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Menu Item Details</Text>
        <TouchableOpacity
          onPress={handleLikeMenuItem}
          style={styles.backButton}
        >
          <Ionicons name="heart-outline" size={20} color="#fff" />{" "}
          {/* Replace with your favorite icon */}
        </TouchableOpacity>
      </View>

      {/* Image Section */}
      <View className=" px-1">
        <Image
          source={{ uri: `${API_URL_Image}${menuItem.image}` }} // Replace with your API URL
          style={styles.image}
        />
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{menuItem.name}</Text>
        <Text style={styles.category}>{menuItem.category.name}</Text>
        <Text style={styles.price}>${menuItem.basePrice.toFixed(2)}</Text>
        <Text style={styles.description}>
          {menuItem.description || "No description available."}
        </Text>

        {/* Add to Cart Section */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {
            // Replace this with your add-to-cart logic
            Alert.alert("Added to cart", `${menuItem.name} added to cart.`);
          }}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 5,
    width: 40,
    margin: 20,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: "#6200EE",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default MenuItemDetailsPage;
