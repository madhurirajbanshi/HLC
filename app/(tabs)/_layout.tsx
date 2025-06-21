import { Ionicons } from '@expo/vector-icons'; // Ionicons from Expo
import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

const logo = require("../../assets/images/crousel_one.png");

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8A2BE2',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#8A2BE2',
          borderTopWidth: 2,
        },
        headerStyle: {
          backgroundColor: '#8A2BE2',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerLeft: () => (
            <Image
              source={logo}
              style={{ width: 120, height: 40, resizeMode: 'contain', marginLeft: 10 }}
            />
          ),
          headerTitle: '', 
          headerRight: () => (
            <Ionicons
              name="search"
              size={24}
              color="#fff"
              style={{ marginRight: 15 }}
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} 
              size={focused ? 24 : 22}
              color={color}
            />
          ),
          tabBarLabel: 'Home',
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: 'My Orders',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'cart' : 'cart-outline'}
              size={focused ? 24 : 22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
