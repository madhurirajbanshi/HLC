import { router } from "expo-router";
import { Text, TouchableOpacity, View, Image, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { products } from "../data/products";

export default function Index() {
  if (!products || !Array.isArray(products)) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Products not loaded. Check import path.</Text>
        <Text>Products: {JSON.stringify(products)}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center" }}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            onPress={() => router.push(`/product/${product.id}`)}
            className="items-center bg-white mb-6 p-4 rounded-xl shadow-md w-full max-w-md"
          >
            <Image
              source={product.image} // Assuming product.image is already a `require(...)` object
              style={{ width: 200, height: 150, marginBottom: 10 }}
              resizeMode="contain"
            />
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              {product.name}
            </Text>
            <Text className="text-lg text-red-600 mb-2">
              ₹{product.price.toLocaleString()}
            </Text>
            <Text className="bg-electric text-white p-2 rounded text-center w-full">
              View Details
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
