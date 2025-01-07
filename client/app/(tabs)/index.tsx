import { View, Text, ScrollView } from "react-native";
import { ExternalLink } from "@/components/ExternalLink";
import SearchBar from "@/components/Searchbar";
import { useState } from "react";
import DrinksHomeView from "@/components/DrinksHomeList";
import React from "react";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    console.log("Search Query:", text); // Replace with actual search logic
  };
  return (
    <View className="flex-1 bg-white dark:bg-black inset-0 bg-blue px-4 flex-col">
      <ScrollView>
      <View className="items-center space-between flex-row w-full justify-between mt-6">
        <Text className="text-xl font-bold text-dark dark:text-white">
          Hi, User Name
        </Text>
        <View className="rounded-full w-6 h-6 bg-black"></View>
      </View>
      <View className="mt-4 text-2xl">
        <Text className="text-2xl">Find the best</Text>
        <Text className="text-2xl">coffee for you</Text>
      </View>
      <View className="mt-4">
        <SearchBar
          placeholder="Search for items"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <DrinksHomeView />
      <DrinksHomeView />
      <DrinksHomeView />
      </ScrollView>
    </View>
  );
}
