// app/(tabs)/cart.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function Cart() {
  const {
    cartItems,
    loading,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useCart();

  const formatPrice = (price: number) => {
    return `Rs.${price.toLocaleString()}`;
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${productName}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeFromCart(productId);
            Toast.show({
              type: 'success',
              text1: 'Item removed from cart',
              position: 'top',
              visibilityTime: 2000,
            });
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearCart();
            Toast.show({
              type: 'success',
              text1: 'Cart cleared',
              position: 'top',
              visibilityTime: 2000,
            });
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Navigate to checkout or process order
    router.push('/orders');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading cart...</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Ionicons name="cart-outline" size={80} color="#9ca3af" />
        <Text className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          Your cart is empty
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          Add some products to get started
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-8 py-3 rounded-xl"
          onPress={() => router.push('/')}
        >
          <Text className="text-white font-semibold text-lg">
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">
            Shopping Cart
          </Text>
          <TouchableOpacity onPress={handleClearCart}>
            <Text className="text-red-500 font-medium">Clear All</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-500 mt-1">
          {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          {cartItems.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
            >
              <View className="flex-row">
                {/* Product Image */}
                <Image
                  source={{
                    uri: `https://github.com/bpcancode/ulc-images/blob/main/${item.image}?raw=true`,
                  }}
                  className="w-20 h-20 rounded-xl bg-gray-100"
                  resizeMode="contain"
                />

                {/* Product Details */}
                <View className="flex-1 ml-4">
                  <Text
                    className="text-lg font-semibold text-gray-900 mb-1"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xl font-bold text-blue-600 mb-3">
                    {formatPrice(item.price)}
                  </Text>

                  {/* Quantity Controls */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="bg-gray-200 w-8 h-8 items-center justify-center rounded-lg"
                      >
                        <Text className="text-lg font-bold text-gray-700">−</Text>
                      </TouchableOpacity>

                      <Text className="text-lg font-semibold mx-4 min-w-[30px] text-center">
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="bg-gray-200 w-8 h-8 items-center justify-center rounded-lg"
                      >
                        <Text className="text-lg font-bold text-gray-700">+</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.id, item.name)}
                      className="p-2"
                    >
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Subtotal */}
              <View className="border-t border-gray-100 mt-4 pt-3">
                <Text className="text-right text-lg font-bold text-gray-900">
                  Subtotal: {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Add some bottom padding for the checkout button */}
        <View className="h-32" />
      </ScrollView>

      {/* Checkout Section */}
      <View className="bg-white border-t border-gray-100 px-4 py-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-900">Total:</Text>
          <Text className="text-2xl font-bold text-blue-600">
            {formatPrice(getCartTotal())}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-xl flex-row items-center justify-center"
          onPress={handleCheckout}
        >
          <Ionicons name="card-outline" size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-2">
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}