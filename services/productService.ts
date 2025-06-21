// services/productService.ts
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, 'products'));

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      price: data.price,
      image: data.image,
      details: data.details
    };
  });
};
