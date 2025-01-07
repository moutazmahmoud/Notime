import axios from "axios";

const API_URL = "http://192.168.1.101:4000/menu-item";

// Login request
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Register request
export const register = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      { username, email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    console.error("Detailed Error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Update user details
export const editUser = async (id: string, updates: object, token: string) => {
  try {
    const response = await axios.put(`${API_URL}/edit/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("response:", response);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

// Delete user
export const deleteUser = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};


// Create a new menu item
export const createMenuItem = async (menuItemData: {
  name: string;
  category: string;
  basePrice: number;
  customizations: string[]; // Array of customization IDs
}) => {
  try {
    const response = await axios.post(`${API_URL}`, menuItemData);
    return response.data;
  } catch (error) {
    throw new Error('Error creating menu item: ' + error.message);
  }
};

// Get all menu items with optional category filter
export const getMenuItems = async (category?: string) => {
  try {
    const url = category
      ? `${API_URL}?category=${category}`
      : `${API_URL}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching menu items: ' + error.message);
  }
};

// Get a single menu item by ID
export const getMenuItemById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching menu item by ID: ' + error.message);
  }
};

// Update a menu item
export const updateMenuItem = async (id: string, updatedData: {
  name: string;
  category: string;
  basePrice: number;
  customizations: string[];
}) => {
  try {
    const response = await axios.put(`${API_URL}${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating menu item: ' + error.message);
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: string) => {
  try {
    await axios.delete(`${API_URL}${id}`);
  } catch (error) {
    throw new Error('Error deleting menu item: ' + error.message);
  }
};
