import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const SignUp = () => {
  return (
    <View className='flex-1 justify-center items-center'>
                <View className='bg-white p-4 gap-y-2 rounded shadow-lg w-80'>
                    <View className='mb-4 flex items-center'>
                        <Text className='text-lg font-bold'>Register</Text>
                    </View>
                    <View className='mb-4'>
                        <Text className='text-gray-700'>Email</Text>
                        <TextInput
                            className='border border-gray-300 p-2 rounded'
                            placeholder='Enter your email'
                            keyboardType='email-address'
                        />
                    </View>
                    <View className='mb-4'>
                        <Text className='text-gray-700'>Password</Text>
                        <TextInput
                            className='border border-gray-300 p-2 rounded'
                            placeholder='Enter your password'
                            secureTextEntry
                        />
                    </View>
                    <TouchableOpacity className='bg-blue-500 p-2 rounded'>
                        <Text className='text-white text-center'>Register</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity className='mt-2' onPress={() => router.push('/(auth)/signup')}>
                        <Text className='text-blue-500 text-center'>Already have an account? Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
  )
}

export default SignUp

const styles = StyleSheet.create({})