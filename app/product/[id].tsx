import useFetch from "@/hooks/useFetch";
import { getProductById } from "@/services/productService";
import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";


export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { data: product, loading, error } = useFetch(() => getProductById(id as string));

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const parseHtmlToText = (html: string) => {
    // Simple HTML to text conversion for React Native
    let text = html.replace(/<ul>/g, '');
    text = text.replace(/<\/ul>/g, '');
    text = text.replace(/<li>/g, '• ');
    text = text.replace(/<\/li>/g, '\n');
    text = text.replace(/<table[^>]*>/g, '');
    text = text.replace(/<\/table>/g, '');
    text = text.replace(/<tr[^>]*>/g, '');
    text = text.replace(/<\/tr>/g, '\n');
    text = text.replace(/<th[^>]*>/g, '');
    text = text.replace(/<\/th>/g, ': ');
    text = text.replace(/<td[^>]*>/g, '');
    text = text.replace(/<\/td>/g, ' | ');
    text = text.replace(/&trade;/g, '™');
    text = text.replace(/&reg;/g, '®');
    return text.trim();
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  // if (!product) return <Text>Product not found.</Text>;

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
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
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white px-4 py-3 shadow-sm">
        <TouchableOpacity 
          className="mb-2"
          onPress={() => router.back()}
        >
          <Text className="text-blue-500 font-semibold">← Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800" numberOfLines={2}>
          {product.name}
        </Text>
      </View>

      {/* Product Image */}
      <View className="bg-white m-4 rounded-xl p-4 shadow-sm">
        <View className="h-64 bg-gray-50 rounded-lg overflow-hidden">
          <Image 
            source={{ uri: `https://github.com/bpcancode/ulc-images/blob/main/${product.image}?raw=true` }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Price */}
      <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
        <Text className="text-sm text-gray-600 mb-1">Price</Text>
        <Text className="text-2xl font-bold text-red-600">
          {formatPrice(product.price)}
        </Text>
      </View>

      {/* Product Details */}
      <View className="bg-white mx-4 mb-6 rounded-xl p-4 shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-3">
          Product Details
        </Text>
        <Text className="text-gray-700 leading-6">
          {parseHtmlToText(product.details)}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="mx-4 mb-8 space-y-3">
        <TouchableOpacity className="bg-green-500 py-4 rounded-xl items-center shadow-sm">
          <Text className="text-white font-bold text-lg">Contact for Purchase</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-blue-500 py-4 rounded-xl items-center shadow-sm">
          <Text className="text-white font-bold text-lg">Add to Wishlist</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}