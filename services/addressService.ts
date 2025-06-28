import { ShippingAddress } from "@/types/ShippingAddress";
import { getAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";

const db = getFirestore();
const auth = getAuth();

export const saveShippingAddress = async (addressData: ShippingAddress) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const addressRef = collection(db, "users", user.uid, "addresses");
  const newAddress = await addDoc(addressRef, addressData);
  return newAddress.id;
};

export const deleteShippingAddress = async (addressId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const addressDocRef = doc(db, "users", user.uid, "addresses", addressId);
  await deleteDoc(addressDocRef);
};

export const getShippingAddresses = async (): Promise<(ShippingAddress & { id: string })[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const addressRef = collection(db, "users", user.uid, "addresses");
  const snapshot = await getDocs(addressRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (ShippingAddress & { id: string })[];
};



