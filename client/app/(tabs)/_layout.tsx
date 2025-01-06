import React from "react";
import { View, Text, Pressable } from "react-native";
import { Link, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
        gap: 5,
        flex: 1,
      }}
    >
      <AntDesign name={props.name} size={20} color={props.color} />
      <Text style={{ fontSize: 12, color: props.color, whiteSpace: "nowrap" }}>
        {props.label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: "#A3A3A3",
        tabBarStyle: {
          backgroundColor: "#1E293B",
          bottom: 20,
          borderTopWidth: 0,
          marginHorizontal: 16,
          elevation: 0,
          // shadowOpacity: 0,
          borderRadius: 35,
          position: "absolute",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 60,
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
        name="menu"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="menu" color={color} label="Menu" />
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
          title: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user" color={color} label="Profile" />
          ),
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
