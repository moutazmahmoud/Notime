import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  getMenuItemById,
  updateMenuItem,
} from "../../services/menuItemsService";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { API_URL_Image } from "@/context/UserContext";
import BackButton from "@/components/Button";

const EditMenuItemPage: React.FC = () => {
  const router = useRouter();
  const { id }: { id: string } = useGlobalSearchParams() || ("" as string);

  const [menuItem, setMenuItem] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [basePrice, setBasePrice] = useState<string>("0");
  const [customizations, setCustomizations] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchMenuItem = async () => {
      try {
        const fetchedItem = await getMenuItemById(id);
        setMenuItem(fetchedItem);
        setName(fetchedItem.name);
        setDescription(fetchedItem.description);
        setCategory(fetchedItem.category.name);
        setBasePrice(fetchedItem.basePrice);
        setCustomizations(fetchedItem.customizations || []);
        setImageUri(fetchedItem.image || null);
        setOriginalImage(fetchedItem.image || null);
      } catch (err) {
        setError("Failed to fetch menu item.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "You need to grant access to the media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true, // Include base64 data for rendering
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const selectedImageUri = result.assets[0].uri;
      console.log("selectedImageUri", selectedImageUri);

      setImageUri(selectedImageUri); // This updates the preview image
      setHasChanges(true);

      // Optional: Keep the original image in case of cancel
      if (!originalImage) setOriginalImage(selectedImageUri);
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
    setHasChanges(true);
  };

  const handleUpdate = async () => {
    console.log("handleUpdate called");

    if (!name || !category || !basePrice) {
      console.log("Validation failed: Missing required fields", {
        name,
        category,
        basePrice,
      });
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      console.log("Preparing form data...");
      const formData: FormData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("basePrice", basePrice);
      formData.append("customizations", "");

      if (imageUri) {
        console.log("Adding image to formData", { imageUri });

        let imageFile: File;

        if (Platform.OS === "web") {
          console.log("Platform is web. Fetching image data...");
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const fileName = imageUri.split("/").pop() || "image.jpg";
          imageFile = new File([blob], fileName, { type: blob.type });
        } else {
          console.log("Platform is native. Preparing file...");
          const fileName = imageUri.split("/").pop() || "image.jpg";
          const mimeType = "image/jpeg"; // Update MIME type if needed
          const response = await fetch(imageUri);
          const blob = await response.blob();
          imageFile = new File([blob], fileName, { type: mimeType });
        }

        formData.append("image", imageFile);
      } else if (!imageUri && originalImage) {
        console.log("No new image selected. Indicating image removal.");
        formData.append("image", "");
      }

      console.log("Form data prepared:", formData);

      console.log("Sending update request...");
      await updateMenuItem(id as string, formData);
      console.log("Update successful. Redirecting to menu page.");
      Alert.alert("Success", "Menu item updated successfully!");
      router.push("/menu");
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Failed to update menu item.");
    }
  };

  const hasItemChanged = () =>
    name !== menuItem?.name ||
    category !== menuItem?.category ||
    basePrice !== menuItem?.basePrice ||
    JSON.stringify(customizations) !==
      JSON.stringify(menuItem?.customizations) ||
    imageUri !== originalImage;

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
      <BackButton onPress={() => router.back()} />
      <Text style={styles.title}>Edit Menu Item</Text>
      <ScrollView>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setHasChanges(hasItemChanged());
          }}
          placeholder="Enter item name"
        />

        <TextInput
          style={styles.input}
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            setHasChanges(hasItemChanged());
          }}
          placeholder="Enter item description"
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={(text) => {
            setCategory(text);
            setHasChanges(hasItemChanged());
          }}
          placeholder="Enter item category"
        />

        <Text style={styles.label}>Base Price</Text>
        <TextInput
          style={styles.input}
          value={basePrice}
          keyboardType="numeric"
          onChangeText={(text) => {
            setBasePrice(text || "0");
            setHasChanges(hasItemChanged());
          }}
          placeholder="Enter item price"
        />

        <Text style={styles.label}>Customizations (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={customizations.join(", ")}
          onChangeText={(text) => {
            setCustomizations(text.split(",").map((item) => item.trim()));
            setHasChanges(hasItemChanged());
          }}
          placeholder="Enter customizations"
        />

        <Text style={styles.label}>Image</Text>
        {imageUri ? (
          <>
            <Image
              source={{
                uri: imageUri.includes("base64")
                  ? imageUri
                  : `${API_URL_Image}${imageUri}`,
              }}
              style={{ width: 100, height: 100, marginBottom: 10 }}
            />
            <TouchableOpacity
              style={styles.buttonRemove}
              onPress={handleRemoveImage}
            >
              <Text style={styles.buttonText}>Remove Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonEdit}
              onPress={handlePickImage}
            >
              <Text style={styles.buttonText}>Edit Image</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.buttonAdd} onPress={handlePickImage}>
            <Text style={styles.buttonText}>Add Image</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{
            ...styles.buttonUpdate,
            backgroundColor: hasChanges ? "#4CAF50" : "#ccc",
          }}
          onPress={handleUpdate}
          disabled={!hasChanges}
        >
          <Text style={styles.buttonText}>Update Item</Text>
        </TouchableOpacity>
      </ScrollView>
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
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  buttonRemove: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonEdit: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonAdd: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonUpdate: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default EditMenuItemPage;
