import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CartTabIcon from "@/components/cartTabIcon";
const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#8000FF",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={focused ? 24 : 22}
              color={color}
            />
          ),
          tabBarLabel: "Home",
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={focused ? 24 : 22}
              color={color}
            />
          ),
          tabBarLabel: "Orders",
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <CartTabIcon color={color} focused={focused} size={focused ? 24 : 22} />
          ),
          tabBarLabel: "Cart",
        }}
      />
    </Tabs>
  );
};

export default _layout;
