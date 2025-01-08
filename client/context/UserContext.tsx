import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AvatarKey } from "@/lib/utils";
import { MenuItem } from "@/app/(tabs)/menu";

interface UserContextType {
  username: string;
  userEmail: string;
  systemAvatar: AvatarKey;
  menuItems: MenuItem[];
  token: string;
  role: string;
  userId: string;
  setUser: (user: Partial<UserContextType>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<Partial<UserContextType>>({
    username: "",
    systemAvatar: "10",
    token: "",
    role: "",
    userEmail: "",
    userId: "",
    menuItems: [],
  });

// Save user to AsyncStorage and context
const setUser = (newUser: Partial<UserContextType>) => {
  setUserState((prev) => {
    const updatedUser = { ...prev, ...newUser };

    // Save updated user data to AsyncStorage
    AsyncStorage.setItem("userData", JSON.stringify(updatedUser))
      .then(() => console.log("User data saved to AsyncStorage:", updatedUser))
      .catch((error) => console.error("Failed to save user data:", error));

    return updatedUser;
  });
};


  // Logout user
  const logout = async () => {
    await AsyncStorage.removeItem("userData");
    setUserState({
      username: "",
      systemAvatar: "10",
      token: "",
      role: "",
      userEmail: "",
      userId: "",
      menuItems: [],
    });
  };

  // Restore user data on app load
  useEffect(() => {
    const restoreUser = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }
    };
    restoreUser();
  }, []);

  return (
    <UserContext.Provider value={{ ...user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
