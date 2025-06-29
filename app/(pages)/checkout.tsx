import React, { useState, useEffect } from "react";
import useCart from "@/hooks/useCart";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Address = {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  region: string;
  landmark: string;
  addressCategory: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
};

type DeliveryOption = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
};

const Checkout = () => {
  const { cartItems: orderItems, clearCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressSelectionModalVisible, setAddressSelectionModalVisible] = useState(false);
  const [addressFormModalVisible, setAddressFormModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<string>("standard");
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    region: "",
    landmark: "",
    addressCategory: "Home",
    isDefaultShipping: true,
    isDefaultBilling: true,
  });

  const deliveryOptions: DeliveryOption[] = [
    {
      id: "standard",
      title: "Standard Delivery",
      subtitle: "5-7 business days",
      price: 0,
      duration: "5-7 days"
    },
    {
      id: "express",
      title: "Express Delivery",
      subtitle: "2-3 business days",
      price: 100,
      duration: "2-3 days"
    },
    {
      id: "overnight",
      title: "Overnight Delivery",
      subtitle: "Next business day",
      price: 250,
      duration: "1 day"
    }
  ];

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const formatPrice = (price: number) => `Rs.${price.toLocaleString()}`;

  const getSubtotal = () => orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const getDeliveryFee = () => {
    const selected = deliveryOptions.find(option => option.id === selectedDeliveryOption);
    return selected ? selected.price : 0;
  };
  const getTotalAmount = () => getSubtotal() + getDeliveryFee();

  const selectedDelivery = deliveryOptions.find(option => option.id === selectedDeliveryOption);

  if (orderItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 px-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm items-center">
          <View className="bg-purple-100 rounded-full p-4 mb-4">
            <Ionicons name="cart-outline" size={40} color="#3b82f6" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            Your cart is empty
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-6">
            Add some products to get started
          </Text>
          <TouchableOpacity
            className="bg-purple-600 px-6 py-3 rounded-xl shadow-sm w-full"
            onPress={() => router.push("/")}
          >
            <Text className="text-white font-semibold text-sm text-center">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSaveAddress = () => {
    if (
      !newAddress.name ||
      !newAddress.street ||
      !newAddress.phone ||
      !newAddress.region
    ) {
      Alert.alert("Incomplete Information", "Please fill all required fields to continue");
      return;
    }

    if (editingAddress) {
      // Update existing address
      const updatedAddress = { 
        ...editingAddress, 
        ...newAddress 
      };
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? updatedAddress : addr
      ));
      setSelectedAddressId(editingAddress.id);
    } else {
      // Add new address
      const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
      const addressToAdd = { 
        id: newId, 
        ...newAddress 
      };
      setAddresses([...addresses, addressToAdd]);
      setSelectedAddressId(newId);
    }

    // Reset form
    setNewAddress({
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      region: "",
      landmark: "",
      addressCategory: "Home",
      isDefaultShipping: true,
      isDefaultBilling: true,
    });
    setEditingAddress(null);
    setAddressFormModalVisible(false); // Close the form modal immediately
    setTimeout(() => {
      setAddressSelectionModalVisible(true); // Open select address modal after save
    }, 200);
  };

  const handleSelectDeliveryOption = (optionId: string) => {
    setSelectedDeliveryOption(optionId);
    setDeliveryModalVisible(false);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      Alert.alert("Address Required", "Please select a shipping address to continue");
      return;
    }
    const orderData = orderItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));
    Alert.alert("Success!", "Your order has been placed successfully!");
    clearCart();
    router.push({
      pathname: "/orders",
      params: {
        items: JSON.stringify(orderData),
        justOrdered: "true",
        deliveryOption: selectedDeliveryOption,
        deliveryFee: getDeliveryFee().toString(),
        subtotal: getSubtotal().toString(),
        total: getTotalAmount().toString(),
        shippingAddress: JSON.stringify(selectedAddress || {})
      }
    });
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const openAddressForm = (address: Address | null) => {
    if (address) {
      // Load existing address data for editing
      setNewAddress({
        name: address.name || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || "",
        phone: address.phone || "",
        region: address.region || "",
        landmark: address.landmark || "",
        addressCategory: address.addressCategory || "Home",
        isDefaultShipping: address.isDefaultShipping ?? true,
        isDefaultBilling: address.isDefaultBilling ?? true,
      });
      setEditingAddress(address);
    } else {
      // Reset form for new address
      setNewAddress({
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        region: "",
        landmark: "",
        addressCategory: "Home",
        isDefaultShipping: true,
        isDefaultBilling: true,
      });
      setEditingAddress(null);
    }
    
    // Close address selection modal and open form modal
    setAddressSelectionModalVisible(false);
    setTimeout(() => {
      setAddressFormModalVisible(true);
    }, 100);
  };

  const handleDeleteAddress = () => {
    if (editingAddress) {
      Alert.alert(
        "Delete Address",
        "Are you sure you want to delete this address?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              setAddresses(addresses.filter(addr => addr.id !== editingAddress.id));
              if (selectedAddressId === editingAddress.id) {
                setSelectedAddressId(null);
              }
              setAddressFormModalVisible(false);
              setTimeout(() => {
                setAddressSelectionModalVisible(true);
              }, 100);
            }
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <TouchableOpacity
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-row items-center"
            onPress={() => setAddressSelectionModalVisible(true)}
          >
            <Ionicons name="location-sharp" size={28} color="#3b82f6" />
            <View className="ml-3 flex-1">
              {selectedAddress ? (
                <>
                  <Text className="font-semibold text-gray-900">{selectedAddress.name} <Text className="text-xs text-gray-500">{selectedAddress.phone}</Text></Text>
                  <Text className="text-xs text-gray-500">{selectedAddress.street}, {selectedAddress.region}</Text>
                </>
              ) : (
                <Text className="text-gray-500">Add a shipping address</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-4">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Order Items</Text>
          {orderItems.map((item) => (
            <View key={item.id} className="bg-white rounded-xl p-3 mb-2 shadow-sm border border-gray-100 flex-row items-center">
              <Image
                source={{
                  uri: `https://github.com/bpcancode/ulc-images/blob/main/${item.image}?raw=true`,
                }}
                className="w-12 h-12 rounded-md bg-gray-50"
                resizeMode="contain"
              />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold text-gray-900 mb-1" numberOfLines={2}>
                  {item.name}
                </Text>
                <Text className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</Text>
                <Text className="text-sm font-bold text-purple-600">
                  {formatPrice(item.price)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-sm font-bold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            className="bg-white rounded-xl p-3 mb-2 shadow-sm border border-gray-100"
            onPress={() => setDeliveryModalVisible(true)}
          >
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-semibold text-gray-900">Delivery Option</Text>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-gray-600">{selectedDelivery?.title}</Text>
              <Text className="text-xs text-gray-600">
                {selectedDelivery?.price === 0 ? 'Free' : formatPrice(selectedDelivery?.price || 0)}
              </Text>
            </View>
            <Text className="text-xs text-gray-400 mt-1">{selectedDelivery?.subtitle}</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-4">
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-semibold text-gray-900">Total:</Text>
              <Text className="text-sm font-bold text-purple-600">{formatPrice(getTotalAmount())}</Text>
            </View>
            <Text className="text-xs text-gray-400">All taxes included</Text>
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>

      <View className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <TouchableOpacity
          onPress={handlePlaceOrder}
          className="bg-purple-600 py-3 rounded-xl items-center shadow-sm"
        >
          <Text className="text-white text-base">
            Place Order
          </Text>
        </TouchableOpacity>
      </View>

      {/* Address Selection Modal */}
      <Modal
        visible={addressSelectionModalVisible}
        animationType="slide"
        onRequestClose={() => setAddressSelectionModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
            <Text className="text-lg font-bold text-gray-900">Select Shipping Address</Text>
            <TouchableOpacity onPress={() => setAddressSelectionModalVisible(false)} className="p-1">
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <View className="px-4 py-4">
            <TouchableOpacity
              className="flex-row items-center justify-center mb-4"
              onPress={() => openAddressForm(null)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#2563eb" />
              <Text className="ml-2 text-purple-600 text-lg">Add Address</Text>
            </TouchableOpacity>
            {addresses.length === 0 && (
              <Text className="text-center text-gray-400 mt-10">No addresses added yet.</Text>
            )}
            {addresses.map((address) => (
              <View key={address.id} className={`p-4 mb-3 border rounded-lg ${selectedAddressId === address.id ? "border-purple-600 bg-purple-100" : "border-gray-300"}`}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedAddressId(address.id);
                    setAddressSelectionModalVisible(false);
                  }}
                >
                  <Text className="font-semibold">{address.name}</Text>
                  <Text>{address.street}</Text>
                  <Text>{address.region}</Text>
                  <Text>Phone: {address.phone}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="absolute top-2 right-2"
                  onPress={() => openAddressForm(address)}
                >
                  <Ionicons name="create-outline" size={20} color="#2563eb" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Address Form Modal */}
      <Modal
        visible={addressFormModalVisible}
        animationType="slide"
        onRequestClose={() => setAddressFormModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
            <TouchableOpacity
              onPress={() => {
                setAddressFormModalVisible(false);
                setTimeout(() => {
                  setAddressSelectionModalVisible(true);
                }, 100);
              }}
              className="p-1"
            >
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900">
              {editingAddress ? "Edit Shipping Address" : "Add Shipping Address"}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <ScrollView className="flex-1 px-4 py-4">
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Recipient's Name <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="relative">
                    <TextInput
                      placeholder="Enter recipient's name"
                      className="border border-gray-300 rounded-lg p-3 pr-10 text-sm text-gray-900 bg-white"
                      value={newAddress.name}
                      onChangeText={(text) =>
                        setNewAddress((prev) => ({ ...prev, name: text }))
                      }
                      placeholderTextColor="#9ca3af"
                    />
                    <View className="absolute right-3 top-3">
                      <Ionicons name="person-outline" size={20} color="#9ca3af" />
                    </View>
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Phone Number <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    className="border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white"
                    value={newAddress.phone}
                    onChangeText={(text) =>
                      setNewAddress((prev) => ({ ...prev, phone: text }))
                    }
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Region <Text className="text-purple-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="Province/City/Area"
                    className="border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white"
                    value={newAddress.region}
                    onChangeText={(text) => setNewAddress((prev) => ({ ...prev, region: text }))}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Address <Text className="text-purple-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="Street address"
                    className="border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white"
                    value={newAddress.street}
                    onChangeText={(text) =>
                      setNewAddress((prev) => ({ ...prev, street: text }))
                    }
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Landmark (Optional)
                  </Text>
                  <TextInput
                    placeholder="Add Additional Info"
                    className="border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white"
                    value={newAddress.landmark}
                    onChangeText={(text) =>
                      setNewAddress((prev) => ({ ...prev, landmark: text }))
                    }
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-3">
                    Address Category
                  </Text>
                  <View className="flex-row space-x-6">
                    <TouchableOpacity
                      onPress={() => setNewAddress(prev => ({ ...prev, addressCategory: "Home" }))}
                      className="flex-row items-center"
                    >
                      <View className={`w-5 h-5 rounded-full border-2 mr-2 ${
                        newAddress.addressCategory === "Home"
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {newAddress.addressCategory === "Home" && (
                          <View className="w-full h-full rounded-full bg-purple-500 flex items-center justify-center">
                            <View className="w-2 h-2 rounded-full bg-white" />
                          </View>
                        )}
                      </View>
                      <Text className="text-sm text-gray-700">Home</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => setNewAddress(prev => ({ ...prev, addressCategory: "Office" }))}
                      className="flex-row items-center"
                    >
                      <View className={`w-5 h-5 rounded-full border-2 mr-2 ${
                        newAddress.addressCategory === "Office"
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {newAddress.addressCategory === "Office" && (
                          <View className="w-full h-full rounded-full bg-purple-500 flex items-center justify-center">
                            <View className="w-2 h-2 rounded-full bg-white" />
                          </View>
                        )}
                      </View>
                      <Text className="text-sm text-gray-700">Office</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {editingAddress && (
                  <TouchableOpacity 
                    className="border border-red-300 rounded-lg p-3 items-center mt-4"
                    onPress={handleDeleteAddress}
                  >
                    <Text className="text-red-600 font-medium">Delete Address</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="mt-6">
                <TouchableOpacity
                  onPress={handleSaveAddress}
                  className="bg-purple-500 px-4 py-3 rounded-lg shadow-sm"
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    Save Address
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Delivery Options Modal */}
      <Modal
        visible={deliveryModalVisible}
        animationType="slide"
        onRequestClose={() => setDeliveryModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
            <Text className="text-lg font-bold text-gray-900">
              Delivery Options
            </Text>
            <TouchableOpacity
              onPress={() => setDeliveryModalVisible(false)}
              className="bg-gray-100 rounded-full p-2"
            >
              <Ionicons name="close" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-4 py-4">
            <View className="space-y-3">
              {deliveryOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleSelectDeliveryOption(option.id)}
                  className={`border rounded-xl p-4 ${
                    selectedDeliveryOption === option.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
                        selectedDeliveryOption === option.id
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedDeliveryOption === option.id && (
                          <View className="w-full h-full rounded-full bg-purple-500 flex items-center justify-center">
                            <View className="w-2 h-2 rounded-full bg-white" />
                          </View>
                        )}
                      </View>
                      <View>
                        <Text className={`font-semibold ${
                          selectedDeliveryOption === option.id ? 'text-purple-900' : 'text-gray-900'
                        }`}>
                          {option.title}
                        </Text>
                        <Text className={`text-sm ${
                          selectedDeliveryOption === option.id ? 'text-purple-700' : 'text-gray-600'
                        }`}>
                          {option.subtitle}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className={`font-bold ${
                        selectedDeliveryOption === option.id ? 'text-purple-900' : 'text-gray-900'
                      }`}>
                        {option.price === 0 ? 'Free' : formatPrice(option.price)}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <Ionicons 
                      name="time-outline" 
                      size={16} 
                      color={selectedDeliveryOption === option.id ? '#3b82f6' : '#9ca3af'} 
                    />
                    <Text className={`text-xs ml-1 ${
                      selectedDeliveryOption === option.id ? 'text-purple-700' : 'text-gray-500'
                    }`}>
                      Delivery in {option.duration}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View className="mt-6">
              <TouchableOpacity
                onPress={() => setDeliveryModalVisible(false)}
                className="bg-purple-600 px-4 py-3 rounded-lg shadow-sm"
              >
                <Text className="text-white text-center font-semibold">
                  Confirm Selection
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Checkout;