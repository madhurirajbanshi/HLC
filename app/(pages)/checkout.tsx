import useCart from "@/hooks/useCart";
import { deleteShippingAddress, getShippingAddresses, saveShippingAddress } from "@/services/addressService";
import { saveOrder } from "@/services/orderService";
import type { Order, OrderStatus, PaymentMethod } from "@/types/Order";
import { ShippingAddress } from "@/types/ShippingAddress";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native";

import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const Checkout = () => {
    const { cartItems: orderItems, clearCart } = useCart();

    const [addresses, setAddresses] = useState<(ShippingAddress & { id: string })[]>([]);

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [addressSelectionModalVisible, setAddressSelectionModalVisible] = useState(false);
    const [addressFormModalVisible, setAddressFormModalVisible] = useState(false);
    const [addingAddress, setAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState<ShippingAddress>({
        recipientName: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        phoneNumber: "",
        category: "Home",
        createdAt: new Date(),
    });
    const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
    const [placingOrder, setPlacingOrder] = useState(false);

    useEffect(() => {
        fetchAddresses();

    }, []);

    const fetchAddresses = async () => {
        const result = await getShippingAddresses();
        setAddresses(result);
        setSelectedAddressId(result[0].id);
    };

    const formatPrice = (price: number) => `Rs.${price.toLocaleString()}`;
    const getTotalAmount = () => orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
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

    const handleSaveAddress = async () => {

        if (
            !newAddress.recipientName ||
            !newAddress.street ||
            !newAddress.phoneNumber ||
            !newAddress.category
        ) {
            Alert.alert("Incomplete Information", "Please fill all required fields to continue");
            return;
        }
        try {
            const addressData: ShippingAddress = {
                recipientName: newAddress.recipientName,
                phoneNumber: newAddress.phoneNumber,
                state: newAddress.state,
                city: newAddress.city,
                street: newAddress.street,
                zip: newAddress.zip,
                category: "Home",
                createdAt: new Date()
            };
            await saveShippingAddress(addressData);
            await fetchAddresses();

            setAddingAddress(false);
            setAddressFormModalVisible(false);
        } catch (err) {
            if (err instanceof Error) {
                console.error("Failed to delete address:", err.message);
            } else {
                console.error("Unknown error occurred:", err);
            }
            setNewAddress({
                recipientName: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                phoneNumber: "",
                category: "Home",
                createdAt: new Date(),
            });
        }
    };

    const handleDeleteAddress = async (addressId: string) => {

        if (addresses.length === 1) {
            Alert.alert("Cannot Delete", "You must have at least one shipping address.");
            return;
        }

        try {
            await deleteShippingAddress(addressId);
            fetchAddresses();
        } catch (err) {
            Alert.alert("Error", "Failed to delete address.");
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            Alert.alert("Address Required", "Please select a shipping address to continue");
            return;
        }
        setPlacingOrder(true);
        const orderData = {
            items: orderItems,
            shippingAddress: selectedAddress,
            orderStatus: "pending" as OrderStatus,
            paymentMethod: paymentMethod as PaymentMethod,
            totalAmount: orderItems.reduce((total, item) => total + item.price * item.quantity, 0),
            orderedAt: new Date().toISOString(),
        };
        try {
            await saveOrder(orderData);
        } catch (err) {
            if (err instanceof Error) {
                console.error("Failed to save order:", err.message);
            } else {
                console.error("Unknown error occurred while saving order:", err);
            }
            Alert.alert("Error", "Failed to place order. Please try again later.");
            return;
        } finally {
            setPlacingOrder(false);
        }
        sendOrderEmail(orderData);
        Alert.alert("Success!", "Your order has been placed successfully!");
        clearCart();
        router.push('/orders');
    };

    const sendOrderEmail = async (orderData: Order) => {
        const url = process.env.EXPO_PUBLIC_EMAIL_REQUEST_ENDPOINT || '';
        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
        } catch (err) {
            console.error('Failed to send order:', err);
        }
    };

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);

    const openAddressForm = (address: ShippingAddress | null) => {
        if (address) {
            setNewAddress({
                recipientName: address.recipientName,
                street: address.street || '',
                city: address.city,
                state: address.state,
                zip: address.zip,
                phoneNumber: address.phoneNumber,
                category: newAddress.category,
                createdAt: address.createdAt,
            });
        }
        else {
            setNewAddress({
                recipientName: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                phoneNumber: "",
                category: "Home",
                createdAt: new Date(),
            });
        }
        setAddressFormModalVisible(true);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Loader Modal */}
            <Modal visible={placingOrder} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', padding: 32, borderRadius: 16, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#8B5CF6" />
                        <Text style={{ marginTop: 16, fontSize: 16, color: '#333', fontWeight: 'bold' }}>Placing your order...</Text>
                    </View>
                </View>
            </Modal>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 pt-4  ">
                    <TouchableOpacity
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-row items-center"
                        onPress={() => setAddressSelectionModalVisible(true)}
                    >
                        <Ionicons name="location-sharp" size={28} color="#3b82f6" />
                        <View className="ml-3 flex-1">
                            {selectedAddress ? (
                                <>
                                    <Text className="font-semibold text-gray-900">{selectedAddress.recipientName} <Text className="text-xs text-gray-500">{selectedAddress.phoneNumber}</Text></Text>
                                    <Text className="text-xs text-gray-500">{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}</Text>
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
                    <Text className="text-white  text-base">
                        Place Order
                    </Text>
                </TouchableOpacity>
            </View>

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
                            <Text className="ml-2 text-purple-600  text-lg">Add Address</Text>
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
                                    <Text className="font-semibold">{address.recipientName}</Text>
                                    <Text>{address.street}</Text>
                                    <Text>{address.city}, {address.state} - {address.zip}</Text>
                                    <Text>Phone: {address.phoneNumber}</Text>
                                </TouchableOpacity>
                                <View style={{ position: 'absolute', top: 8, right: 8, flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={() => openAddressForm(address)}
                                        style={{ marginRight: 12 }}
                                    >
                                        <Ionicons name="create-outline" size={20} color="#2563eb" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteAddress(address.id)}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </SafeAreaView>
            </Modal>

            <Modal
                visible={addressFormModalVisible}
                animationType="slide"
                onRequestClose={() => setAddressFormModalVisible(false)}
            >
                <SafeAreaView className="flex-1 bg-gray-50">
                    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
                        <TouchableOpacity
                            onPress={() => setAddressFormModalVisible(false)}
                            className="p-1"
                        >
                            <Ionicons name="chevron-back" size={24} color="#374151" />
                        </TouchableOpacity>
                        <Text className="text-lg font-bold text-gray-900">
                            Add Shipping Address
                        </Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        className="flex-1"
                    >
                        <ScrollView className="flex-1 px-4 py-4">
                            <View>
                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Recipient's Name <Text className="text-red-500">*</Text>
                                    </Text>
                                    <View className="relative">
                                        <TextInput
                                            placeholder=""
                                            className="border border-gray-300 rounded-lg p-3 pr-10 text-sm text-gray-900 bg-white"
                                            value={newAddress.recipientName}
                                            onChangeText={(text) =>
                                                setNewAddress((prev) => ({ ...prev, recipientName: text }))
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
                                        placeholder=""
                                        keyboardType="phone-pad"
                                        className="border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white"
                                        value={newAddress.phoneNumber}
                                        onChangeText={(text) =>
                                            setNewAddress((prev) => ({ ...prev, phoneNumber: text }))
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
                                        value={newAddress.state}
                                        onChangeText={(text) => setNewAddress((prev) => ({ ...prev, state: text }))}
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>

                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Address <Text className="text-purple-500">*</Text>
                                    </Text>
                                    <TextInput
                                        placeholder="Bhadrapur"
                                        className="border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white"
                                        value={newAddress.street}
                                        onChangeText={(text) =>
                                            setNewAddress((prev) => ({ ...prev, street: text }))
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
                                            <View className={`w-5 h-5 rounded-full border-2 mr-2 ${newAddress.category === "Home"
                                                ? 'border-purple-500 bg-purple-500'
                                                : 'border-gray-300'
                                                }`}>
                                                {newAddress.category === "Home" && (
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
                                            <View className={`w-5 h-5 rounded-full border-2 mr-2 ${newAddress.category === "Office"
                                                ? 'border-purple-500 bg-purple-500'
                                                : 'border-gray-300'
                                                }`}>
                                                {newAddress.category === "Office" && (
                                                    <View className="w-full h-full rounded-full bg-purple-500 flex items-center justify-center">
                                                        <View className="w-2 h-2 rounded-full bg-white" />
                                                    </View>
                                                )}
                                            </View>
                                            <Text className="text-sm text-gray-700">Office</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity className="border border-gray-300 rounded-lg p-3 items-center mt-4">
                                    <Text className="text-gray-600 font-medium">Delete Address</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="mt-6">
                                <TouchableOpacity
                                    onPress={handleSaveAddress}
                                    className="bg-purple-500 px-4 py-3 rounded-lg shadow-sm"
                                >
                                    <Text className="text-white text-center font-semibold text-lg">
                                        Save
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

export default Checkout;