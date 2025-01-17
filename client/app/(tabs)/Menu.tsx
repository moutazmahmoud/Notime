import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import {
  getMenuItems,
  deleteMenuItem,
  updateMenuItem,
} from "../../services/menuItemsService";
import { API_URL_Image, useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: { name: string; id: string };
  basePrice: number;
  image: string;
}

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { token } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch menu items on component mount
  useEffect(() => {
  const fetchMenuItems = async () => {
    try {
      const items = await getMenuItems(token || "");
      setMenuItems(items);
    } catch (err) {
      setError("Failed to fetch menu items.");
    } finally {
      setLoading(false);
    }
  };
  fetchMenuItems();
  }, []);

  // Handle edit operation (navigate to edit page)
  const handleEdit = (itemId: string) => {
    router.push(`/edit-menu-item/${itemId}`); // Navigating to the EditMenuItemPage with itemId
  };

  // Handle delete operation
  const handleDelete = async (itemId: string) => {
    try {
      await deleteMenuItem(itemId);
      setMenuItems(menuItems.filter((item) => item._id !== itemId)); // Remove the deleted item from the state
      Alert.alert("Success", "Menu item deleted successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete menu item.");
    }
  };

  // Render menu item
  const renderItem = ({ item }: { item: MenuItem }) => {
    const imageUrl = `${API_URL_Image}${item.image}`;
    return (
      <View style={styles.card} className="flex-col">
        <View className="flex-row w-full">
          <Image source={{ uri: imageUrl }} style={styles.image} className="" />
          <View style={styles.details}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{item.category.name}</Text>
            <Text style={styles.price}>${item.basePrice.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item._id)}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item._id)}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // If loading, show a loading message
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  // If error, show an error message
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Menu</Text>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { marginBottom: 20, backgroundColor: "#2196F3" },
          ]}
          onPress={() => router.push("/add-menu-item")}
        >
          <Text style={styles.actionText} className="text-center"> Add Menu Item</Text>
        </TouchableOpacity>
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 18,
    color: "#888",
  },
  itemActions: {
    flexDirection: "row",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  category: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#FF5252",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  addButton: {
    color: "#fff",
    backgroundColor: "#4CAF50",
  },
});

export default MenuPage;
