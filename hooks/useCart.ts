// hooks/useCart.ts
import { useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Since we can't use AsyncStorage in web environment, we'll use localStorage
const CART_STORAGE_KEY = 'cart_items';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from storage on app start
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever cartItems changes
  useEffect(() => {
    if (!loading) {
      saveCart();
    }
  }, [cartItems, loading]);

  const loadCart = () => {
    try {
      // For web environment, use localStorage
      if (typeof window !== 'undefined') {
        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        if (cartData) {
          setCartItems(JSON.parse(cartData));
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = () => {
    try {
      // For web environment, use localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item already exists, update quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
  };
};

// Also export as default for different import styles
export default useCart;