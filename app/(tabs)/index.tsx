import React, { useState } from "react";
import useFetch from "@/hooks/useFetch";
import { getProducts } from "@/services/productService";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import NotificationBadge from "@/components/notificationbadge";
export default function Index() {
  const { data: products, loading, error } = useFetch<Product[]>(getProducts);
  const [search, setSearch] = useState("");

  

  const filteredProducts =
    search.trim().length > 0
      ? products?.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      : products;

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => router.push(`/product/${item.id}`)}
      className="bg-white m-2 p-2 rounded-xl shadow-md flex-1"
      style={{ maxWidth: "49%" }}
    >
      <Image
        source={{
          uri: `https://github.com/bpcancode/ulc-images/blob/main/${item.image}?raw=true`,
        }}
        style={{ width: "100%", height: 100, marginBottom: 10 }}
        resizeMode="contain"
      />
      <Text className="text-base font-semibold text-gray-800  text-center">
        {item.name}
      </Text>
      <Text className="text-sm text-red-600  text-center">
        Rs. {item.price.toLocaleString()}
      </Text>
      <Text className=" text-electric text-sm px-2 py-1  rounded text-center">
        View Details
      </Text>
    </TouchableOpacity>
  );
  const unreadNotificationCount = 3;
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {loading ? (
        <Text className="text-center mt-4">Loading...</Text>
      ) : error ? (
        <Text className="text-red-500 text-center mt-4">{error.message}</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 10, justifyContent: "center" }}
          ListHeaderComponent={
            <View className="flex-row items-center px-4 py-2 space-x-2 mb-2">
              {/* Search Bar */}
              <View
                className="flex-1 flex-row items-center bg-gray-100 border border-electric rounded-full px-3 "
              >
                <Ionicons name="search" size={18} color="#888" />
                <TextInput
                  placeholder="Search products"
                  placeholderTextColor="#999"
                  className="flex-1 text-sm px-2"
                  value={search}
                  onChangeText={setSearch}
                />

             
              </View>

              <TouchableOpacity
  className="ml-2"
  onPress={() => router.push('/notification')}
  style={{ position: 'relative' }}  // important for badge positioning
>
  <Ionicons name="notifications-outline" size={24} color="#555" />
  <NotificationBadge count={unreadNotificationCount} />
</TouchableOpacity>

            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
