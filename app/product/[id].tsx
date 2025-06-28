import { useCart } from "@/hooks/useCart";
import useFetch from "@/hooks/useFetch";
import { getProductById } from "@/services/productService";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import Toast from "react-native-toast-message";

import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { data: product, loading, error } = useFetch(() =>
    getProductById(id as string)
  );

  // Zustand cart hook - much simpler now!
  const { addToCart, isInCart } = useCart();

  const { width } = useWindowDimensions();

  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return `Rs.${price.toLocaleString()}`;
  };

  const handleAddToCartClick = () => {
    if (product) {
      setShowAddToCartModal(true);
    }
  };

  const handleConfirmAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }, cartQuantity);

      setShowAddToCartModal(false);
      setCartQuantity(1); // Reset quantity

      Toast.show({
        type: "success",
        text1: "Added to cart successfully!",
        text2: `${cartQuantity} x ${product.name}`,
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
      // addToCart({
      //   id: product.id,
      //   name: product.name,
      //   price: product.price,
      //   image: product.image
      // }, cartQuantity);

      // setShowAddToCartModal(false);
      // setCartQuantity(1);

      router.push({
        pathname: "/checkout/[from]",
        params: {
          from: "buyNow",
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productImage: product.image,
          quantity: buyNowQuantity,
        },
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

      {/* Add to Cart Modal */}
      <Modal
        visible={showAddToCartModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddToCartModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-5 rounded-2xl shadow-lg">
            <View className="flex-row items-center mb-4">
              <Ionicons name="cart-outline" size={24} color="#374151" />
              <Text className="text-lg font-bold text-gray-900 ml-2">
                Add to Cart
              </Text>
            </View>

            <Image
              source={{
                uri: `https://github.com/bpcancode/ulc-images/blob/main/${product.image}?raw=true`,
              }}
              className="w-full h-32 mb-3 rounded-xl"
              resizeMode="contain"
            />

            <Text
              className="text-center text-base font-semibold text-gray-900 mb-4"
              numberOfLines={2}
            >
              {product.name}
            </Text>

            <View className="bg-gray-50 p-3 rounded-lg mb-4">
              <Text className="text-center text-sm text-gray-600">Price per item</Text>
              <Text className="text-center text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm font-medium text-gray-700">Quantity:</Text>

              <View className="flex-row items-center space-x-4">
                <TouchableOpacity
                  onPress={() => setCartQuantity((prev) => Math.max(1, prev - 1))}
                  className="bg-gray-200 w-8 h-8 items-center justify-center rounded"
                >
                  <Text className="text-xl text-gray-700">−</Text>
                </TouchableOpacity>

                <Text className="text-lg font-semibold w-6 text-center">{cartQuantity}</Text>

                <TouchableOpacity
                  onPress={() => setCartQuantity((prev) => prev + 1)}
                  className="bg-gray-200 w-8 h-8 items-center justify-center rounded"
                >
                  <Text className="text-xl text-gray-700">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Show total price for selected quantity */}
            <View className="bg-blue-50 p-3 rounded-lg mb-4">
              <Text className="text-center text-sm text-blue-600">Total</Text>
              <Text className="text-center text-xl font-bold text-blue-700">
                {formatPrice(product.price * cartQuantity)}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg mb-3"
              onPress={handleConfirmAddToCart}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="cart" size={20} color="white" />
                <Text className="text-white font-semibold text-base ml-2">
                  Add to Cart
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="self-center"
              onPress={() => setShowAddToCartModal(false)}
            >
              <Text className="text-center text-gray-500 font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showBuyNowModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBuyNowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-5 rounded-2xl shadow-lg">
            <View className="flex-row items-center mb-4">
              <Ionicons name="flash" size={24} color="#f59e0b" />
              <Text className="text-lg font-bold text-gray-900 ml-2">
                Buy Now
              </Text>
            </View>

            <Image
              source={{
                uri: `https://github.com/bpcancode/ulc-images/blob/main/${product.image}?raw=true`,
              }}
              className="w-full h-32 mb-3 rounded-xl"
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
                  onPress={() => setBuyNowQuantity((prev) => Math.max(1, prev - 1))}
                  className="bg-gray-200 w-8 h-8 items-center justify-center rounded"
                >
                  <Text className="text-xl text-gray-700">−</Text>
                </TouchableOpacity>

                <Text className="text-lg font-semibold w-6 text-center">{buyNowQuantity}</Text>

                <TouchableOpacity
                  onPress={() => setBuyNowQuantity((prev) => prev + 1)}
                  className="bg-gray-200 w-8 h-8 items-center justify-center rounded"
                >
                  <Text className="text-xl text-gray-700">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Show total price */}
            <View className="bg-green-50 p-3 rounded-lg mb-4">
              <Text className="text-center text-sm text-green-600">Total</Text>
              <Text className="text-center text-xl font-bold text-green-700">
                {formatPrice(product.price * buyNowQuantity)}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-electric px-6 py-3 rounded-lg mb-3"
              onPress={handleConfirmPurchase}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="flash" size={20} color="white" />
                <Text className="text-white font-semibold text-base ml-2">
                  Confirm Purchase
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="self-center"
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
            onPress={handleAddToCartClick}
          >
            <Ionicons 
              name={isInCart(product.id) ? "checkmark-circle" : "cart-outline"} 
              size={20} 
              color={isInCart(product.id) ? "#22c55e" : "#374151"} 
            />
            <Text className={`font-semibold text-base ml-2 ${
              isInCart(product.id) ? 'text-green-700' : 'text-gray-700'
            }`}>
              {isInCart(product.id) ? 'Add More' : 'Add to Cart'}
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