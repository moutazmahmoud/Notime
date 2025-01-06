import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface LabeledTextInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  isShowingForgotPassword?: boolean;
  styleClasses?: string;
}

const LabeledTextInput: React.FC<LabeledTextInputProps> = ({
  label,
  value,
  placeholder = "",
  onChangeText,
  secureTextEntry = false,
  isShowingForgotPassword = false,
  keyboardType = "default",
  styleClasses = "",
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(!secureTextEntry);

  return (
    <View className={"w-full " + styleClasses}>
      <View className="flex-row justify-between w-full align-center">
        <Text className="text-primary-10">{label}</Text>
        {isShowingForgotPassword && (
          <TouchableOpacity onPress={() => router.push("/forgot-password")}>
            <Text>Forgot password?</Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          secureTextEntry={!isPasswordVisible}
          keyboardType={keyboardType}
          className="mt-2"
        />
        {secureTextEntry && value != "" && (
          <TouchableOpacity
            onPress={() => setPasswordVisible(!isPasswordVisible)}
            className="absolute right-2 top-1/2 -translate-y-1/2 mt-[5px]"
            style={{ marginTop: 5 , right: 12 }}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#A3A3A3"
              className="fill-primary-10"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
});

export default LabeledTextInput;
