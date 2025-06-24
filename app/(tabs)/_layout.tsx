import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#8000FF", // your custom "electric" color
        tabBarInactiveTintColor: "#999",  // optional
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
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
          tabBarIcon: ({ color, focused }) => (
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
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              size={focused ? 24 : 22}
              color={color}
            />
          ),
          tabBarLabel: "Cart",
        }}
      />
    </Tabs>
  );
};

export default _layout;
