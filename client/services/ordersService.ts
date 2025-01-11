import axios from "axios";
import { Platform } from "react-native";

export const API_URL = "http://192.168.1.101:4000/orders";

export const createNewOrder = async (
  token: string,
  orderData: {
    items: { item: string; quantity: number }[];
    totalPrice: number;
    customerNotes?: string;
    customerId: string;
    esimatedCompletionTime?: Date;
  }
) => {
  try {
    const estimatedCompletionTime =
      orderData.esimatedCompletionTime || new Date(Date.now() + 15 * 60 * 1000);
    const response = await axios.post(
      `${API_URL}/new-order`,
      {
        ...orderData,
        estimatedCompletionTime: estimatedCompletionTime.toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error getting orders: " + error.message);
  }
};

export const getOrdersByUser = async (token: string, userId: string) => {
  try {
    console.log("Getting orders for user:", userId);
    console.log("Token:", token);
    console.log("url", `${API_URL}/user-orders/${userId}`);

    const response = await axios.get(`${API_URL}/user-orders/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response from server:", response);
    return response.data;
  } catch (error) {
    throw new Error("Error getting orders: " + error.message);
  }
};
