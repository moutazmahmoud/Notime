import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useUser } from "@/context/UserContext";
import { getAllOrders, updateOrderStatus } from "@/services/ordersService";
import { getAllUsers } from "@/services/authService";
import { getMenuItems } from "@/services/menuItemsService";
import { MenuItem } from "./menu";

type Order = {
  _id: string;
  customerId: string;
  status: string;
  totalPrice: number;
  orderDate: Date;

  items: { item: string; quantity: number }[];
};

const ManageOrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Record<string, string>>({});
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<string>("incoming");
  const today = new Date();

  const { token } = useUser();

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersData, usersData, menuItemsData] = await Promise.all([
          getAllOrders(token as string),
          getAllUsers(token as string),
          getMenuItems(token as string),
        ]);
        setOrders(ordersData);

        const userMap = usersData.reduce(
          (
            map: Record<string, string>,
            user: { _id: string; username: string }
          ) => {
            map[user._id] = user.username;
            return map;
          },
          {}
        );
        setUsers(userMap);

        setMenuItems(menuItemsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndUsers();
  }, [token]);

  const filterOrders = (type: string) => {
    switch (type) {
      case "incoming":
        return orders.filter((order) =>
          ["pending", "accepted", "inprogress"].includes(order.status)
        );
      case "completed":
        return orders.filter((order) => order.status === "completed");
      case "canceled":
        return orders.filter((order) => order.status === "canceled");
      default:
        return [];
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
     
      const updatedOrder = await updateOrderStatus(
        token as string,
        orderId,
        newStatus
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      Alert.alert("Success", `Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update order status:", err);
      Alert.alert("Error", "Failed to update order status. Please try again.");
    }
  };

  const renderOrderItemTable = (items: Order["items"]) => (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <Text style={styles.tableHeader}>Item</Text>
        <Text style={styles.tableHeader}>Quantity</Text>
      </View>
      {items.map((orderItem) => (
        <View style={styles.tableRow} key={orderItem.item}>
          <Text style={styles.tableCell}>{orderItem.item}</Text>
          <Text style={styles.tableCell}>{orderItem.quantity}</Text>
        </View>
      ))}
    </View>
  );
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formattedDate = (orderDate: Date | string): string => {
    try {
      const date = new Date(orderDate);
      if (isNaN(date.getTime())) throw new Error("Invalid date");

      return isToday(date)
        ? `Today at ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : date.toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    } catch {
      return "Invalid date";
    }
  };

  const renderOrderRow = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderInfo}>
        <Text style={styles.bold}>User:</Text>{" "}
        {users[item.customerId] || "Unknown"}
      </Text>
      <Text style={styles.orderInfo}>
        <Text style={styles.bold}>Order ID:</Text> {item._id}
      </Text>
      <Text style={styles.orderInfo}>
        <Text style={styles.bold}>Order Date:</Text>{" "}
        {formattedDate(item.orderDate)}
      </Text>
      <Text style={styles.orderInfo}>
        <Text style={styles.bold}>Status:</Text> {item.status}
      </Text>
      <Text style={styles.orderInfo}>
        <Text style={styles.bold}>Total Price:</Text> $
        {item.totalPrice.toFixed(2)}
      </Text>
      {/* Render items table */}
      {renderOrderItemTable(item.items)}
      {/* Action buttons */}
      <View style={styles.actionButtons}>
        {["pending", "accepted", "inprogress"].includes(item.status) && (
          <>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleStatusChange(item._id, "completed")}
            >
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleStatusChange(item._id, "canceled")}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading orders...</Text>
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

  const filteredOrders = filterOrders(viewType);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Orders</Text>
      <View style={styles.sliderBar}>
        <TouchableOpacity
          style={[
            styles.sliderButton,
            viewType === "incoming" && styles.activeButton,
          ]}
          onPress={() => setViewType("incoming")}
        >
          <Text style={styles.sliderText}>Incoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sliderButton,
            viewType === "completed" && styles.activeButton,
          ]}
          onPress={() => setViewType("completed")}
        >
          <Text style={styles.sliderText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sliderButton,
            viewType === "canceled" && styles.activeButton,
          ]}
          onPress={() => setViewType("canceled")}
        >
          <Text style={styles.sliderText}>Canceled</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderRow}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sliderBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  sliderButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  activeButton: {
    backgroundColor: "#6200EE",
  },
  sliderText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  orderInfo: {
    fontSize: 14,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableHeader: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  actionButtons: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  completeButton: {
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "#E53935",
  },
});

export default ManageOrdersScreen;
