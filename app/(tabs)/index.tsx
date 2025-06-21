import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-electric">
      <TouchableOpacity onPress={() => router.push("/product/1")}>
        <Text className="bg-red-500 text-white p-4 rounded">
          Edit app/index.tsx to edit this screen.
        </Text>
      </TouchableOpacity>
    </View>
  );
}
