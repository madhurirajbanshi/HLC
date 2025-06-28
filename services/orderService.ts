import { Order } from "@/types/Order";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";

const db = getFirestore();
const auth = getAuth();

export const saveOrder = async (orderData: Order): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const orderRef = collection(db, "users", user.uid, "orders");
  const newOrder = await addDoc(orderRef, orderData);
  return newOrder.id;
};

export const getOrders = async (): Promise<(Order & { id: string })[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const orderRef = collection(db, "users", user.uid, "orders");
  const snapshot = await getDocs(orderRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (Order & { id: string })[];
};
