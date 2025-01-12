import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useUser } from "@/context/UserContext";
import BackButton from "@/components/Button";
import { useRouter } from "expo-router";
import { createNewOrder } from "@/services/ordersService";
import { handleNotification } from "@/lib/utils";

const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    token,
    userId,
  } = useUser();
  const router = useRouter();

  const localCart = cart || [];

  // Calculate the total price using useMemo for optimization
  const totalPrice = useMemo(
    () =>
      localCart.reduce((sum, item) => sum + item.basePrice * item.quantity, 0),
    [localCart]
  );

  // Render individual cart items
  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name || "Unnamed Item"}</Text>
      <Text style={styles.itemPrice}>
        ${item.basePrice?.toFixed(2) || "0.00"} x {item.quantity || 1}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            updateCartItemQuantity(item._id, Math.max(1, item.quantity - 1))
          }
          style={styles.actionButton}
        >
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity || 1}</Text>
        <TouchableOpacity
          onPress={() => updateCartItemQuantity(item._id, item.quantity + 1)}
          style={styles.actionButton}
        >
          <Text>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => removeFromCart(item._id)}
          style={styles.removeButton}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Handle ordering logic
  const handleOrder = async () => {
    if (localCart.length > 0) {
      const newOrder = await createNewOrder(token as string, {
        items: localCart.map((item) => ({
          item: item._id,
          quantity: item.quantity,
        })),
        totalPrice: totalPrice,
        customerNotes: "",
        customerId: userId as string,
      });
      if (!newOrder) {
        handleNotification("success", "Your order has been placed!");
        clearCart();
      }
    } else {
      handleNotification("error", "Your cart is empty!");
    }
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} />
      <Text style={styles.title}>Your Cart</Text>
      {localCart.length === 0 ? (
        <Text style={styles.emptyState}>
          Your cart is empty. Add items to continue!
        </Text>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item._id}
          />
          <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
          <TouchableOpacity onPress={handleOrder} style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Place Order</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyState: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 32,
  },
  cartItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
    color: "#555",
    marginVertical: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    marginLeft: "auto",
    padding: 8,
    backgroundColor: "#ff5252",
    borderRadius: 4,
  },
  removeText: {
    color: "#fff",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
  orderButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#4caf50",
    borderRadius: 4,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#ff5252",
    borderRadius: 4,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CartPage;
