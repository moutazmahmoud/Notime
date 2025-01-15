import React, { useContext, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useUser } from "../../context/UserContext"; // Import the user context
import SearchBar from "@/components/Searchbar";
import DrinksHomeView from "@/components/DrinksHomeList";
import { useState } from "react";
import { getImageForValue, AvatarKey } from "@/lib/utils";
import { router } from "expo-router";
import { getMenuItems } from "@/services/menuItemsService";
import DrinksByCategoryView from "@/components/DrinksByCategoryView";
import { AntDesign } from "@expo/vector-icons";
import { MenuItem } from "./menu";

export default function HomeScreen() {
  const { username, systemAvatar, menuItems, setUser, token, cart } = useUser(); // Access username and systemAvatar using the hook
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cartLength: number =
    cart?.map((item) => item.quantity).reduce((a, b) => a + b, 0) || 0;

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getMenuItems(token || "");
        console.log("token", token);
        console.log("items:", items);
        setUser({ menuItems: items });
        console.log("items: from home", items);
      } catch (err) {
        setError("Failed to fetch menu items.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = menuItems?.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(results || []);
    } else {
      setFilteredItems([]);
    }
  }, [searchQuery, menuItems]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };
  const avatarKey =
    systemAvatar &&
    ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"].includes(
      systemAvatar
    )
      ? (systemAvatar as AvatarKey)
      : "10"; // Fallback to default avatarkey;

  // If loading, show a loading message
  if (loading) {
    return (
      <View className="">
        <Text className="">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="pb-5 bg-primary-35">
      <View className="flex-1  dark:bg-black inset-0 bg-blue px-1 flex-col pt-2">
        {/* Header */}
        <View className="items-center space-between flex-row w-full justify-between mt-2">
          <Text className="text-xl font-bold text-dark dark:text-white">
            Hi, {username || "Guest"} {/* Display the username */}
          </Text>
          {/* Avatar */}
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.push("/cart")}
              className="mr-1"
              style={{ marginRight: 16 }}
            >
              <View className="relative">
                <AntDesign name="shoppingcart" size={20} color="#000" />
                {cartLength > 0 ? (
                  <View className="absolute -top-0.5 -right-0.5 bg-red-500 rounded-full w-1 h-1 flex items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {cartLength}
                    </Text>
                  </View>
                ) : (
                  <View className="absolute -top-2 -right-2 bg-gray-300 rounded-full px-2 py-1 opacity-0" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Image
                source={getImageForValue(avatarKey)} // Use the provided avatar key or default to "10"
                className="rounded-full w-5 h-5"
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Intro Text */}
        <View className="mt-1 text-2xl">
          <Text className="text-2xl">Find the best</Text>
          <Text className="text-2xl">coffee for you</Text>
        </View>

        {/* Search Bar */}
        <View className="mt-1">
          <SearchBar
            placeholder="Search for items"
            value={searchQuery}
            onChangeText={handleSearch}
            onClearText={() => setSearchQuery("")}
          />
        </View>

        {/* Search Results */}
        {searchQuery.trim() !== "" && (
          <View className="mt-1">
            {filteredItems.length > 0 ? (
              <DrinksHomeView items={filteredItems} title="Search Results" />
            ) : (
              <Text className="text-center text-black text-lg">
                No results found for "{searchQuery}"
              </Text>
            )}
          </View>
        )}

        {/* Drinks Section */}
        <DrinksHomeView
          items={menuItems || []}
          title="Popular Drinks"
          classes="mt-1"
        />
        <DrinksByCategoryView items={menuItems || []} />
        <View className="h-5.5"></View>
      </View>
    </ScrollView>
  );
}
