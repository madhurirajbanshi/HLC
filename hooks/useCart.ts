// hooks/useCart.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isInCart: (productId: string) => boolean;
  setLoading: (loading: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      loading: true,

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cartItems.find(item => item.id === product.id);
          
          if (existingItem) {
            // If item already exists, update quantity
            return {
              cartItems: state.cartItems.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          } else {
            // Add new item
            return {
              cartItems: [...state.cartItems, { ...product, quantity }]
            };
          }
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.id !== productId)
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => {
        set({ cartItems: [] });
      },

      getCartTotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getCartItemCount: () => {
        const { cartItems } = get();
        return cartItems.reduce((count, item) => count + item.quantity, 0);
      },

      isInCart: (productId) => {
        const { cartItems } = get();
        return cartItems.some(item => item.id === productId);
      },

      setLoading: (loading) => {
        set({ loading });
      },
    }),
    {
      name: 'cart-storage', // unique name for storage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for React Native
      onRehydrateStorage: () => (state) => {
        // Set loading to false when rehydration is complete
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);

// Also export as default for different import styles
export default useCart;