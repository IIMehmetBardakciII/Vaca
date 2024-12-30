"use server";

import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";
import { handleGetUserDoc } from "./UserData";

export async function handleLeaveTheAcademy(
  academyId: string,
  role: string,
  userId: string
): Promise<boolean> {
  // Boolean döndürdüğünden emin olun
  if (role === "Rektor") {
    const result = await removeTheAcademy(academyId);
    return result; // İşlem başarılıysa true döndürün
  } else if (role === "Student" || role === "Educator") {
    const result = await leaveTheAcademy(academyId, userId);
    return result; // İşlem başarılıysa true döndürün
  }
  return false; // Eğer bir şey yapılmazsa false döndürün
}

//* 1-VirtualAcademyId ile eşleşen dökümanı bul altında bulunan objede tüm userId lerin verilerine ulaş ve virtualAcademies objesinden bu academy e ait ıd yi sil.
//* 2-VirtualAcademyId ile eşleşen dökümanı sil.
async function removeTheAcademy(academyId: string) {
  const { db } = initializeFirebaseClient();
  //! Virtual Academy i bul verileri al.
  const virtualAcademyDocRef = doc(db, "virtualAcademies", academyId);
  const docSnapShot = await getDoc(virtualAcademyDocRef);
  //* Bu id ile eşleşen döküman varsa datayı al.
  if (docSnapShot.exists()) {
    const virtualAcademyData = docSnapShot.data();
    const members = virtualAcademyData.members;

    //* Map asenkron fonksiyonlarda kullanılmak için önerilmiyor.
    // members.map(async (member:any)=>await removeAcademyIdFromUserDoc(member.userId,academyId))
    for (const member of members) {
      try {
        await removeAcademyIdFromUserDoc(member.userId, academyId);
      } catch (error) {
        console.error("Error removing academy ID from user doc", error);
      }
    }

    //* Eşleşen dökümanı silme işlemi
    await deleteDoc(virtualAcademyDocRef);
    return true;
  } else {
    console.error(
      "VirtualAcademy bulunamadı bu hata LeaveTheAcademy.ts den geliyor."
    );
    return false;
  }
}

async function removeAcademyIdFromUserDoc(userId: string, academyId: string) {
  if (!userId) {
    console.error("UserId bulunamadı bu hata LeaveTheAcademy.ts den geliyor");
    return false;
  }

  try {
    const { querySnapShot, db } = await handleGetUserDoc(userId);
    if (!querySnapShot.empty) {
      const userDoc = querySnapShot.docs[0];
      // Döküman referansını tutuyoruz güncelleme işlemi için.
      const userDocRef = doc(db, "users", userDoc.id);
      const currentData = userDoc.data();
      const updatedAcademies = currentData.virtualAcademies.filter(
        (academy: any) => academy.virtualAcademyId !== academyId
      );
      await updateDoc(userDocRef, {
        virtualAcademies: [...updatedAcademies],
      });
    }
  } catch (error) {
    console.error("This error from LeaveTheAcademy.ts", error);
    return false;
  }
}

//* 1-VirtualAcademyId ile eşleşen dökümanı bul altında bulunan objede  userId ile eşleşen id yi sil ve rolü.
//* 2-userId dökümanını bul altında bulunan virtualAcademies objesinden bu id ye ait akademiyi sil.
export async function leaveTheAcademy(academyId: string, userId: string) {
  const { db } = initializeFirebaseClient();
  const virtualAcademyDocRef = doc(db, "virtualAcademies", academyId);
  const docSnapShot = await getDoc(virtualAcademyDocRef);
  if (docSnapShot.exists()) {
    const virtualAcademyData = docSnapShot.data();
    const members = virtualAcademyData.members;
    const updatedMembers = members.filter(
      (member: any) => member.userId !== userId
    );
    await updateDoc(virtualAcademyDocRef, {
      members: [...updatedMembers],
    });
    await removeAcademyIdFromUserDoc(userId, academyId);
    return true;
  } else {
    console.error(
      "VirtualAcademy bulunamadı bu hata LeaveTheAcademy.ts ,leaveTheAcademyFonksiyonundan geliyor."
    );
    return false;
  }
}
