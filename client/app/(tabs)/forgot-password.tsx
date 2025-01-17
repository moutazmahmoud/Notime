import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import {
  sendResetPasswordEmail,
  validateResetCode,
  setNewPasswordWithCode,
} from "../../services/authService";
import { router } from "expo-router";
import LabeledTextInput from "@/components/LabeledTextInput";
import { handleNotification, isValidEmail } from "@/lib/utils";
import { AntDesign } from "@expo/vector-icons";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [newPasswordModalVisible, setNewPasswordModalVisible] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendResetCode = async () => {
    if (!email) {
      Alert.alert("Missing Fields", "Please fill out this email field.");
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
      const res = await sendResetPasswordEmail(email);

      // Show the code input modal after email is sent
      setCodeModalVisible(true);
    } catch (error) {
      Alert.alert("Error", error?.message);
      handleNotification("error", "Error sending reset password email");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length === 4) {
      try {
        const res = await validateResetCode(code, email);
        if (res === 200) {
          // If the code is correct, show the new password modal
          setCodeModalVisible(false);
          setNewPasswordModalVisible(true);
        }
      } catch (error) {
        Alert.alert("Error", error?.message);
        handleNotification("error", "Error validating reset code");
      }
    } else {
      Alert.alert("Invalid Code", "Please enter a valid 4-digit code.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert("Missing Password", "Please enter a new password.");
      return;
    }
    try {
      const res = await setNewPasswordWithCode(code, newPassword, email);
      if (res === 200) {
        // Reset password logic (send to backend)
        setNewPasswordModalVisible(false);
        Alert.alert("Success", "Your password has been reset.");
        router.push("/login"); // Redirect to login screen after resetting password
      }
    } catch (error) {
      Alert.alert("Error", error?.message);
      handleNotification("error", "Error resetting password");
    }
    // Reset password logic (send to backend)
    setNewPasswordModalVisible(false);
    handleNotification("success", "Your password has been reset");
    Alert.alert("Success", "Your password has been reset.");
    router.push("/login"); // Redirect to login screen after resetting password
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <AntDesign name="left" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter the email address registered with your account. We'll send you a
        code to reset your password.
      </Text>

      <LabeledTextInput
        label="Email"
        value={email}
        placeholder="Enter your email"
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSendResetCode}>
        <Text style={styles.sendButtonText}>
          {loading ? "Loading..." : "Send Email"}
        </Text>
      </TouchableOpacity>

      <View style={styles.loginLink}>
        <Text>Remembered password? </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>Login to your account</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for code input */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={codeModalVisible}
        onRequestClose={() => setCodeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter 4-Digit Code</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
              maxLength={4}
              placeholder="Enter code"
            />

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={handleVerifyCode}
            >
              <Text style={styles.closeText}>Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setCodeModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for new password */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={newPasswordModalVisible}
        onRequestClose={() => setNewPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password"
            />

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.closeText}>Reset Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setNewPasswordModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  backButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 50,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#A3A3A3",
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  loginText: {
    color: "#007BFF",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
  },
  closeModalButton: {
    marginTop: 20,
  },
  closeText: {
    color: "#007BFF",
  },
});

export default ForgotPassword;
