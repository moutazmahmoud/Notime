// screens/Login.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { login } from "../../services/authService";
import { router } from "expo-router";
import LabeledTextInput from "@/components/LabeledTextInput";
import { isValidEmail } from "@/lib/utils";
import { AntDesign } from "@expo/vector-icons";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Missing Fields", "Please fill out this email field.");
      console.log("Missing Fields email");
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      console.log("Invalid Email");
      return;
    }

    setLoading(true);
    try {
      // todo handle forgot password
      console.log("Forgot Password ");
    } catch (error) {
      Alert.alert("Error", error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white flex-1 flex-col p-4">
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-primary-10 p-4 rounded-lg w-10 h-10 flex-row justify-center items-center"
      >
        <AntDesign name="left" size={20} color="#fff" />
      </TouchableOpacity>
      <Text className="text-2xl  mt-10 text-bold">Forgot Password</Text>
      <Text className="text-l mt-10" style={{ color: "#A3A3A3" }}>
        Enter the email address registered with your account. We'll send you a
        link to reset your password.
      </Text>
      <View className="flex-col mt-10 items-center justify-center">
        <LabeledTextInput
          label="Email"
          value={email}
          placeholder="Enter your email"
          onChangeText={setEmail}
        />
        <TouchableOpacity
          className="w-full mt-10 rounded-lg bg-primary-10"
          onPress={handleForgotPassword}
        >
          <Text className="w-full text-center px-2 py-2 rounded-2 text-white">
            {loading ? "Loading..." : "Send Email"}
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-center mt-4">
          <Text className="">Remembered password? </Text>
          <TouchableOpacity
            className="text-primary"
            onPress={() => router.push("/login")}
          >
            <Text className="text-primary-10">Login to your account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;
