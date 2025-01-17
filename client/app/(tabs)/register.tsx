import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { register } from "../../services/authService";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import LabeledTextInput from "@/components/LabeledTextInput";
import { handleNotification, isValidEmail, isValidPhoneNumber } from "@/lib/utils";
import Toast from "react-native-toast-message";

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
      handleNotification("error", "Missing Fields");
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      handleNotification("error", "Invalid Email");
      return;
    }

    // Validate that both passwords match
    if (password !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "Passwords do not match. Please try again."
      );
      handleNotification("error", "Password Mismatch");
      return;
    }
    // Validate phone number format
    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid phone number (10-15 digits)."
      );
      handleNotification("error", "Invalid Phone Number");
      
      return;
    }

    setLoading(true);
    try {
      const res = await register(username, email, password);
      const userData = await res;
      Alert.alert("Registration Successful", `Welcome ${username}`);
      handleNotification(
        "success",
        "Your account has been successfully created. Start exploring now!"
      );
      
      router.replace("/login");

      
      
      
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white flex-1 flex-col p-1">
      <Text className="text-2xl text-center mt-2 text-bold">Signup</Text>
      <ScrollView>
        <View className="flex-col mt-2 items-center justify-center">
          <LabeledTextInput
            label="Full Name"
            value={username}
            placeholder="Enter your name"
            onChangeText={setName}
            styleClasses="m-0.5"
          />
          <LabeledTextInput
            label="Email"
            value={email}
            placeholder="Enter your email"
            onChangeText={setEmail}
            styleClasses="m-0.5"
          />
          <LabeledTextInput
            label="Phone Number"
            value={phoneNumber}
            placeholder="Enter your phone number"
            onChangeText={setPhoneNumber}
            styleClasses="m-0.5"
            keyboardType="phone-pad"
          />
          <LabeledTextInput
            label="Password"
            value={password}
            placeholder="Enter your password"
            onChangeText={setPassword}
            secureTextEntry={true}
            styleClasses="m-0.5"
          />
          <LabeledTextInput
            label="Confirm Password"
            value={confirmPassword}
            placeholder="Confirm your password"
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            styleClasses="m-0.5"
          />
          <TouchableOpacity
            className="w-full mt-1.5 rounded-lg bg-primary-10"
            onPress={handleRegister}
          >
            <Text className="w-full text-center px-0.5 py-0.5 rounded-2 text-white">
              {loading ? "Loading..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-1">
            <Text className="">Have an account?</Text>
            <TouchableOpacity
              className="text-primary"
              onPress={() => router.push("/login")}
            >
              <Text className="text-primary-10"> Sign in here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
