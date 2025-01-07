import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

const initialNotifications = [
  {
    id: "1",
    title: "Order Delivered",
    message: "Your order #12345 has been delivered.",
    read: false,
  },
  {
    id: "2",
    title: "New Offer",
    message: "Get 20% off on your next order!",
    read: false,
  },
  {
    id: "3",
    title: "Order Shipped",
    message: "Your order #12345 is on the way.",
    read: true,
  },
  {
    id: "4",
    title: "Welcome",
    message: "Thank you for signing up!",
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const removeNotification = (id: string) => {
    Alert.alert(
      "Remove Notification",
      "Are you sure you want to remove this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () =>
            setNotifications((prev) =>
              prev.filter((notification) => notification.id !== id)
            ),
        },
      ]
    );
  };

  const renderNotification = ({
    item,
  }: {
    item: (typeof initialNotifications)[0];
  }) => (
    <View style={[styles.card, item.read && styles.readCard]}>
      <View style={styles.cardContent}>
        <Text style={[styles.title, item.read && styles.readTitle]}>
          {item.title}
        </Text>
        <Text style={[styles.message, item.read && styles.readMessage]}>
          {item.message}
        </Text>
      </View>
      <View style={styles.actions}>
        {!item.read && (
          <TouchableOpacity
            onPress={() => markAsRead(item.id)}
            style={styles.markAsReadButton}
          >
            <Text style={styles.markAsReadText}>Mark as Read</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => removeNotification(item.id)}
          style={styles.removeButton}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
        <Text style={styles.header}>Notifications</Text>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>No notifications available.</Text>
          }
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  readCard: {
    backgroundColor: "#F0F0F0",
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  readTitle: {
    color: "#999",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
  readMessage: {
    color: "#CCC",
  },
  actions: {
    marginLeft: 16,
    alignItems: "flex-end",
  },
  markAsReadButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  markAsReadText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#E63946",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  removeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 32,
  },
});
