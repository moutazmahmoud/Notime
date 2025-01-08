import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useUser } from "@/context/UserContext";

export default function CartPage() {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart } = useUser();

  const renderCartItem = ({ item } : { item: any }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.basePrice.toFixed(2)}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            updateCartItemQuantity(item._id, Math.max(1, item.quantity - 1))
          }
          style={styles.actionButton}
        >
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
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
          <Text>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
        <Text>Clear Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    color: "#888",
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
  clearButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#ff5252",
    borderRadius: 4,
    alignItems: "center",
  },
});
