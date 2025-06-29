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
  const [modalVisible, setModalVisible] = useState(false);

  const user = useUserStore((state) => state.user);
  const unreadNotificationCount = 3;

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
      <Text className="text-base font-semibold text-gray-800 text-center">
        {item.name}
      </Text>
      <Text className="text-sm text-red-600 text-center">
        Rs. {item.price.toLocaleString()}
      </Text>
      <Text className="text-electric text-sm px-2 py-1 rounded text-center">
        View Details
      </Text>
    </TouchableOpacity>
  );

  const UserMenu = () => (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onPress={() => setModalVisible(false)}
      >
        <View style={{ flex: 1 }} pointerEvents="box-none">
          <TouchableOpacity
            activeOpacity={1}
            style={{
              position: 'absolute',
              top: 70,
              right: 20,
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
              minWidth: 220,
              borderWidth: 1,
              borderColor: '#e0e0e0',
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* User Info Section */}
            <View className="border-b border-gray-200 pb-3 mb-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="person-circle" size={40} color="#8000FF" />
                <View className="flex-1 ml-3">
                  <Text className="text-base font-semibold text-gray-800">
                    {user?.displayName || 'User'}
                  </Text>
                  <Text className="text-sm text-gray-600" numberOfLines={1}>
                    {user?.email || 'No email'}
                  </Text>
                </View>
              </View>
            </View>

            

         

            <TouchableOpacity
              className="rounded-lg py-2 px-4 mt-2 flex-row items-center justify-center"
              style={{ alignSelf: 'flex-start', marginLeft: 15}}
              onPress={async () => {
                const auth = getAuth();
                await signOut(auth);
                setModalVisible(false);
                router.replace('/login');
              }}
            >
              <Ionicons name="exit-outline" size={18} color="#8000FF" />
              <Text className="text-[#8000FF] font-medium ml-2">Logout</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <UserMenu />

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
              <View className="flex-row items-center px-4 py-2 mb-2">
                <View
                  className="flex-1 flex-row items-center bg-gray-100 border border-electric rounded-full mx-2"
                  style={{ height: 36, paddingHorizontal: 12 }}
                >
                  <Ionicons name="search" size={18} color="#888" />
                  <TextInput
                    placeholder="Search products"
                    placeholderTextColor="#999"
                    className="flex-1 text-sm"
                    style={{ paddingHorizontal: 8, paddingVertical: 0 }}
                    value={search}
                    onChangeText={setSearch}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => router.push('/notification')}
                  style={{ position: 'relative', marginRight: 12 }}
                >
                  <Ionicons name="notifications-outline" size={24} color="#555" />
                  <NotificationBadge count={unreadNotificationCount} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Ionicons name="person-circle-outline" size={30} color="#8000FF" />
                </TouchableOpacity>
              </View>
            </>
          }
        />
      )}
    </SafeAreaView>
  );
}
