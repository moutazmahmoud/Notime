import React from "react";
import { View, Text, Pressable } from "react-native";
import { Link, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUser } from "../../context/UserContext"; // Import the user context

function TabBarIcon(props: {
  name: React.ComponentProps<typeof AntDesign>["name"];
  color: string;
  label: string;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: 0,
        // gap: 5,
        flex: 1,
      }}
    >
      <AntDesign name={props.name} size={20} color={props.color} />
      {/* <Text style={{ fontSize: 12, color: props.color, whiteSpace: "nowrap" }}>
        {props.label}
      </Text> */}
    </View>
  );
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { role } = useUser(); // Access username and systemAvatar using the hook
  console.log("role:", role);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: "#A3A3A3",
        tabBarStyle: {
          backgroundColor: "white",
          // boxShadow: "0px 0px 16px 0px rgba(45, 49, 54, 0.13)",
          bottom: 20,
          borderTopWidth: 0,
          marginHorizontal: 16,
          // shadowOpacity: 0,
          borderRadius: 16,
          position: "absolute",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 60,
          paddingHorizontal: 16,
          // iOS shadow properties
          shadowColor: "rgba(45, 49, 54, 0.13)",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 16, // Equivalent to the blur radius in CSS
          // Android shadow property
          elevation: 16, // Mimics shadow intensity
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} label="Home" />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="profile" color={color} label="My Orders" />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "",
          href: role === "customer" ? "/favorites" : null, // Only add href for customer
          tabBarIcon: ({ color }) => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: 0,
                // gap: 5,
                flex: 1,
              }}
            >
              <MaterialIcons name="favorite" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: 0,
                flex: 1,
              }}
            >
              <Ionicons name="notifications" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "",
          href: role === "Admin" ? "/menu" : null, // Only add href for admins
          tabBarIcon: ({ color }) => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: 0,
                // gap: 5,
                flex: 1,
              }}
            >
              <MaterialIcons name="menu" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          tabBarStyle: { display: "none" },
          title: "",
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarStyle: { display: "none" },

          title: "",
          href: null,
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          tabBarStyle: { display: "none" },
          title: "",
          href: null,
        }}
      />
      <Tabs.Screen
        name="add-menu-item"
        options={{
          tabBarStyle: { display: "none" },
          title: "",
          href: null,
        }}
      />
      <Tabs.Screen
        name="forgot-password"
        options={{
          tabBarStyle: { display: "none" },
          title: "",
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          href: null,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="" color={color} label="" />
          ),
        }}
      />
    </Tabs>
  );
}
