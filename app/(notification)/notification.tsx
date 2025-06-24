import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function Notification() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <Text className="text-lg font-bold">Notifications</Text>
      {/* Your notification content here */}
    </SafeAreaView>
  );
}
