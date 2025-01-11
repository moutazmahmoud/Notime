import { MenuItem } from "@/app/(tabs)/menu";
import { API_URL_Image, useUser } from "@/context/UserContext";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function DrinksHomeView({
  items,
  title,
  classes,
}: {
  items: MenuItem[];
  title?: string;
  classes?: string;
}) {
  const router = useRouter();
  // Move the useUser hook call here, at the top level of the component
  const { addToCart } = useUser();

  // Render each item in the FlatList
  const renderDrinkItem = ({ item }: { item: MenuItem }) => {
    const imageUrl = `${API_URL_Image}${item.image}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/menu-item/${item._id}`)}
        className="p-0.5"
      >
        <View className="flex-col items-center justify-between bg-white rounded-lg w-full">
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <Text className="text-textPrimary text-lg" style={styles.name}>
            {item.name}
          </Text>
          <Text className="w-full text-textSecondary text-sm">
            {item.category.name}
          </Text>

          <View className="flex-row justify-between items-center mt-0.5 w-full">
            <Text className="text-lg">${item.basePrice.toFixed(2)}</Text>
            <TouchableOpacity
              className="bg-primary-10 rounded-xl p-0.5"
              onPress={() => addToCart(item, 1)} // Call addToCart here
            >
              <AntDesign name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="-mr-1">
      <View style={styles.container} className={classes}>
        {/* {title && (
        <Text style={styles.title} className="text-2xl">
          {title}
        </Text>
      )} */}
        <FlatList
          data={items}
          renderItem={renderDrinkItem}
          keyExtractor={(item) => item._id} // FlatList handles the key
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Add your container styles
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  list: {
    marginTop: 8,
  },
  card: {
    width: 150,
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3, // Add shadow on Android
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    borderRadius: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    width: "100%",
  },
});
