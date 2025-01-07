import React, { useContext } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useUser } from "../../context/UserContext"; // Import the user context
import SearchBar from "@/components/Searchbar";
import DrinksHomeView from "@/components/DrinksHomeList";
import { useState } from "react";
import { getImageForValue , AvatarKey} from "@/lib/utils";
import { router } from "expo-router";

export default function HomeScreen() {
  const { username, systemAvatar } = useUser(); // Access username and systemAvatar using the hook
  const [searchQuery, setSearchQuery] = useState("");
  console.log("Username:", username);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    console.log("Search Query:", text); // Replace with actual search logic
  };
  const avatarKey =
    systemAvatar &&
    ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"].includes(
      systemAvatar
    )
      ? (systemAvatar as AvatarKey)
      : "10"; // Fallback to default avatarkey;

  return (
    <View className="flex-1 bg-white dark:bg-black inset-0 bg-blue px-4 flex-col">
      <ScrollView>
        {/* Header */}
        <View className="items-center space-between flex-row w-full justify-between mt-6">
          <Text className="text-xl font-bold text-dark dark:text-white">
            Hi, {username || "Guest"} {/* Display the username */}
          </Text>
          {/* Avatar */}
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Image
              source={getImageForValue(avatarKey)} // Use the provided avatar key or default to "10"
              className="rounded-full w-5 h-5"
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
        </View>

        {/* Intro Text */}
        <View className="mt-4 text-2xl">
          <Text className="text-2xl">Find the best</Text>
          <Text className="text-2xl">coffee for you</Text>
        </View>

        {/* Search Bar */}
        <View className="mt-4">
          <SearchBar
            placeholder="Search for items"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Drinks Section */}
        <DrinksHomeView />
      </ScrollView>
    </View>
  );
}
