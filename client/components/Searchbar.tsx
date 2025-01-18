import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";

interface SearchBarProps extends TextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onClearText: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChangeText,
  onClearText,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
      {value !== "" && (
        <TouchableOpacity
          onPress={onClearText}
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          <AntDesign name="close" size={16} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 0,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingRight: 40,
  },
});

export default SearchBar;
