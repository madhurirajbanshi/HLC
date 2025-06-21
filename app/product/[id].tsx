import useFetch from "@/hooks/useFetch";
import { getProductById } from "@/services/productService";
import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { Ionicons } from "@expo/vector-icons";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { data: product, loading, error } = useFetch(() =>
    getProductById(id as string)
  );

  const { width } = useWindowDimensions();

  const formatPrice = (price: number) => {
    return `Rs.${price.toLocaleString()}`;
  };

  const handleAddToCart = () => {
    if (product) {
      console.log("Added to cart:", product.name);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      console.log("Buy now:", product.name);
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
          <Text className="text-xl font-bold text-gray-900" numberOfLines={2}>
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
              p: { color: '#374151', fontSize: 14, lineHeight: 20, marginBottom: 8 },
              li: { color: '#374151', fontSize: 14, lineHeight: 20 },
              ul: { paddingLeft: 16 },
            }}
          />
        </View>

        <View className="h-24" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
        <View className="flex-row gap-3">
          <TouchableOpacity 
            className="flex-1 bg-gray-100 py-4 rounded-xl flex-row items-center justify-center mb-20"
            onPress={handleAddToCart}
          >
            <Ionicons name="cart-outline" size={20} color="#374151" />
            <Text className="text-gray-700 font-semibold text-base ml-2 ">
              Add to Cart
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 bg-blue-600 py-4 rounded-xl flex-row items-center justify-center mb-20"
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