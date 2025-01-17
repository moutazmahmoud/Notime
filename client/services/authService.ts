import { handleNotification } from "@/lib/utils";
import axios from "axios";

const API_URL = "http://192.168.1.101:4000/auth";

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

export const toggleLikedMenuItem = async (
  token: string,
  userId: string,
  menuItemId: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/${userId}/toggle-liked-item`,
      { menuItemId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.likedMenuItems; // Updated liked item IDs
  } catch (error: any) {
    throw new Error("Error toggling liked menu item: " + error.message);
  }
};

export const getAllUsers = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

// Send reset password email
export const sendResetPasswordEmail = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { email });
    console.log("response:", response.status);
    if (response.status === 200) {
      handleNotification("success", "Reset password email sent");
      return response.data;
    } else {
      throw new Error("Error sending reset password email: " + response.status);
    }
  } catch (error) {
    throw new Error("Error sending reset password email: " + error.message);
  }
};

// Validate reset code
export const validateResetCode = async (resetCode: string, email: string) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/validate`, {
      resetCode,
      email,
    });
    return response.status;
  } catch (error) {
    throw new Error("Error validating reset code: " + error.message);
  }
};

// Set new password
export const setNewPasswordWithCode = async (
  resetCode: string,
  newPassword: string,
  email: string
) => {
  try {
    const res = await axios.post(`${API_URL}/reset-password/set-new-password`, {
      resetCode,
      newPassword,
      email,
    });
    console.log("setNewPasswordWithCode response:", res);
    return res.status;
  } catch (error) {
    throw new Error("Error setting new password: " + error.message);
  }
};
