import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkInitialRoute = async () => {
      try {
        // Fixed: Use consistent key name
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        const userToken = await AsyncStorage.getItem('userToken');

        if (hasSeenOnboarding === null) {
          // Show onboarding screen
          router.replace('/(onboarding)/onboarding');
        } else if (userToken) {
          // Show main app
          router.replace('/(tabs)');
        } else {
          // Show login screen
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Routing error:', error);
        router.replace('/(auth)/login');
      } finally {
        setIsReady(true);
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 500);
      }
    };

    checkInitialRoute();
  }, []);

  if (!isReady) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Route groups */}
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />

        {/* Standalone screens */}
        <Stack.Screen name="product/[id]" />
      </Stack>
      <Toast />
    </>
  );
}