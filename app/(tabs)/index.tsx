import { router } from "expo-router";
import { Text, TouchableOpacity, View, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { products } from "../data/products";

export default function Index() {
  console.log("Products:", products);
  console.log("Products type:", typeof products);
  console.log("Is products array:", Array.isArray(products));

  if (!products || !Array.isArray(products)) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Products not loaded. Check import path.</Text>
        <Text>Products: {JSON.stringify(products)}</Text>
      </SafeAreaView>
    );
  }

  const product = products.find(p => p.id === 1);

  if (!product) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Product not found</Text>
        <Text>Available products: {products.length}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white p-5">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <TouchableOpacity
        onPress={() => router.push(`/product/${product.id}`)}
        className="items-center"
      >
        <Image
          source={require("../../assets/images/55InchWebosTv.png")}
          style={{ width: 200, height: 150, marginBottom: 10 }}
          resizeMode="contain"
        />
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          {product.name}
        </Text>
        <Text className="text-lg text-red-600 mb-4">
          ₹{product.price.toLocaleString()}
        </Text>
        <Text className="bg-electric text-white p-2 rounded text-center">
  View Details
</Text>

      </TouchableOpacity>
    </SafeAreaView>
  );
}
