import React, { useState } from "react";
import { Tabs } from "expo-router";
import { Image, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const logo = require("../../assets/images/crousel_one.png");

const _layout = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8A2BE2",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#8A2BE2",
          borderTopWidth: 2,
        },
        headerStyle: {
          backgroundColor: "#8A2BE2",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerLeft: () => (
            <Image
              source={logo}
              style={{ width: 120, height: 40, resizeMode: "contain", marginLeft: -17 }}
            />
          ),
          headerTitle: "",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#fff",
                borderRadius: 20,
                paddingHorizontal: 12,
                height: 36,
                marginRight: 0,
                backgroundColor: "transparent",
                width: 280,
              }}
            >
              <TextInput
                placeholder="Search"
                placeholderTextColor="#ddd"
                value={searchText}
                onChangeText={setSearchText}
                style={{
                  flex: 1,
                  color: "#fff",
                  paddingVertical: 0,
                }}
              />
              <Ionicons name="search" size={20} color="#fff" style={{ marginLeft: 17 }} />
            </View>
          ),
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
          headerShown: false,
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
          headerShown: false,
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
