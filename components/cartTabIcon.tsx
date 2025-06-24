import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';

interface cartTabIconProps {
  color: string;
  focused: boolean;
  size: number;
}

export default function cartTabIcon({ color, focused, size }: cartTabIconProps) {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <View style={{ width: size, height: size }}>
      <Ionicons
        name={focused ? 'cart' : 'cart-outline'}
        size={size}
        color={color}
      />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
});
