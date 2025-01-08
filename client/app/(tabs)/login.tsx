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
import { useUser } from "../../context/UserContext"; // Use custom hook for user context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useUser(); // Access the context's setUser function

  const handleLogin = async () => {
    // Check if any field is empty
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
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
    } catch (error) {
      Alert.alert("Login Failed", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white flex-1 flex-col p-4">
      <Text className="text-2xl text-center mt-10 font-bold">Login</Text>
      <View className="flex-col mt-10 items-center justify-center">
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
          styleClasses="m-6"
          secureTextEntry={true}
        />
        <TouchableOpacity
          className="w-full mt-6 rounded-lg bg-primary-10"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="w-full text-center px-2 py-2 text-white">
            {loading ? "Loading..." : "Login"}
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-center mt-6">
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
