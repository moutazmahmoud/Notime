import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  getMenuItems,
  deleteMenuItem,
  updateMenuItem,
} from "../../services/menuItemsService";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  basePrice: number;
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
        const items = await getMenuItems(token);
        setMenuItems(items);
        console.log("items:", items);
        console.log("items[0].id:", items[0].id);
      } catch (err) {
        setError("Failed to fetch menu items.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, [token]);

  // Handle edit operation (navigate to edit page)
  const handleEdit = (itemId: string) => {
    router.push(`/edit-menu-item/${itemId}`); // Navigating to the EditMenuItemPage with itemId
    console.log("router.push:", router.push);
    console.log("id:", itemId);
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

  // Render each menu item
  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.basePrice.toFixed(2)}</Text>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item._id)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
      <Text style={styles.title}>Menu</Text>
      <TouchableOpacity
        style={[
          styles.actionButton,
          { marginBottom: 20, backgroundColor: "#2196F3" },
        ]}
        onPress={() => router.push("/add-menu-item")}
      >
        <Text style={styles.actionText}>Add Menu Item</Text>
      </TouchableOpacity>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  actionButton: {
    padding: 5,
    marginLeft: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  actionText: {
    color: "#fff",
  },
});

export default MenuPage;
