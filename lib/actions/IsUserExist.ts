"use server";

import { collection, getDocs, query, where } from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";

export async function isUserExist(email: string) {
  const { db } = initializeFirebaseClient();
  const collectionRef = collection(db, "users");
  const que = query(collectionRef, where("email", "==", email));
  const querySnapShot = await getDocs(que);
  if (!querySnapShot.empty) {
    return { success: true };
  } else {
    return { success: false };
  }
}
