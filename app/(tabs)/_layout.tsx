import { Tabs } from 'expo-router'
import React from 'react'
import { Text, Image } from 'react-native'

// Use require for image
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
          headerTitle: () => (
            <Image
              source={logo}
              style={{ width: 120, height: 40, resizeMode: 'contain' }}
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              color, 
              fontSize: focused ? 20 : 18,
              transform: [{ scale: focused ? 1.1 : 1 }]
            }}>🏠</Text>
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'My Orders',
          headerStyle: {
            backgroundColor: '#8A2BE2',
          },
          headerTintColor: '#fff',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              color, 
              fontSize: focused ? 20 : 18,
              transform: [{ scale: focused ? 1.1 : 1 }]
            }}>🛒</Text>
          ),
        }}
      />
    </Tabs>
  )
}

export default _layout