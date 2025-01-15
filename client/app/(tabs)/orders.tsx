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
import { getMenuItems } from "@/services/menuItemsService";
import CountdownTimer from "@/components/CountdownTimer";
import { MenuItem } from "./menu";

interface Order {
  _id: string;
  status: string;
  totalPrice: number;
  items: { item: string; quantity: number }[];
  customerNotes?: string;
  customerId: string;
  orderDate: Date;
  preferredPickupTime?: Date;
  cancelReason?: string;
  estimatedCompletionTime?: string;
}

const MyOrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<string>("incoming");

  const { token, userId } = useUser();

  useEffect(() => {
    const fetchOrdersAndMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersData, menuData] = await Promise.all([
          getOrdersByUser(token as string, userId as string),
          getMenuItems(token as string),
        ]);
        setOrders(ordersData);
        setMenuItems(menuData);
      } catch (err) {
        setError(
          "Failed to fetch orders or menu items. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndMenu();
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return styles.pendingStatus;
      case "accepted":
        return styles.acceptedStatus;
      case "inprogress":
        return styles.inProgressStatus;
      case "completed":
        return styles.completedStatus;
      case "canceled":
        return styles.canceledStatus;
      default:
        return styles.defaultStatus;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long", // Use 'short' for abbreviated month names
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View
      style={[styles.orderItem, getStatusStyle(item.status)]}
      key={item._id}
    >
      {/* <Text style={styles.orderText}>Order ID: {item._id}</Text> */}
      <Text style={styles.itemsHeader}>Status: {item.status}</Text>

      <Text style={styles.itemsHeader}>
        Order Date: {formatDate(item.orderDate.toString())}
      </Text>

      {item.status === "inprogress" && item.estimatedCompletionTime && (
        <View>
          <Text style={styles.orderText}>
            Estimated Completion Time:{" "}
            {new Date(item.estimatedCompletionTime).toLocaleTimeString()}
          </Text>
          <CountdownTimer
            estimatedCompletionTime={item.estimatedCompletionTime}
          />
        </View>
      )}

      <Text style={styles.itemsHeader}>Items:</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Item</Text>
          <Text style={styles.tableHeaderMedium}>Quantity</Text>
          <Text style={styles.tableHeaderMedium}>Price</Text>
          <Text style={styles.tableHeaderMedium} className="flex-1" >Item Total</Text>
        </View>
        {item.items.map((orderItem) => {
          const menuItem = menuItems.find(
            (menuItem) => menuItem._id === orderItem.item
          );
          return (
            <View style={styles.tableRow} key={orderItem.item}>
              <Text style={styles.tableCell}>
                {menuItem?.name || "Unknown Item"}
              </Text>
              <Text style={styles.smallCell}>{orderItem.quantity}</Text>
              <Text style={styles.smallCell}>${menuItem?.basePrice}</Text>
              <Text style={styles.smallCell} className="flex-1">
                ${orderItem.quantity * menuItem!.basePrice}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.orderText} className="mt-0.5 text-right w-full">Total: ${item.totalPrice.toFixed(2)}</Text>
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
          keyExtractor={(item) => item._id}
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
  pendingStatus: { borderLeftColor: "#FFA500", borderLeftWidth: 5 },
  acceptedStatus: { borderLeftColor: "#87CEEB", borderLeftWidth: 5 },
  inProgressStatus: { borderLeftColor: "#00BFFF", borderLeftWidth: 5 },
  completedStatus: { borderLeftColor: "#32CD32", borderLeftWidth: 5 },
  canceledStatus: { borderLeftColor: "#FF6347", borderLeftWidth: 5 },
  defaultStatus: { borderLeftColor: "#ccc", borderLeftWidth: 5 },
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
  itemsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#333",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderRow: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    minWidth: 100, // Ensures cells align even with scrolling
    maxWidth: 100,
    textAlign: "center",
  },
  smallCell: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    minWidth: 70, // Ensures cells align even with scrolling
    textAlign: "center",
  },
  tableHeader: {
    fontWeight: "bold",
    minWidth: 100,
    maxWidth: 100,
    textAlign: "center",
    padding: 8,
  },
  tableHeaderMedium: {
    fontWeight: "bold",
    minWidth: 70,
    padding: 2,
    paddingVertical: 8,
    textAlign: "center",
  },
});

export default MyOrdersScreen;
