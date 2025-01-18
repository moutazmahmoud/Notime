import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { UserProvider, useUser } from "../context/UserContext";
import Toast from "react-native-toast-message";

import "../global.css";
import React from "react";
import toastConfig from "@/lib/toastConfig";
import LoadingScreen from "@/components/LoadingScreen";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font, // Ensure FontAwesome is included here
  });

  // Handle splash screen visibility based on font loading state
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Return null while fonts are loading
  }

  return (
    <UserProvider>
      <RootLayoutNav />
    </UserProvider>
  );
}
const RootLayoutNav = () => {
  const { token, restoreToken } = useUser(); // Assume restoreToken initializes the token
  const [isLoading, setIsLoading] = useState(true); // Track initialization state
  const isAuthenticated: boolean = !!token;
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      await restoreToken(); // Restore the token (from storage or API)
      setIsLoading(false); // Mark initialization as complete
    };

    initializeAuth();
  }, [restoreToken]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [isLoading, isAuthenticated, router]);

  // Show a loading screen until token is restored
  if (isLoading) {
    return <LoadingScreen />; // Replace with your custom loading component
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
};
