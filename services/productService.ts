// services/productService.ts
import { db } from '@/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

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

export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);

  console.log('Looking for product with id:', id);
  console.log('Doc exists:', docSnap.exists());

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Product;
  }

  return null;
};
