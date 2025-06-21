import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

const Product = () => {

 const { id } = useLocalSearchParams();

  return (
    <View className='flex-1 justify-center items-center bg-electric'>
        {<Text className='text-white text-2xl'>Product: {id}</Text>}
    </View>
  )
}

export default Product