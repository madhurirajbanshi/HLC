import { Stack } from "expo-router";
import "../global.css";
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
      <Toast />
    </>
  );
}
