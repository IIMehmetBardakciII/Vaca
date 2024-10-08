"use server";

import { collection, getDocs, query, where } from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";

export async function getUserData(email: string) {
  const { db } = initializeFirebaseClient();
  const userCollectionRef = collection(db, "users");
  const que = query(userCollectionRef, where("email", "==", email));
  const querySnapShot = await getDocs(que);
  if (!querySnapShot.empty) {
    const userData = querySnapShot.docs[0].data();
    return {
      email: userData.email,
      username: userData.username,
      profilePicture: userData.profilePicture,
      virtualAcademies: userData.virtualAcademies,
    };
  } else {
    throw new Error(
      "User not found, this error from actions/UserData.ts in getUserData Function"
    );
  }
}
