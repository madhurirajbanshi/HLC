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
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NotificationBadge from "@/components/notificationbadge";
import { getAuth, signOut } from "firebase/auth";
import { useUserStore } from "@/store/userStore";

const { width } = Dimensions.get('window');

getAuth().onAuthStateChanged((user) => {
  if (user) {
    useUserStore.getState().setUser({
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? "",
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

  const UserMenuDrawer = () => (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />
        
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: width * 0.8,
            maxWidth: 320,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 16,
          }}
        >
          <ScrollView style={{ flex: 1 }}>
            <View style={{ 
              backgroundColor: 'white', 
              paddingTop: 50, 
              paddingBottom: 20, 
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0'
            }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ position: 'absolute', top: 45, right: 15 }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              
              <View className="items-center">
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#f8f9fa',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                  borderWidth: 2,
                  borderColor: '#8000FF'
                }}>
                  <Ionicons name="person" size={40} color="#8000FF" />
                </View>
                
                <Text style={{ 
                  color: '#333', 
                  fontSize: 18, 
                  fontWeight: 'bold',
                  marginBottom: 4 
                }}>
                  {user?.displayName || "User"}
                </Text>
                
                <Text style={{ 
                  color: '#666', 
                  fontSize: 14,
                  textAlign: 'center'
                }}>
                  {user?.email || "No email"}
                </Text>
              </View>
            </View>

            <View style={{ paddingVertical: 20 }}>
              
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                }}
                onPress={() => {
                  setModalVisible(false);
                  router.push('/orders');
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#f8f9fa',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons name="bag-outline" size={20} color="#8000FF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: '#333' }}>
                    My Orders
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    Track your purchases
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                }}
                onPress={() => {
                  setModalVisible(false);
                  // router.push('/wishlist');
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#f8f9fa',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons name="heart-outline" size={20} color="#8000FF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: '#333' }}>
                    Wishlist
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    Your saved items
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>

              {/* Help & Support */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                }}
                onPress={() => {
                  setModalVisible(false);
                  // router.push('/support');
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#f8f9fa',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons name="help-circle-outline" size={20} color="#8000FF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: '#333' }}>
                    Help & Support
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    Get assistance
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                }}
                onPress={() => {
                  setModalVisible(false);
                  // router.push('/settings');
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#f8f9fa',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons name="settings-outline" size={20} color="#8000FF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: '#333' }}>
                    Settings
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    App preferences
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>

            </View>

            <View style={{ padding: 20, paddingTop: 10 }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                }}
                onPress={async () => {
                  const auth = getAuth();
                  await signOut(auth);
                  setModalVisible(false);
                  router.replace("/login");
                }}
              >
                <Ionicons 
                  name="exit-outline" 
                  size={20} 
                  color="#8000FF" 
                  style={{ marginLeft: 4 }} 
                />
                <Text
                  style={{
                    marginLeft: 6,
                    color: '#8000FF',
                    fontSize: 16,
                  }}
                >
                  Exit
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <UserMenuDrawer />

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
            <View className="flex-row items-center px-2 py-2 mb-2">
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ marginRight: 12 }}
              >
                <Ionicons name="menu" size={28} color="#8000FF" />
              </TouchableOpacity>

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
                onPress={() => router.push("/notification")}
                style={{ position: "relative", marginRight: 10 }}
              >
                <Ionicons name="notifications-outline" size={26} color="#555" />
                <NotificationBadge count={unreadNotificationCount} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ position: 'relative', top: -2 }}
              >
                <Ionicons name="person-circle-outline" size={32} color="#8000FF" />
              </TouchableOpacity>

            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}