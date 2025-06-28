import { useUserStore } from "@/store/userStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const getDeliveryOptionTitle = (option: string) => {
  switch (option) {
    case 'express':
      return 'Express Delivery (2-3 days)';
    case 'overnight':
      return 'Overnight Delivery (1 day)';
    default:
      return 'Standard Delivery (5-7 days)';
  }
};

const Orders: React.FC = () => {
  const { 
    items, 
    deliveryOption, 
    deliveryFee, 
    subtotal, 
    total,
    shippingAddress 
  } = useLocalSearchParams();
  const parsedItems: OrderItem[] = items ? JSON.parse(items as string) : [];
  const parsedAddress = shippingAddress ? JSON.parse(shippingAddress as string) : null;

  // Render a single order card with delivery info and items
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Shipping Address */}
        {parsedAddress && (
          <View style={styles.addressSection}>
            <View style={styles.addressHeader}>
              <MaterialIcons name="location-on" size={18} color="#8B5CF6" />
              <Text style={styles.addressTitle}>Shipping Address</Text>
            </View>
            <View style={styles.addressContent}>
              <Text style={styles.addressName}>{parsedAddress.name}</Text>
              <Text style={styles.addressText}>{parsedAddress.street}{parsedAddress.city ? `, ${parsedAddress.city}` : ''}</Text>
              <Text style={styles.addressPhone}>📱 {parsedAddress.phone}</Text>
            </View>
          </View>
        )}

        {/* Delivery Information */}
        <View style={styles.deliverySection}>
          <View style={styles.deliveryHeader}>
            <MaterialIcons name="local-shipping" size={18} color="#8B5CF6" />
            <Text style={styles.deliveryTitle}>Delivery Information</Text>
          </View>
          <View style={styles.deliveryContent}>
            <Text style={styles.deliveryOption}>{getDeliveryOptionTitle(deliveryOption as string)}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.itemsSection}>
          <Text style={styles.itemsTitle}>Items ({parsedItems.length})</Text>
          {parsedItems.map((product) => (
            <View key={product.id} style={styles.itemRow}>
              <Image
                source={{ uri: `https://github.com/bpcancode/ulc-images/blob/main/${product.image}?raw=true` }}
                style={styles.itemImage}
                resizeMode="contain"
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {product.quantity}</Text>
                <Text style={styles.itemPrice}>₹{product.price.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.itemTotal}>
                <Text style={styles.itemTotalPrice}>
                  ₹{(product.price * product.quantity).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{Number(subtotal || 0).toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>
              {Number(deliveryFee) === 0 ? 'Free' : `₹${Number(deliveryFee || 0).toLocaleString('en-IN')}`}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{Number(total || 0).toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </ScrollView>
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
  ordersList: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 80,
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
  addressSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  addressContent: {
    marginLeft: 24,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  deliverySection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  deliveryContent: {
    marginLeft: 24,
  },
  deliveryOption: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  deliveryDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  itemsSection: {
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  itemTotalPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  orderSummary: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  trackOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  trackOrderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginLeft: 6,
  },
});