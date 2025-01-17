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
    orderDate: Date;
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
 

    const response = await axios.get(`${API_URL}/user-orders/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error getting orders: " + error.message);
  }
};

export const getAllOrders = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error getting orders: " + error.message);
  }
};

export const getOrderById = async (token: string, orderId: string) => {
  try {
    const response = await axios.get(`${API_URL}/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error getting order: " + error.message);
  }
};

export const updateOrder = async (
  token: string,
  orderId: string,
  orderData: {
    status?: string;
    customerNotes?: string;
    estimatedCompletionTime?: Date;
  }
) => {
  try {
    const response = await axios.put(`${API_URL}/order/${orderId}`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error updating order: " + error.message);
  }
};

export const updateOrderStatus = async (
  token: string,
  orderId: string,
  status: string
) => {
  try {
    const response = await axios.put(
      `${API_URL}/order/status/${orderId}`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating order: " + error.message);
  }
};

export const cancelOrder = async (token: string, orderId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error canceling order: " + error.message);
  }
};

export const deleteOrder = async (token: string, orderId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error deleting order: " + error.message);
  }
};
