import useFetch from "@/hooks/useFetch";
import { getProducts } from "@/services/productService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NotificationBadge from "@/components/notificationbadge";
import { useUserStore } from "@/store/userStore";
import { getAuth } from "firebase/auth";

const { width } = Dimensions.get('window');


const liveNoti = {
  id: '3',
  title: 'Live Lottery Draw',
  message: 'Join us for the live lottery draw happening today at 5 PM.',
  link: 'https://www.youtube.com/watch?v=C4SOe_0jLr0&t=2891s&ab_channel=ULCElectronicsPvt.Ltd',
  imageUrl: 'https://i.ytimg.com/vi/C4SOe_0jLr0/hq720.jpg?sqp=-oaymwFBCNAFEJQDSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGFQgXShlMA8=&rs=AOn4CLBmrjREN8EmWBfMfeGzylp5deJtlA',
  timestamp: new Date(),
  type: 'ytube',
  read: false,
  published: true
};

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

  const [profileModalVisible, setProfileModalVisible] = useState(false);

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

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setProfileModalVisible(false);
    router.replace('/');
  };



  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Profile Modal */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.profileModalOverlay}
          activeOpacity={1}
          onPress={() => setProfileModalVisible(false)}
        >
          <View style={{ flex: 1 }} pointerEvents="box-none">
            <TouchableOpacity
              activeOpacity={1}
              style={styles.profileModalContainer}
              onPress={e => e.stopPropagation()}
            >
              <View style={styles.profileRow}>
                <View style={styles.profileIconWrap}>
                  <Ionicons name="person-circle-outline" size={48} color="#8000FF" />
                </View>
                <View style={styles.profileTextWrap}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {user?.displayName || 'User'}
                  </Text>
                  <Text style={styles.profileEmail} numberOfLines={1}>
                    {user?.email || 'No email'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={logout}
              >
                <View style={styles.logoutRow}>
                  <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </View>
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

              <View className="flex-row items-center px-2 py-2 mb-2">
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

                {user ? (
                  <TouchableOpacity
                    style={{ position: 'relative', top: -2 }}
                    onPress={() => setProfileModalVisible(true)}
                  >
                    <Ionicons name="person-circle-outline" size={32} color="#8000FF" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => router.push("/login")}
                    style={{ position: 'relative', top: -2 }}
                  >
                    <Ionicons name="log-in-outline" size={32} color="#8000FF" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                onPress={() => Linking.openURL(liveNoti.link)}
                activeOpacity={0.85}
                style={styles.notiBanner}
              >
                <Image
                  source={{ uri: liveNoti.imageUrl }}
                  style={styles.notiImage}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.notiLiveRow}>
                    <Text style={styles.notiLiveText}>LIVE</Text>
                    <Ionicons name="logo-youtube" size={18} color="#e11d48" />
                  </View>
                  <Text style={styles.notiTitle} numberOfLines={1}>
                    {liveNoti.title}
                  </Text>
                  <Text style={styles.notiMessage} numberOfLines={2}>
                    {liveNoti.message}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  profileModalContainer: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 220
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  profileIconWrap: {
    marginRight: 14,
  },
  profileTextWrap: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8000FF',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f6',
    borderRadius: 14,
    marginBottom: 12,
    marginHorizontal: 2,
    padding: 10,
    shadowColor: '#8000FF',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  notiImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12
  },
  notiLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  notiLiveText: {
    color: '#e11d48',
    fontWeight: 'bold',
    marginRight: 8
  },
  notiTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222'
  },
  notiMessage: {
    color: '#444',
    fontSize: 13
  }
});