import { Tabs } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Text style={{ color }}>🏠</Text>
            ),
          }} />
        <Tabs.Screen
            name="orders"
            options={{
                title: 'My Orders',
                tabBarIcon: ({ color }) => (
                <Text style={{ color }}>🛒</Text>
                ),
            }}/>
    </Tabs>
  )
}

export default _layout