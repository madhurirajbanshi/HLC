import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="checkout"
        options={{
          title: 'Checkout',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
