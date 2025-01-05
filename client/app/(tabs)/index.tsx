import { View, Text } from "react-native";
import { ExternalLink } from "@/components/ExternalLink";
import SearchBar from "@/components/Searchbar";
import { useState } from "react";

export default function TabOneScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    console.log("Search Query:", text); // Replace with actual search logic
  };
  return (
    <View className="flex-1 bg-white dark:bg-black inset-0 bg-blue px-4 flex-col">
      <View className="items-center space-between flex-row w-full justify-between mt-6">
        <Text className="text-xl font-bold text-dark dark:text-white">
          Notime
        </Text>
        <View className="rounded-full w-6 h-6 bg-black"></View>
      </View>
      <View className="mt-4 text-xl">
        <Text>Find the best</Text>
        <Text>Coffee for you</Text>
      </View>
      <View className="mt-4">
        <SearchBar
          placeholder="Search for items"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
}
