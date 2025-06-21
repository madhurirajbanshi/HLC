import { router } from "expo-router";
import { Text, TouchableOpacity, View, Image, StatusBar, FlatList } from "react-native";
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/product/${item.id}`)}
      className="bg-white m-2 p-2 rounded-xl shadow-md flex-1"
      style={{ maxWidth: '31%' }} // Ensures 3 items per row with spacing
    >
      <Image
        source={item.image}
        style={{ width: "100%", height: 100, marginBottom: 10 }}
        resizeMode="contain"
      />
      <Text className="text-base font-semibold text-gray-800 mb-1 text-center">
        {item.name}
      </Text>
      <Text className="text-sm text-red-600 mb-2 text-center">
        ₹{item.price.toLocaleString()}
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
        numColumns={3}
        contentContainerStyle={{ padding: 10, justifyContent: "center" }}
      />
    </SafeAreaView>
  );
}
