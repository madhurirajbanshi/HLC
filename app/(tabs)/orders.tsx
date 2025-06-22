import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return { backgroundColor: '#D1FAE5', color: '#059669' };
    case 'shipped':
      return { backgroundColor: '#DBEAFE', color: '#3B82F6' };
    case 'processing':
      return { backgroundColor: '#FEF3C7', color: '#D97706' };
    case 'cancelled':
      return { backgroundColor: '#FEE2E2', color: '#DC2626' };
    default:
      return { backgroundColor: '#E5E7EB', color: '#6B7280' };
  }
};

const Orders: React.FC = () => {
  const { name, price, quantity, image, justOrdered } = useLocalSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });

  useEffect(() => {
    if (
      justOrdered === 'true' &&
      name && price && quantity && image
    ) {
      const parsedPrice = parseInt(price as string, 10);
      const parsedQuantity = parseInt(quantity as string, 10);
      if (isNaN(parsedPrice) || isNaN(parsedQuantity)) return;

      const newOrder: Order = {
        id: Date.now(),
        orderNumber: `ORD-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        total: parsedPrice * parsedQuantity,
        items: [{
          id: Date.now(),
          name: name as string,
          price: parsedPrice,
          quantity: parsedQuantity,
          image: image as string,
        }],
      };

      setOrders([newOrder]);
      setShowNewOrderAlert(true);

      Toast.show({
        type: 'success',
        text1: 'Order Placed Successfully! 🎉',
        text2: `Order ${newOrder.orderNumber}`,
        position: 'top',
        visibilityTime: 4000,
      });

      setTimeout(() => setShowNewOrderAlert(false), 5000);
    }
  }, [name, price, quantity, image, justOrdered]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Address Form */}
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <Text style={styles.formLabel}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={userInfo.name}
          onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
        />
        <Text style={styles.formLabel}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={userInfo.phone}
          onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
        />
        <Text style={styles.formLabel}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full address"
          value={userInfo.address}
          onChangeText={(text) => setUserInfo({ ...userInfo, address: text })}
        />
        <Text style={styles.formLabel}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={userInfo.city}
          onChangeText={(text) => setUserInfo({ ...userInfo, city: text })}
        />
      </View>

      {/* Order list or empty state */}
      {orders.length === 0 ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyEmoji}>📦</Text>
            </View>
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>
              You haven't placed any orders yet. Start shopping to see your orders here.
            </Text>
            <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/')}>
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <>
          <FlatList
            data={orders}
            renderItem={({ item, index }) => (
              <View style={[
                styles.orderCard,
                showNewOrderAlert && index === 0 && justOrdered === 'true' ? styles.newOrderCard : {},
              ]}>
                {showNewOrderAlert && index === 0 && justOrdered === 'true' && (
                  <View style={styles.newOrderBadge}>
                    <Text style={styles.newOrderText}>🎉 NEW ORDER</Text>
                  </View>
                )}

                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                    <Text style={styles.orderDate}>
                      Ordered on {new Date(item.date).toLocaleDateString('en-IN')}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                    <Text style={[styles.statusText, { color: getStatusStyle(item.status).color }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemsContainer}>
                  {item.items.map((product) => (
                    <View key={product.id} style={styles.productItem}>
                      <Image
                        source={{ uri: `https://github.com/bpcancode/ulc-images/blob/main/${product.image}?raw=true` }}
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
                      </View>
                      <Text style={styles.productPrice}>₹{product.price.toLocaleString()}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>₹{item.total.toLocaleString()}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item: Order) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          {/* Place Order Button */}
          <View style={{ padding: 16 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#8B5CF6', paddingVertical: 14, borderRadius: 8 }}
              onPress={() => {
                Toast.show({
                  type: 'success',
                  text1: 'Your order has been placed!',
                  text2: `We'll deliver it to ${userInfo.address}, ${userInfo.city}`,
                });
                router.push('/');
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
                Place Order
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#1F2937' },
  formLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 14,
  },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 24 },
  emptyIcon: { width: 128, height: 128, backgroundColor: '#F3F4F6', borderRadius: 64, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emptyEmoji: { fontSize: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  shopButton: { backgroundColor: '#8B5CF6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  shopButtonText: { color: 'white', fontWeight: '500' },
  orderCard: {
    backgroundColor: 'white',
    margin: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newOrderCard: { borderColor: '#8B5CF6', borderWidth: 2, backgroundColor: '#FAF5FF' },
  newOrderBadge: { position: 'absolute', top: -8, right: 16, backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, zIndex: 1 },
  newOrderText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderInfo: { flex: 1 },
  orderNumber: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  orderDate: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '500' },
  itemsContainer: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  productItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  productImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '500', color: '#1F2937' },
  productQuantity: { fontSize: 12, color: '#6B7280' },
  productPrice: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  totalContainer: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14, color: '#6B7280' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#8B5CF6' },
});

export default Orders;
