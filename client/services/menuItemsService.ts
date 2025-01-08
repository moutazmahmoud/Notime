import axios from "axios";
import { Platform } from "react-native";

export const API_URL = "http://192.168.1.101:4000/menu-item";


// Create a new menu item
export const createMenuItem = async (
  token: string,
  menuItemData: {
    name: string;
    category: string;
    basePrice: number;
    customizations: string[]; // Array of customization IDs
    imageUri: string; // Image URI for the menu item
  }
) => {
  try {
    const formData = new FormData();
    formData.append("name", menuItemData.name);
    formData.append("category", menuItemData.category);
    formData.append("basePrice", menuItemData.basePrice.toString());
    formData.append("customizations", JSON.stringify(menuItemData.customizations));

    if (Platform.OS !== "web") {
      // Fetch the image file from the URI and convert it to a Blob/File
      const response = await fetch(menuItemData.imageUri);
      const blob = await response.blob();
      const file = new File([blob], "menu-item.jpg", { type: blob.type });
      formData.append("image", file);
    } else {
      // For web, directly append the image URI if it's a valid file object
      formData.append("image", menuItemData.imageUri);
    }

    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Important for file upload
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Error creating menu item: " + error.message);
  }
};


// Get all menu items with optional category filter
export const getMenuItems = async (token: string, category?: string) => {
  try {
    const url = category ? `${API_URL}?category=${category}` : `${API_URL}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    throw new Error("Error fetching menu items: " + error.message);
  }
};

// Get a single menu item by ID
export const getMenuItemById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching menu item by ID: " + error.message);
  }
};

// Update a menu item
export const updateMenuItem = async (
  id: string,
  updatedData: {
    name: string;
    category: string;
    basePrice: number;
    customizations: string[];
    image?: File; // Optional image file for updating
  }
) => {
  try {
    const formData = new FormData();
    formData.append("name", updatedData.name);
    formData.append("category", updatedData.category);
    formData.append("basePrice", updatedData.basePrice.toString());
    formData.append("customizations", JSON.stringify(updatedData.customizations));

    if (updatedData.image) {
      formData.append("image", updatedData.image); // Append the image file if provided
    }

    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Error updating menu item: " + error.message);
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error("Error deleting menu item: " + error.message);
  }
};
