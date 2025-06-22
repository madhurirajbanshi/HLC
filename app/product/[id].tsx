// Update your ProductDetails component
import React, { useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useCart } from "@/hooks/useCart"; // Add this import
import { getProductById } from "@/services/productService";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Modal,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { Ionicons } from "@expo/vector-icons";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { data: product, loading, error } = useFetch(() =>
    getProductById(id as string)
  );

  // Add cart functionality
  const { addToCart, isInCart } = useCart();

  const { width } = useWindowDimensions();

  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return `Rs.${price.toLocaleString()}`;
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }, 1);

      Toast.show({
        type: "success",
        text1: "Added to cart successfully!",
        text2: product.name,
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      setShowBuyNowModal(true);
    }
  };

  const handleConfirmPurchase = () => {
    if (product) {
      // Create order data
      const orderData = {
        id: Date.now(), // Generate unique ID
        orderNumber: `ORD-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        total: product.price * quantity,
        items: [
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
          }
        ]
      };

      console.log(`Buying ${quantity} of ${product.name}`);
      setShowBuyNowModal(false);
      
      Toast.show({
        type: "success",
        text1: `Order placed successfully!`,
        text2: `${quantity} x ${product.name}`,
        position: "top",
        visibilityTime: 3000,
      });

      // Navigate to orders page with the new order data
      router.push({
        pathname: "/orders",
        params: { 
          name: product.name,
          quantity: quantity.toString(),
          price: product.price.toString(),
          image: product.image,
          justOrdered: 'true'
        }
      });
      
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-red-600">Error: {error.message}</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Product not found</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <TouchableOpacity className="mb-2" onPress={() => router.back()}>
            <Text className="text-blue-600 font-medium">← Back</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white mx-4 mt-4 rounded-2xl overflow-hidden shadow-sm">
          <View className="h-72 bg-gray-50">
            <Image
              source={{
                uri: `https://github.com/bpcancode/ulc-images/blob/main/${product.image}?raw=true`,
              }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
          <Text className="text-xl font-bold text-gray-900 p-4" numberOfLines={2}>
            {product.name}
          </Text>
        </View>

        <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <View className="flex-row items-baseline justify-between">
            <View>
              <Text className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                Price
              </Text>
              <Text className="text-3xl font-bold text-gray-900 mt-1">
                {formatPrice(product.price)}
              </Text>
            </View>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 font-semibold text-sm">
                Free Delivery
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Product Details
          </Text>
          <RenderHtml
            contentWidth={width - 64}
            source={{ html: product.details }}
            tagsStyles={{
              p: {
                color: "#374151",
                fontSize: 14,
                lineHeight: 20,
                marginBottom: 8,
              },
              li: { color: "#374151", fontSize: 14, lineHeight: 20 },
              ul: { paddingLeft: 16 },
            }}
          />
        </View>

        <View className="h-24" />
      </ScrollView>

      <Modal
        visible={showBuyNowModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBuyNowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-5 rounded-2xl shadow-lg">
            <Image
              source={{
                uri: `https://github.com/bpcancode/ulc-images/blob/main/${product.image}?raw=true`,
              }}
              className="w-full h-40 mb-2 rounded-xl"
              resizeMode="contain"
            />

            <Text
              className="text-center text-base font-semibold text-gray-900 mb-4"
              numberOfLines={2}
            >
              {product.name}
            </Text>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm font-medium text-gray-700">Quantity:</Text>

              <View className="flex-row items-center space-x-4">
                <TouchableOpacity
                  onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="bg-gray-200 w-8 h-8 items-center justify-center rounded"
                >
                  <Text className="text-xl text-gray-700">−</Text>
                </TouchableOpacity>

                <Text className="text-lg font-semibold w-6 text-center">{quantity}</Text>

                <TouchableOpacity
                  onPress={() => setQuantity((prev) => prev + 1)}
                  className="bg-gray-200 w-8 h-8 items-center justify-center rounded"
                >
                  <Text className="text-xl text-gray-700">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Show total price */}
            <View className="bg-gray-50 p-3 rounded-lg mb-4">
              <Text className="text-center text-lg font-bold text-gray-900">
                Total: {formatPrice(product.price * quantity)}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-electric px-6 py-3 rounded-lg self-center"
              onPress={handleConfirmPurchase}
            >
              <Text className="text-white font-semibold text-base text-center">
                Confirm Purchase
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 self-center"
              onPress={() => setShowBuyNowModal(false)}
            >
              <Text className="text-center text-red-500 font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pb-8 pt-3 shadow-lg">
        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`flex-1 py-4 rounded-xl flex-row items-center justify-center ${
              isInCart(product.id) ? 'bg-green-100' : 'bg-gray-100'
            }`}
            onPress={handleAddToCart}
          >
            <Ionicons 
              name={isInCart(product.id) ? "checkmark-circle" : "cart-outline"} 
              size={20} 
              color={isInCart(product.id) ? "#22c55e" : "#374151"} 
            />
            <Text className={`font-semibold text-base ml-2 ${
              isInCart(product.id) ? 'text-green-700' : 'text-gray-700'
            }`}>
              {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-electric py-4 rounded-xl flex-row items-center justify-center"
            onPress={handleBuyNow}
          >
            <Ionicons name="flash" size={20} color="white" />
            <Text className="text-white font-semibold text-base ml-2 ">
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}