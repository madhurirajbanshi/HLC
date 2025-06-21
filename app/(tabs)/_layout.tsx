import { Tabs } from 'expo-router'
import React from 'react'
import { Text, Image } from 'react-native'

// Use require for image
const logo = require("../../assets/images/crousel_one.png");

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => (
            <Image
              source={logo}
              style={{ width: 120, height: 40, resizeMode: 'contain' }}
            />
          ),
          headerStyle: {
            backgroundColor: '#8000FF',
          },
          headerTintColor: '#fff',
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'My Orders',
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>🛒</Text>
          ),
        }}
      />
    </Tabs>
  )
}

export default _layout
