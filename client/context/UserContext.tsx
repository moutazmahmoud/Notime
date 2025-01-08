import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AvatarKey } from "@/lib/utils";
import { MenuItem } from "@/app/(tabs)/menu";

interface CartItem extends MenuItem {
  quantity: number;
}

interface UserContextType {
  username: string;
  userEmail: string;
  systemAvatar: AvatarKey;
  menuItems: MenuItem[];
  token: string;
  role: string;
  userId: string;
  cart: CartItem[];
  setUser: (user: Partial<UserContextType>) => void;
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
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
        .then(() =>
          console.log("User data saved to AsyncStorage:", updatedUser)
        )
        .catch((error) => console.error("Failed to save user data:", error));

      return updatedUser;
    });
  };

  // Add item to cart
  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setUser((prevUser) => {
      const cart = prevUser.cart || [];
      const existingItem = cart.find((cartItem) => cartItem._id === item._id);

      const updatedCart = existingItem
        ? cart.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          )
        : [...cart, { ...item, quantity }];

      return { ...prevUser, cart: updatedCart };
    });
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      cart: prevUser.cart?.filter((item) => item._id !== id) || [],
    }));
  };

  // Update cart item quantity
  const updateCartItemQuantity = (id: string, quantity: number) => {
    setUser((prevUser) => ({
      ...prevUser,
      cart: prevUser.cart?.map((item) =>
        item._id === id ? { ...item, quantity } : item
      ),
    }));
  };

  // Clear the cart
  const clearCart = () => {
    setUser((prevUser) => ({ ...prevUser, cart: [] }));
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
      cart: [],
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
    <UserContext.Provider
      value={{
        ...user,
        setUser,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
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
