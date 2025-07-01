import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Setting = () => {

    const handleStorageClear = async () => {
        try {
            await AsyncStorage.clear();
            Toast.show({
                type: 'success',
                text1: 'Storage Cleared',
                text2: 'All data has been cleared successfully.',
            });
        }
        catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error Clearing Storage',
                text2: 'Failed to clear storage.',
            });
        }
    }
    return (
        <View className='flex-1 items-center justify-center'>
            <Text className='text-lg text-blue-500' onPress={handleStorageClear}>
                Clear Storage
            </Text>
            <Toast />
        </View>
    )
}

export default Setting