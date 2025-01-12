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
import { handleNotification, isValidEmail } from "@/lib/utils";
import { useUser } from "../../context/UserContext"; // Use custom hook for user context
import Toast from "react-native-toast-message";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useUser(); // Access the context's setUser function

  const handleLogin = async () => {
    // Check if any field is empty
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      handleNotification("error", "Missing Fields");
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      handleNotification("error", "Invalid Email");
      return;
    }

    setLoading(true);
    try {
      const { user, token, id } = await login(email, password);
      console.log("user:", user);
      console.log("userId:", user.id);
      // Update user data in context
      setUser({
        username: user.username,
        systemAvatar: user.systemAvatar,
        role: user.role,
        userEmail: user.email,
        token: token,
        userId: user.id,
      });

      // Navigate to the home screen
      router.replace("/");
      Alert.alert("Login Successful", `Welcome ${user.username}`);
      handleNotification("success", "Welcome back! Let's get started.");
    } catch (error) {
      Alert.alert("Login Failed", error.message || "Something went wrong.");
      handleNotification("error", "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white flex-1 flex-col p-1">
      <Text className="text-2xl text-center mt-2 font-bold">Login</Text>
      <View className="flex-col mt-2 items-center justify-center">
        <LabeledTextInput
          label="Email"
          value={email}
          placeholder="Enter your email"
          onChangeText={setEmail}
        />
        <LabeledTextInput
          label="Password"
          value={password}
          placeholder="Enter your password"
          onChangeText={setPassword}
          isShowingForgotPassword={true}
          styleClasses="m-1.5"
          secureTextEntry={true}
        />
        <TouchableOpacity
          className="w-full mt-1 rounded-lg bg-primary-10"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="w-full text-center px-0.5 py-0.5 text-white">
            {loading ? "Loading..." : "Login"}
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-center mt-1.5">
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text className="text-primary-10"> Sign up here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
