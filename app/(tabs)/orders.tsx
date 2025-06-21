import useFetch from '@/hooks/useFetch';
import { getProducts } from '@/services/productService';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';

const Orders = () => {
  const { data: products, loading, error, refetch } = useFetch<Product[]>(getProducts);

   if (loading) return <Text className="text-center mt-4">Loading...</Text>;
   if (error) return <Text className="text-red-500 text-center mt-4">{error.message}</Text>;
  
  return (
      <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => (
        <View className="bg-white rounded-xl p-4 mb-4 shadow shadow-black">
          <Image
            source={{ uri: `https://github.com/bpcancode/ulc-images/blob/main/${item.image}?raw=true` }}
            className="w-full h-40 rounded-md mb-3"
            resizeMode="cover"
          />
          <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-base text-green-600 font-medium">Rs. {item.price}</Text>
        </View>
      )}
    />
  )
}

export default Orders