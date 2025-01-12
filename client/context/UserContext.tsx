import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AvatarKey, handleNotification } from "@/lib/utils";
import { MenuItem } from "@/app/(tabs)/menu";

export const API_URL_Image = "http://192.168.1.101:4000"; // Used to get images for menu items

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface UserContextType {
  username?: string;
  userEmail?: string;
  systemAvatar?: AvatarKey;
  menuItems?: MenuItem[];
  likedMenuItems?: string[];
  token?: string;
  role?: string;
  userId?: string;
  cart?: CartItem[];
  setUser: (user: Partial<UserContextType>) => void;
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  updateLikedMenuItems: (newLikedItems: string[]) => void;
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
    likedMenuItems: [],
    cart: [],
  });

  const setUser = (
    newUser:
      | Partial<UserContextType>
      | ((prevUser: Partial<UserContextType>) => Partial<UserContextType>)
  ) => {
    setUserState((prevUser) => {
      const updatedUser =
        typeof newUser === "function"
          ? newUser(prevUser)
          : { ...prevUser, ...newUser };

      AsyncStorage.setItem("userData", JSON.stringify(updatedUser))
        .then(() =>
          console.log("User data saved to AsyncStorage:", updatedUser)
        )
        .catch((error) => console.error("Failed to save user data:", error));

      return updatedUser;
    });
  };

  const updateLikedMenuItems = (newLikedItems: string[]) => {
    setUser((prevUser: Partial<UserContextType>) => ({
      ...prevUser,
      likedMenuItems: newLikedItems,
    }));
  };

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setUser((prevUser: Partial<UserContextType>) => {
      console.log("addToCart:", prevUser);
      console.log("addToCart:", item);
      console.log("addToCart:", quantity);
      const cart = prevUser.cart || [];
      const existingItem = cart.find((cartItem) => cartItem._id === item._id);

      const updatedCart = existingItem
        ? cart.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          )
        : [...cart, { ...item, quantity }];

      handleNotification("success", "Item added to cart");
      return { ...prevUser, cart: updatedCart };
    });
  };

  const removeFromCart = (id: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      cart: prevUser.cart?.filter((item) => item._id !== id) || [],
    }));
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    setUser((prevUser) => ({
      ...prevUser,
      cart: prevUser.cart?.map((item) =>
        item._id === id ? { ...item, quantity } : item
      ),
    }));
  };

  const clearCart = () => {
    setUser((prevUser) => ({ ...prevUser, cart: [] }));

  };

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
      likedMenuItems: [],
      cart: [],
    });
  };

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
    <UserContext.Provider
      value={{
        ...user,
        setUser,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        updateLikedMenuItems,
        clearCart,
        logout,
      }}
    >
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
