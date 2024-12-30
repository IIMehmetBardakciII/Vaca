"use server";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";

export const approvedJoinRequest = async (
  userId: string,
  academyId: string
) => {
  // User Dök güncellenmeli;
  // VirtualAcademy Güncellenmeli Members yeri

  const { db } = initializeFirebaseClient();
  const userCollectionRef = collection(db, "users");
  const que = query(userCollectionRef, where("email", "==", userId));
  const querySnapShot = await getDocs(que);
  if (!querySnapShot.empty) {
    const userDoc = querySnapShot.docs[0];
    const userDocRef = doc(db, "users", userDoc.id); // userın döküman id si olmadan update işlemi olmaz.
    const currentVirtualAcademies = userDoc.data().virtualAcademies;
    await updateDoc(userDocRef, {
      virtualAcademies: [
        ...currentVirtualAcademies,
        { role: "Student", virtualAcademyId: academyId },
      ],
    });

    const virtualAcademiesDocRef = doc(db, "virtualAcademies", academyId);
    const docSnapShot = await getDoc(virtualAcademiesDocRef);

    if (docSnapShot.exists()) {
      const currentData = docSnapShot.data();
      // 1. Kullanıcıyı members alanına ekle
      // 2. joinRequests alanından ilgili isteği sil
      const joinRequests = currentData.joinRequests.filter(
        (request: any) => request.userId !== userId // Eşleşen userId ile ilgili isteği sil
      );
      await updateDoc(virtualAcademiesDocRef, {
        members: [
          ...currentData.members,
          {
            role: "Student",
            userId: userId,
          },
        ],
        joinRequests: joinRequests,
      });
    }
    return { success: true };
  }
  return { success: false };
};
export const rejectedJoinRequest = async (
  userId: string,
  academyId: string
) => {
  const { db } = initializeFirebaseClient();
  const virtualAcademiesDocRef = doc(db, "virtualAcademies", academyId);
  const docSnapShot = await getDoc(virtualAcademiesDocRef);

  if (docSnapShot.exists()) {
    const currentData = docSnapShot.data();
    // 1. Kullanıcıyı members alanına ekle
    // 2. joinRequests alanından ilgili isteği sil
    const joinRequests = currentData.joinRequests.filter(
      (request: any) => request.userId !== userId // Eşleşen userId ile ilgili isteği sil
    );
    await updateDoc(virtualAcademiesDocRef, {
      joinRequests: joinRequests,
    });
    return { success: true };
  }
  return { success: false };
};

export const getAllMembers = async (academyId: string) => {
  const { db } = initializeFirebaseClient();
  const virtualAcademiesDocRef = doc(db, "virtualAcademies", academyId);
  const docSnapShot = await getDoc(virtualAcademiesDocRef);
  if (docSnapShot.exists()) {
    const currentData = docSnapShot.data();
    return currentData.members || [];
  } else {
    throw new Error("Users not found");
  }
};
