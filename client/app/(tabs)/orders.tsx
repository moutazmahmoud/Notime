import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useUser } from "@/context/UserContext";
import { getOrdersByUser } from "@/services/ordersService";
import CountdownTimer from "@/components/CountdownTimer";

const MyOrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<string>("incoming");

  const { token, userId } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrdersByUser(token as string, userId as string);
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, userId]);

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

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderItem} key={item.id}>
      <Text style={styles.orderText}>Order ID: {item.id}</Text>
      <Text style={styles.orderText}>Status: {item.status}</Text>
      <Text style={styles.orderText}>Total: ${item.totalPrice.toFixed(2)}</Text>
      <CountdownTimer estimatedCompletionTime={item.estimatedCompletionTime} />
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
      <Text style={styles.header}>My Orders</Text>

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

      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noOrdersText}>
          No orders found for this category.
        </Text>
      )}
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
    color: "#333",
  },
  sliderBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  sliderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  orderItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  orderText: {
    fontSize: 16,
    color: "#333",
  },
  noOrdersText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6200EE",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#E53935",
    textAlign: "center",
  },
});

export default MyOrdersScreen;
