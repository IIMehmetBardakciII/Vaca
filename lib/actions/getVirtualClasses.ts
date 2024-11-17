"use server";

import { doc, getDoc, Timestamp } from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";

type VirtualClass = {
  id: string;
  description: string;
  startsAt: Timestamp | Date; // Firestore'dan gelen veriler Timestamp formatında olabilir
};
export async function getVirtualClasses(virtualAcademyId: string) {
  const { db } = initializeFirebaseClient();

  const virtualAcademyDocRef = doc(db, "virtualAcademies", virtualAcademyId);

  try {
    const docSnapShot = await getDoc(virtualAcademyDocRef);
    if (docSnapShot.exists()) {
      const data = docSnapShot.data();
      const virtualClasses = data.virtualClass || [];

      return virtualClasses.map((virtualClass: VirtualClass) => ({
        id: virtualClass.id,
        description: virtualClass.description,
        startsAt:
          virtualClass.startsAt instanceof Timestamp
            ? virtualClass.startsAt.toDate()
            : virtualClass.startsAt, // Eğer Firestore Timestamp formatındaysa Date'e çevir
      }));
    } else {
      console.error("Döküman bulunamadı.");
      return [];
    }
  } catch (error) {
    console.error("Hata oluştu:", error);
    throw new Error("getVirtualClasses fonksiyonunda bir hata oluştu.");
  }
}