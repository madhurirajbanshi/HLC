import useCart from "@/hooks/useCart";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const Checkout = () => {

    const { cartItems: orderItmes, loading } = useCart();

    const formatPrice = (price: number) => {
        return `Rs.${price.toLocaleString()}`;
    };

    if (orderItmes.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Ionicons name="cart-outline" size={80} color="#9ca3af" />
        <Text className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          Your cart is empty
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          Add some products to get started
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-8 py-3 rounded-xl"
          onPress={() => router.push('/')}
        >
          <Text className="text-white font-semibold text-lg">
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Items</Text>
        </View>
        <Text className="text-gray-500 mt-1">
          {orderItmes.length} {orderItmes.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          {orderItmes.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
            >
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: `https://github.com/bpcancode/ulc-images/blob/main/${item.image}?raw=true`,
                  }}
                  className="w-20 h-20 rounded-xl bg-gray-100"
                  resizeMode="contain"
                />

                <View className="flex-1 ml-4">
                  <Text
                    className="text-lg font-semibold text-gray-900 mb-1"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xl font-bold text-blue-600 mb-3">
                    {formatPrice(item.price)}
                  </Text>

                  {/* <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="bg-gray-200 w-8 h-8 items-center justify-center rounded-lg"
                      >
                        <Text className="text-lg font-bold text-gray-700">−</Text>
                      </TouchableOpacity>

                      <Text className="text-lg font-semibold mx-4 min-w-[30px] text-center">
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="bg-gray-200 w-8 h-8 items-center justify-center rounded-lg"
                      >
                        <Text className="text-lg font-bold text-gray-700">+</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.id, item.name)}
                      className="p-2"
                    >
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View> */}
                </View>
              </View>

              <View className="border-t border-gray-100 mt-4 pt-3">
                <Text className="text-right text-lg  text-gray-900">
                  Subtotal: {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="h-32" />
      </ScrollView>

     
{/* <View className="bg-white border-t border-gray-100 px-4 py-8 mt-10 flex-row items-center justify-between">
  <Pressable
    onPress={toggleSelectAll}
    className="flex-row items-center"
    hitSlop={10}
  >
    <View className="w-6 h-6 border border-gray-400 rounded-md items-center justify-center mr-2">
      {allChecked && <Ionicons name="checkmark" size={20} color="#2563eb" />}
    </View>
    <Text className="text-lg font-semibold text-gray-900">All</Text>
  </Pressable>

  <Text className="text-lg font-bold text-gray-900">
    Subtotal: {formatPrice(
      orderItmes
        .filter(item => checkedItems[item.id])
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
    )}
  </Text>

  <TouchableOpacity
    onPress={handleCheckout}
    className="bg-electric px-5 py-2 rounded-xl flex-row items-center"
    disabled={cartItems.filter(item => checkedItems[item.id]).length === 0}
    style={{
      opacity:
        cartItems.filter(item => checkedItems[item.id]).length === 0
          ? 0.5
          : 1,
    }}
  >
    <Ionicons name="card-outline" size={20} color="white" />
    <Text className="text-white font-bold text-lg ml-2">Checkout</Text>
  </TouchableOpacity>
</View> */}

    </SafeAreaView>
  );
}

export default Checkout
