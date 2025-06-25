import useFetch from "@/hooks/useFetch";
import { getProducts } from "@/services/productService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NotificationBadge from "@/components/notificationbadge";
import { getAuth, signOut } from "firebase/auth";

import { useUserStore } from "@/store/userStore";

getAuth().onAuthStateChanged((user) => {
    if (user) {
    useUserStore.getState().setUser({
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
    });
  } else {
    useUserStore.getState().clearUser();
  }
  });


export default function Index() {

  const { data: products, loading, error } = useFetch<Product[]>(getProducts);
  const [search, setSearch] = useState("");

  const user = useUserStore((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);

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
      {/* Profile Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => setModalVisible(false)}
        >
          <View style={{ flex: 1 }} pointerEvents="box-none">
            <TouchableOpacity
              activeOpacity={1}
              style={{ position: 'absolute', top: 60, right: 30, backgroundColor: 'white', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 5, minWidth: 200 }}
              onPress={(e) => e.stopPropagation()}
            >
              <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">
                {user?.displayName || user?.email}
              </Text>
              <TouchableOpacity
                className="bg-red-500 rounded px-4 py-2 mt-2"
                onPress={async () => {
                  const auth = getAuth();
                  await signOut(auth);
                  setModalVisible(false);
                }}
              >
                <Text className="text-white text-center">Logout</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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

            <>
            
            <View className="ml-3">
                {user ? (
                  <View className="flex-row m-2 items-center justify-between">
                    
                    <View>

                    <Text className="text-2xl" numberOfLines={2}>Welcome!</Text>
                    <Text className="text-lg font-semibold text-gray-800">
                      {user.displayName || user.email}
                      </Text>
                    </View>
                    
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                      <Ionicons name="person-circle-outline" size={48} color="#8000FF" />
                    </TouchableOpacity>
                  </View>
                ) : (

                  <View className="flex-row m-2 items-center justify-between">
                    
                    <View>
                    <Text className="text-2xl" numberOfLines={2}>Welcome!</Text>
                      <Text className="text-lg font-semibold text-gray-800">
                        Anonymous User
                      </Text>
                    </View>

                    <TouchableOpacity onPress={() => router.push('/login')}
                      className="ml-2" >
                        <View>
                          <Ionicons name="log-in-outline" size={24} color="#8000FF" />
                        <Text className="text-sm text-electric">Login</Text>

                    </View>
                  </TouchableOpacity>
                  </View>
                  
                  
                )}

              </View>

              <View className="flex-row items-center px-4 py-2 space-x-2 mb-2">
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
                style={{ position: 'relative' }}>
                <Ionicons name="notifications-outline" size={24} color="#555" />
                <NotificationBadge count={unreadNotificationCount} />
              </TouchableOpacity>

              

            </View>

            </>

            
            
          }
        />
      )}
    </SafeAreaView>
  );
}
