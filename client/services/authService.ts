// services/authService.ts
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
    console.error("Detailed Error:", error.response?.data); // Log server error details
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
