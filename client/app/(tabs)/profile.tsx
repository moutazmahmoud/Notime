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
import { AntDesign } from "@expo/vector-icons";
import BackButton from "@/components/Button";
import TopSpacer from "@/components/TopSpacer";

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
    setLoading(true);
    try {
      const updates = {
        username: name,
        email,
        systemAvatar: selectedAvatar,
      };
      const updatedUser = await editUser(userId, updates, token);
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
    <View style={styles.container} className="bg-background">
      <TopSpacer />
      {/* Back Button */}
      <BackButton
        onPress={() => {
          router.back();
          setIsEditing(false);
        }}
      />

      {/* User Avatar */}
      <View className="flex-row items-center justify-center mt-1">
        <TouchableOpacity onPress={() => setAvatarModalVisible(true)}>
          <Image
            source={getImageForValue(systemAvatar!)}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

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
          <View className="bg-white rounded-lg p-1" style={{ maxWidth: "86%" }}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl text-bold text-black">
                Select Avatar
              </Text>
              <TouchableOpacity
                className=""
                onPress={() => setAvatarModalVisible(false)}
              >
                <AntDesign name="close" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={avatarKeys}
              renderItem={renderAvatarItem}
              keyExtractor={(item) => item}
              numColumns={4}
              contentContainerStyle={styles.avatarList}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setAvatarModalVisible(false);
                handleSave();
              }}
            >
              <Text style={styles.buttonText} className="text-center">
                Save Changes
              </Text>
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
    paddingHorizontal: 16,
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
    width: 48,
    height: 48,
    margin: 10,
    borderRadius: 40,
  },
  selectedAvatar: {
    borderWidth: 4,
    borderColor: "#6200EE",
    backgroundColor: "#6200EE",
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 5,
  },
});

export default ProfileScreen;
