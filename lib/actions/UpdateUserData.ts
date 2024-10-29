"use server";

import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";

export async function updateUserData(profilePictureUrl: string, email: string) {
  const { db } = initializeFirebaseClient();
  const userCollectionRef = collection(db, "users");
  const que = query(userCollectionRef, where("email", "==", email));
  const querySnapShot = await getDocs(que);
  //   Firestore'da belirli bir dokümanı güncellemek için önce dokümanın id'sini almak gerekiyor.
  if (!querySnapShot.empty) {
    const userDoc = querySnapShot.docs[0];
    const userDocRef = doc(db, "users", userDoc.id); //Maille eşleşen userı bulup döküman id sini alma yeri.
    const currentProfilePicture = userDoc.data().profilePicture; // Mevcut profil resmini alıyoruz

    // Profil resmini güncelleme aşaması.
    await updateDoc(userDocRef, {
      profilePicture: profilePictureUrl,
    });
    return {
      success: true,
      previousProfilePicture: currentProfilePicture || null,
    };
  } else {
    console.error(
      "Mail ile eşleşen kullanıcı bulunamadı bu hata actions/UpdateUserData.ts gelmektedir."
    );
    return { success: false };
  }
}

export async function updateUserDocForVirtualAcademy(
  email: string,
  virtualAcademyId: string
) {
  const { db } = initializeFirebaseClient();
  const userCollectionRef = collection(db, "users");
  const que = query(userCollectionRef, where("email", "==", email));
  const querySnapShot = await getDocs(que);
  if (!querySnapShot.empty) {
    const userDoc = querySnapShot.docs[0];
    const userDocRef = doc(db, "users", userDoc.id);
    // Mevcut virtualAcademies değerini al
    const currentData = userDoc.data();
    const currentVirtualAcademies = currentData.virtualAcademies || [];
    await updateDoc(userDocRef, {
      virtualAcademies: [
        ...currentVirtualAcademies,
        {
          virtualAcademyId,
          role: "Rektor",
        },
      ],
    });

    return { success: true };
  } else {
    console.error(
      "Mail ile eşleşen kullanıcı bulunamadı bu hata actions/UpdateUserData.ts gelmektedir."
    );
    return { success: false };
  }
}
