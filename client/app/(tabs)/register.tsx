import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { register } from "../../services/authService";
import { useNavigation } from "@react-navigation/native";
import router from 'expo-router';

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Get the navigation object

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await register(username, email, password);
      const userData  = await res
      Alert.alert("Registration Successful", `Welcome ${username}`);
      console.log(userData);
      // router.replace('/login');

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
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text>Register</Text>
      <TextInput
        placeholder="Name"
        value={username}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />
      <Button
        title={loading ? "Loading..." : "Register"}
        onPress={handleRegister}
      />
    </View>
  );
};

export default Register;
