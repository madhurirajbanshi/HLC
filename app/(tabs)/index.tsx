import useFetch from "@/hooks/useFetch";
import { getProducts } from "@/services/productService";
import { router } from "expo-router";
import { FlatList, Image, StatusBar, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const { data: products, loading, error, refetch } = useFetch<Product[]>(getProducts);

  if (loading) return <Text className="text-center mt-4">Loading...</Text>;
  if (error) return <Text className="text-red-500 text-center mt-4">{error.message}</Text>;
  

  const renderItem = ({ item }: {item: Product}) => (
    <TouchableOpacity
      onPress={() => router.push(`/product/${item.id}`)}
      className="bg-white m-2 p-2 rounded-xl shadow-md flex-1"
      style={{ maxWidth: '49%' }} 
    >
      <Image
        source={{ uri: `https://github.com/bpcancode/ulc-images/blob/main/${item.image}?raw=true` }}
        style={{ width: "100%", height: 100, marginBottom: 10 }}
        resizeMode="contain"
      />
      <Text className="text-base font-semibold text-gray-800 mb-1 text-center">
        {item.name}
      </Text>
      <Text className="text-sm text-red-600 mb-2 text-center">
        Rs. {item.price.toLocaleString()}
      </Text>
      <Text className="bg-electric text-white text-sm px-2 py-1 rounded text-center">
        View Details
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 10, justifyContent: "center" }}
      />
    </SafeAreaView>
  );
}
