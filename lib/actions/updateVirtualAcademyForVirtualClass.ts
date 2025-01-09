"use server";

import {
  arrayUnion,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";

export async function updateVirtualAcademyDocForVirtualClass(
  virtualAcademyId: string,
  callId: string,
  description: string,
  startsAt?: string
) {
  const { db } = initializeFirebaseClient();
  const academyCollectionRef = doc(db, "virtualAcademies", virtualAcademyId);

  try {
    const docSnapShot = await getDoc(academyCollectionRef);

    if (docSnapShot.exists()) {
      await updateDoc(academyCollectionRef, {
        virtualClass: arrayUnion({
          id: callId,
          description: description,
          startsAt: startsAt
            ? Timestamp.fromDate(new Date(startsAt))
            : Timestamp.now(), // Burada Timestamp'a dönüştürüyoruz
        }),
      });
    }
  } catch (error) {
    console.error("Hata:", error);
    throw new Error(
      "updateVirtualAcademyForVirtualClass.ts adlı  dosyadan gelen hata"
    );
  }
}

export async function deleteClass(virtualAcademyId: string, callId: string) {
  const { db } = initializeFirebaseClient();
  const academyCollectionRef = doc(db, "virtualAcademies", virtualAcademyId);

  try {
    const docSnapShot = await getDoc(academyCollectionRef);
    if (docSnapShot.exists()) {
      const data = docSnapShot.data();
      const virtualClassArray = data.virtualClass || [];

      // Filter yolu ile eşleşen callId yi bulma.
      const updatedVirtualClassArray = virtualClassArray.filter(
        (classItem: { id: string }) => classItem.id !== callId
      );

      await updateDoc(academyCollectionRef, {
        virtualClass: updatedVirtualClassArray,
      });
      console.log("Sınıf başarıyla silindi.");
    } else {
      console.log("Döküman bulunamadı");
    }
  } catch (error) {
    console.error("Hata oluştu", error);
    throw new Error("deleteClass fonksiyonunda bir hata oluştu");
  }
}
