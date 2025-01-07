import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { getImageForValue, AvatarKey } from "@/lib/utils";
import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import { editUser, deleteUser } from "@/services/authService";

const avatarKeys: AvatarKey[] = [
  "10",
  "20",
  "30",
  "40",
  "50",
  "60",
  "70",
  "80",
  "90",
  "100",
];

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { username, userEmail, systemAvatar, token, userId, setUser } =
    useUser();
  const [name, setName] = useState(username);
  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(systemAvatar);
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(username);
    setEmail(userEmail);
    setSelectedAvatar(systemAvatar);
  }, [username, userEmail, systemAvatar]);

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert("Error", "Name and Email cannot be empty");
      return;
    }
    console.log("userId:", userId);
    setLoading(true);
    try {
      const updates = {
        username: name,
        email,
        systemAvatar: selectedAvatar,
      };
      const updatedUser = await editUser(userId, updates, token);
      console.log("updatedUserfromprofile:", updatedUser.user);
      setUser(updatedUser.user);
      setIsEditing(false);
      Alert.alert(
        "Profile Updated",
        "Your profile has been successfully updated."
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteUser(userId, token);
              Alert.alert(
                "Account Deleted",
                "Your account has been successfully deleted."
              );
              router.replace("/login"); // Redirect to login page
            } catch (error) {
              Alert.alert("Error", error.message || "Failed to delete account");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderAvatarItem = ({ item }: { item: AvatarKey }) => (
    <TouchableOpacity onPress={() => setSelectedAvatar(item)}>
      <Image
        source={getImageForValue(item)}
        style={[
          styles.avatarOption,
          selectedAvatar === item && styles.selectedAvatar,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* User Avatar */}
      <TouchableOpacity onPress={() => setAvatarModalVisible(true)}>
        <Image
          source={getImageForValue(selectedAvatar)}
          style={styles.avatar}
        />
      </TouchableOpacity>

      {/* User Details */}
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={name}
            placeholder="Enter Name"
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Enter Email"
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter New Password"
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Delete Account Button */}
      {!isEditing && (
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      )}

      {/* Avatar Selection Modal */}
      <Modal
        visible={isAvatarModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={avatarKeys}
            renderItem={renderAvatarItem}
            keyExtractor={(item) => item}
            numColumns={3}
            contentContainerStyle={styles.avatarList}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setAvatarModalVisible(false)}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  deleteButton: {
    backgroundColor: "#d9534f",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    width: "80%",
    fontSize: 16,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  avatarList: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOption: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 40,
  },
  selectedAvatar: {
    borderWidth: 3,
    borderColor: "#6200EE",
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 5,
  },
});

export default ProfileScreen;
