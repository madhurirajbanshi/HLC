import { useCart } from '@/hooks/useCart';
import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function Cart() {

  const {user} = useUserStore();
  const {
    cartItems,
    loading,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
  } = useCart();

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialChecked = cartItems.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setCheckedItems(initialChecked);
  }, [cartItems]);

  const formatPrice = (price: number) => `Rs.${price.toLocaleString()}`;

  const handleToggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items from your cart?', [
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
    ]);
  };

  const handleCheckout = () => {

    if (!user) {
      Toast.show({
        type: 'info',
        text1: 'Please login to proceed with checkout',
        position: 'top',
        visibilityTime: 2000,
      });
      router.push('/login');
      return;
    }

    const itemsToCheckout = cartItems.filter((item) => checkedItems[item.id]);
    if (itemsToCheckout.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Please select at least one item to checkout',
        position: 'top',
        visibilityTime: 2000,
      });
      return;
    }

    router.push({
      pathname: '/checkout/[from]',
      params: {
        from: 'cart',
      },
    });
  };

  const allChecked = cartItems.length > 0 && cartItems.every((item) => checkedItems[item.id]);

  const toggleSelectAll = () => {
    const newChecked: Record<string, boolean> = {};
    cartItems.forEach((item) => (newChecked[item.id] = !allChecked));
    setCheckedItems(newChecked);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-base text-gray-600">Loading cart...</Text>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Ionicons name="cart-outline" size={70} color="#9ca3af" />
        <Text className="text-xl font-bold text-gray-900 mt-4 mb-1">Your cart is empty</Text>
        <Text className="text-gray-500 text-sm text-center mb-8">Add some products to get started</Text>
        <TouchableOpacity className="bg-purple-500 px-6 py-2 rounded-lg" onPress={() => router.push('/')}>
          <Text className="text-white font-medium text-base">Continue Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-5 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">Shopping Cart</Text>
          <TouchableOpacity onPress={handleClearCart}>
            <Text className="text-red-500 font-medium text-sm">Clear All</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-500 text-sm mt-1">
          {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          {cartItems.map((item) => (
            <View key={item.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row items-center">
                <Pressable
                  onPress={() => handleToggleCheck(item.id)}
                  className="w-5 h-5 border border-gray-400 rounded-md items-center justify-center mr-3"
                >
                  {checkedItems[item.id] && <Ionicons name="checkmark" size={16} color="#2563eb" />}
                </Pressable>

                <Image
                  source={{
                    uri: `https://github.com/bpcancode/ulc-images/blob/main/${item.image}?raw=true`,
                  }}
                  className="w-16 h-16 rounded-md bg-gray-100"
                  resizeMode="contain"
                />

                <View className="flex-1 ml-3">
                  <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text className="text-lg  text-purple-600 mb-2">{formatPrice(item.price)}</Text>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 w-7 h-7 items-center justify-center rounded-md"
                      >
                        <Text className="text-base font-bold text-gray-700">−</Text>
                      </TouchableOpacity>

                      <Text className="text-base font-semibold mx-3 min-w-[26px] text-center">{item.quantity}</Text>

                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 w-7 h-7 items-center justify-center rounded-md"
                      >
                        <Text className="text-base font-bold text-gray-700">+</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => handleRemoveItem(item.id, item.name)} className="p-2">
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View className="border-t border-gray-100 mt-3 pt-2">
                <Text className="text-right text-base text-gray-900">
                  Subtotal: {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="h-28" />
      </ScrollView>

      <View className="bg-white border-t border-gray-100 px-4 py-6 flex-row items-center justify-between">
        <Pressable onPress={toggleSelectAll} className="flex-row items-center" hitSlop={10}>
          <View className="w-5 h-5 border border-gray-400 rounded-md items-center justify-center mr-2">
            {allChecked && <Ionicons name="checkmark" size={16} color="#2563eb" />}
          </View>
          <Text className="text-base font-semibold text-gray-900">All</Text>
        </Pressable>

        <Text className="text-base font-bold text-gray-900">
          Subtotal:{' '}
          {formatPrice(
            cartItems
              .filter((item) => checkedItems[item.id])
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
          )}
        </Text>

        <TouchableOpacity
          onPress={handleCheckout}
          className="bg-electric px-4 py-2 rounded-lg flex-row items-center"
          disabled={cartItems.filter((item) => checkedItems[item.id]).length === 0}
          style={{
            opacity: cartItems.filter((item) => checkedItems[item.id]).length === 0 ? 0.5 : 1,
          }}
        >
          <Ionicons name="card-outline" size={18} color="white" />
          <Text className="text-white font-semibold text-base ml-2">Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}