import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const Orders = () => {
  return (
    <View className='flex-1 justify-center items-center bg-electric'>
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text className='bg-red-500 text-white p-4 rounded'> Sign In. </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Orders