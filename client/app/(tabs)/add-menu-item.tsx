import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_URL, createMenuItem } from "../../services/menuItemsService";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import BackButton from "@/components/Button";
import { handleNotification } from "@/lib/utils";

const AddMenuItemPage: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { token } = useUser();
  const [category, setCategory] = useState("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [customizations, setCustomizations] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("Permission Result:", permissionResult);

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "You need to grant access to the media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    console.log("Image Picker Result:", result);

    if (result.canceled || !result.assets || !result.assets[0]) {
      Alert.alert("No image selected", "Please select an image to continue.");
      return;
    }

    const { uri } = result.assets[0];
    console.log("Selected Image URI:", uri);
    setImageUri(uri);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("basePrice", String(Number(basePrice)));

      // Prepare the customizations array
      const customizationsArray = Array.isArray(customizations)
        ? customizations
        : JSON.parse(customizations || "[]");
      formData.append("customizations", JSON.stringify(customizationsArray));

      if (imageUri) {
        let imageFile: File;

        if (Platform.OS === "web") {
          // For web, assume imageUri is already a valid file
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const fileName = imageUri.split("/").pop() || "image.jpg";
          imageFile = new File([blob], fileName, { type: blob.type });
        } else {
          // For native platforms, convert URI to a File object
          const fileName = imageUri.split("/").pop() || "image.jpg";
          const mimeType = "image/jpeg"; // Adjust this if necessary
          const response = await fetch(imageUri);
          const blob = await response.blob();
          imageFile = new File([blob], fileName, { type: mimeType });
        }

        formData.append("image", imageFile);
      }

      // Send the form data to your backend API
      await axios.post(`${API_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset the state after successful submission
      setName("");
      setCategory("");
      setBasePrice(0);
      setCustomizations("");
      setImageUri(null);
      handleNotification("success", "Menu item added successfully!");

      router.push("/menu");
    } catch (error) {
      console.error("Error creating menu item: ", error);
      Alert.alert("Error", "Failed to add menu item.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <BackButton onPress={() => router.back()} />
        <Text style={styles.title} className="mt-2">
          Add Menu Item
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Base Price"
          value={String(Number(basePrice))}
          onChangeText={(str) => setBasePrice(Number(str) || 0)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Customizations (comma-separated)"
          value={customizations}
          onChangeText={setCustomizations}
        />

        {/* Button to select image */}
        <TouchableOpacity
          onPress={handlePickImage}
          style={styles.pickImageButton}
        >
          <Text style={styles.buttonText}>Pick an image</Text>
        </TouchableOpacity>

        {/* Display selected image */}
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <Text style={styles.imageText}>Image selected</Text>
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Add</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  pickImageButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  imageContainer: {
    marginVertical: 15,
    alignItems: "center",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  imageText: {
    fontSize: 16,
    color: "#888",
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

export default AddMenuItemPage;
