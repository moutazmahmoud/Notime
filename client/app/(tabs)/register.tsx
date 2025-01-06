import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { register } from "../../services/authService";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import LabeledTextInput from "@/components/LabeledTextInput";
import { isValidEmail, isValidPhoneNumber } from "@/lib/utils";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Get the navigation object

  const handleRegister = async () => {
    // Check if any field is empty
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      console.log("Missing Fields");
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      console.log("Invalid Email");
      return;
    }

    // Validate that both passwords match
    if (password !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "Passwords do not match. Please try again."
      );
      console.log("Password Mismatch");
      return;
    }
        // Validate phone number format
    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number (10-15 digits).");
      console.log("Invalid Phone Number");
      return;
    }


    setLoading(true);
    try {
      const res = await register(username, email, password);
      const userData = await res;
      Alert.alert("Registration Successful", `Welcome ${username}`);
      console.log(userData);
      router.replace("/login");

      console.log("registration successful");
      console.log(userData);
      console.log(res);
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white flex-1 flex-col p-4">
      <Text className="text-2xl text-center mt-10 text-bold">Signup</Text>
      <View className="flex-col mt-10 items-center justify-center">
        <LabeledTextInput
          label="Full Name"
          value={username}
          placeholder="Enter your email"
          onChangeText={setName}
          styleClasses="m-4"
        />
        <LabeledTextInput
          label="Email"
          value={email}
          placeholder="Enter your email"
          onChangeText={setEmail}
          styleClasses="m-4"
        />
        <LabeledTextInput
          label="Phone Number"
          value={phoneNumber}
          placeholder="Enter your phone number"
          onChangeText={setPhoneNumber}
          styleClasses="m-4"
          keyboardType="phone-pad"
        />
        <LabeledTextInput
          label="Password"
          value={password}
          placeholder="Enter your password"
          onChangeText={setPassword}
          secureTextEntry={true}
          styleClasses="m-4"
        />
        <LabeledTextInput
          label="Confirm Password"
          value={confirmPassword}
          placeholder="Enter your password"
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          styleClasses="m-4"
        />
        <TouchableOpacity
          className="w-full mt-6 rounded-lg bg-primary-10"
          onPress={handleRegister}
        >
          <Text className="w-full text-center px-2 py-2 rounded-2 text-white">
            {loading ? "Loading..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-center mt-4">
          <Text className="">Have an account?</Text>
          <TouchableOpacity
            className="text-primary"
            onPress={() => router.push("/login")}
          >
            <Text className="text-primary-10"> Sign in here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Register;
