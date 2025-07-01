import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkInitialRoute = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        if (hasSeenOnboarding === null) {
          setInitialRoute('onboarding');
        } else {
          setInitialRoute('tabs');
        }
      } catch (error) {
        setInitialRoute('tabs');
      }
    };
    checkInitialRoute();
  }, []);

  useEffect(() => {
    if (initialRoute) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 200);
    }
  }, [initialRoute]);

  if (!initialRoute) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} initialRouteName={initialRoute === 'onboarding' ? '(onboarding)' : '(tabs)'}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
      </Stack>
      <Toast />
    </>
  );
}