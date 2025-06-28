import { useUserStore } from "@/store/userStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  estimatedDelivery?: string;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return {
        backgroundColor: '#ECFDF5',
        color: '#059669',
        borderColor: '#A7F3D0',
        icon: 'check-circle'
      };
    case 'shipped':
      return {
        backgroundColor: '#EFF6FF',
        color: '#2563EB',
        borderColor: '#BFDBFE',
        icon: 'local-shipping'
      };
    case 'processing':
      return {
        backgroundColor: '#FFFBEB',
        color: '#D97706',
        borderColor: '#FDE68A',
        icon: 'hourglass-empty'
      };
    case 'cancelled':
      return {
        backgroundColor: '#FEF2F2',
        color: '#DC2626',
        borderColor: '#FECACA',
        icon: 'cancel'
      };
    default:
      return {
        backgroundColor: '#F9FAFB',
        color: '#6B7280',
        borderColor: '#E5E7EB',
        icon: 'pending'
      };
  }
};

const Orders: React.FC = () => {
  const user = useUserStore((state) => state.user);

  const { items, justOrdered } = useLocalSearchParams();
  const parsedItems: OrderItem[] = items ? JSON.parse(items as string) : [];

  const [orders, setOrders] = useState<Order[]>([]);
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    landmark: '',
  });

  useEffect(() => {
    if (justOrdered === 'true' && parsedItems.length > 0) {
      const totalAmount = parsedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

      const newOrder: Order = {
        id: Date.now(),
        orderNumber: `ULC${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        total: totalAmount,
        items: parsedItems,
        estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
      };

      setOrders([newOrder]);
      setShowNewOrderAlert(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      Toast.show({
        type: 'success',
        text1: 'Order Placed Successfully! 🎉',
        text2: `Order ${newOrder.orderNumber}`,
        position: 'top',
        visibilityTime: 4000,
      });

      setTimeout(() => setShowNewOrderAlert(false), 8000);
    }
  }, [items, justOrdered]);

  const renderOrderItem = ({ item, index }: { item: Order; index: number }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <Animated.View
        style={[
          styles.orderCard,
          showNewOrderAlert && index === 0 && justOrdered === 'true' ? styles.newOrderCard : {},
          { opacity: showNewOrderAlert && index === 0 ? fadeAnim : 1 }
        ]}
      >
        {showNewOrderAlert && index === 0 && justOrdered === 'true' && (
          <View style={styles.newOrderBadge}>
            <MaterialIcons name="celebration" size={16} color="white" />
            <Text style={styles.newOrderText}>NEW ORDER</Text>
          </View>
        )}

        <View style={styles.orderHeader}>
          <View style={styles.orderMainInfo}>
            <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </Text>
          </View>

          <View style={[styles.statusContainer, { backgroundColor: statusConfig.backgroundColor, borderColor: statusConfig.borderColor }]}>
            <MaterialIcons name={statusConfig.icon as any} size={16} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {item.status}
            </Text>
          </View>
        </View>

        {item.estimatedDelivery && item.status !== 'delivered' && (
          <View style={styles.deliveryInfo}>
            <MaterialIcons name="schedule" size={16} color="#8B5CF6" />
            <Text style={styles.deliveryText}>
              Estimated delivery: {new Date(item.estimatedDelivery).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short'
              })}
            </Text>
          </View>
        )}

        <View style={styles.itemsPreview}>
          <Text style={styles.itemsTitle}>Items ({item.items.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsScroll}>
            {item.items.map((product) => (
              <View key={product.id} style={styles.itemPreview}>
                <Image
                  source={{ uri: `https://github.com/bpcancode/ulc-images/blob/main/${product.image}?raw=true` }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                <View style={styles.itemQuantityBadge}>
                  <Text style={styles.itemQuantityText}>{product.quantity}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{item.total.toLocaleString('en-IN')}</Text>
          </View>

          <TouchableOpacity style={styles.viewDetailsButton} >
            <Text style={styles.viewDetailsText}>View Details</Text>
            <MaterialIcons name="keyboard-arrow-right" size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const handleConfirmOrder = () => {
    const { name, phone, address, city } = userInfo;

    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Not Logged In',
        text2: 'Please log in to confirm your order',
        position: 'top',
      });
      router.push('/login');
      return;
    }

    if (!name || !phone || !address || !city) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill all required delivery details',
        position: 'top',
      });
      return;
    }

    const totalAmount = orders[0]?.total || 0; 

    const order = {
      userId: user.uid,
      userName: name,
      userPhone: phone,
      userAddress: address,
      userCity: city,
      order: orders,
    }

    router.push({
      pathname: '/(payments)/esewa',
      params: {
        price: totalAmount.toString(),
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="location-on" size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Delivery Information</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={userInfo.name}
                onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 XXXXX XXXXX"
                keyboardType="phone-pad"
                value={userInfo.phone}
                onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Complete Address *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="House/Flat no, Building, Street, Area"
                multiline
                numberOfLines={3}
                value={userInfo.address}
                onChangeText={(text) => setUserInfo({ ...userInfo, address: text })}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>City *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter city"
                  value={userInfo.city}
                  onChangeText={(text) => setUserInfo({ ...userInfo, city: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Landmark</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Optional"
                  value={userInfo.landmark}
                  onChangeText={(text) => setUserInfo({ ...userInfo, landmark: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Delivery Preview */}
          {(userInfo.name || userInfo.address) && (
            <View style={styles.deliveryPreview}>
              <View style={styles.deliveryPreviewHeader}>
                <MaterialIcons name="home" size={20} color="#8B5CF6" />
                <Text style={styles.deliveryPreviewTitle}>Delivery Address</Text>
              </View>
              <View style={styles.deliveryPreviewContent}>
                {userInfo.name && (
                  <Text style={styles.deliveryName}>{userInfo.name}</Text>
                )}
                {userInfo.phone && (
                  <Text style={styles.deliveryPhone}>{userInfo.phone}</Text>
                )}
                {userInfo.address && (
                  <Text style={styles.deliveryAddress}>
                    {userInfo.address}
                    {userInfo.landmark && `, ${userInfo.landmark}`}
                    {userInfo.city && `, ${userInfo.city}`}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Orders List */}
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialIcons name="shopping-bag" size={48} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>
              Your orders will appear here once you place them. Start shopping to see your order history.
            </Text>
            <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/')}>
              <Text style={styles.shopButtonText}>Start Shopping</Text>
              <MaterialIcons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="receipt-long" size={24} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Your Orders</Text>
            </View>

            <FlatList
              data={orders}
              renderItem={renderOrderItem}
              keyExtractor={(item: Order) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </ScrollView>

      {orders.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleConfirmOrder} >
              <MaterialIcons name="check-circle" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Confirm Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  deliveryPreview: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deliveryPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  deliveryPreviewContent: {
    paddingLeft: 28,
  },
  deliveryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  deliveryPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    backgroundColor: '#F9FAFB',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    maxWidth: 280,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  orderCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  newOrderCard: {
    borderColor: '#8B5CF6',
    borderWidth: 2,
    backgroundColor: '#FEFBFF',
  },
  newOrderBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  newOrderText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderMainInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  deliveryText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
    fontWeight: '500',
  },
  itemsPreview: {
    marginBottom: 20,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  itemsScroll: {
    flexDirection: 'row',
  },
  itemPreview: {
    marginRight: 12,
    position: 'relative',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  itemQuantityBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#8B5CF6',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemQuantityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginRight: 4,
  },
  bottomBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    marginTop: 16
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 6,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 6,
  },
});

export default Orders;