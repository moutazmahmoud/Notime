import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  getMenuItemById,
  updateMenuItem,
} from "../../services/menuItemsService";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const EditMenuItemPage: React.FC = () => {
  const router = useRouter();
  const { id } = useGlobalSearchParams() || ("" as string); // Ensure 'id' is a string
  const [menuItem, setMenuItem] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [customizations, setCustomizations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const categoryName = category;
    const fetchMenuItem = async () => {
      try {
        const fetchedItem = await getMenuItemById(id?.toString());
        setMenuItem(fetchedItem);
        setName(fetchedItem.name);
        setCategory(fetchedItem.category);
        setBasePrice(fetchedItem.basePrice);
        setCustomizations(fetchedItem.customizations || []);
      } catch (err) {
        setError("Failed to fetch menu item.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  const handleUpdate = async () => {
    if (!name || !category || !basePrice) {
      Alert.alert("Error", "Please fill in all required fields.");
      console.log("Error: Please fill in all required fields.");
      return;
    }

    try {
      const updatedData = {
        name,
        category,
        basePrice,
        customizations,
      };
      await updateMenuItem(id as string, updatedData);
      console.log("updatedData:", updatedData);
      Alert.alert("Success", "Menu item updated successfully!");
      console.log("router.back:", "good");
      router.push("/menu"); // Navigate back after successful update
    } catch (err) {
      Alert.alert("Error", "Failed to update menu item.");
    }
  };

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

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View className="h-10">
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="left" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View className="mt-6">
        <Text style={styles.title}>Edit Menu Item</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter item name"
        />
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Enter item category"
        />
        <Text style={styles.label}>Base Price</Text>
        <TextInput
          style={styles.input}
          value={basePrice.toString()}
          keyboardType="numeric"
          onChangeText={(text) => setBasePrice(Number(text))}
          placeholder="Enter item price"
        />
        <Text style={styles.label}>Customizations (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={customizations.join(", ")}
          onChangeText={(text) =>
            setCustomizations(text.split(",").map((item) => item.trim()))
          }
          placeholder="Enter customizations"
        />
        <TouchableOpacity
          className="w-full mt-6 rounded-lg bg-primary-10"
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text className="w-full text-center px-2 py-2 text-white">
            {loading ? "Loading..." : "Update Item"}
          </Text>
        </TouchableOpacity>
      </View>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 5,
    width: 40,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default EditMenuItemPage;
