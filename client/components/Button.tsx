import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  color = "#fff",
  disabled = false,
}: Props) {
  return (
    <Pressable
      style={{
        backgroundColor: color,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 10,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
        {title}
      </Text>
    </Pressable>
  );
}

export default function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      style={{
        borderRadius: 8,
        width: 40,
        height: 40,
      }}
      className="w-2 flex items-center justify-center"
      onPress={onPress}
    >
      <AntDesign name="left" size={24} color="#000" />
    </Pressable>
  );
}
