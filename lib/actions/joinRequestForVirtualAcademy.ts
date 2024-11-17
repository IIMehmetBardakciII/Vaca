"use server";

import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";
import { getCookies } from "./Cookies";
import { v4 as uuidv4 } from "uuid";
type getAllJoinRequest = {
  joinRequest: [];
};
export async function joinRequest(academyId: string) {
  const { db } = initializeFirebaseClient();
  const virtualAcademyDocRef = doc(db, "virtualAcademies", academyId);
  const { verifiedToken } = await getCookies();
  if (!verifiedToken || !verifiedToken.email) {
    return { success: false };
  }

  try {
    const docSnapShot = await getDoc(virtualAcademyDocRef);
    if (docSnapShot.exists()) {
      const currentData = docSnapShot.data();
      const newRequest = {
        requestId: uuidv4(),
        userId: verifiedToken.email,
        status: "pending",
        requestDate: new Date(),
      };

      // Mevcut join request'leri al ve yeni isteği ekle
      const updatedJoinRequests = currentData.joinRequests
        ? [...currentData.joinRequests, newRequest] // Eğer joinRequest mevcutsa, yeni isteği ekle
        : [newRequest]; // Yoksa yeni isteği tek başına ekle

      await updateDoc(virtualAcademyDocRef, {
        joinRequests: updatedJoinRequests,
      });
      return { success: true };
    } else {
      return { success: false, message: "Akademi bulunamadı." };
    }
  } catch (error) {
    console.error("Hata:", error);
    throw new Error("Akademiye katılma isteği atılırken bir hata oluştu.");
  }
}

type JoinRequest = {
  requestId: string;
  userId: string;
  status: string;
  requestDate: Date | string; // requestDate'yi string olarak saklayacağız
};

export async function getAllJoinRequest(
  academyId: string
): Promise<JoinRequest[] | null> {
  const { db } = initializeFirebaseClient();
  const virtualAcademyDocRef = doc(db, "virtualAcademies", academyId);
  try {
    const docSnapShot = await getDoc(virtualAcademyDocRef);

    if (docSnapShot.exists()) {
      const virtualAcademyData = docSnapShot.data();

      // Basit nesne döndürme
      const joinRequests = virtualAcademyData.joinRequests.map(
        (request: any) => ({
          requestId: request.requestId,
          userId: request.userId,
          status: request.status,
          requestDate:
            request.requestDate instanceof Timestamp
              ? request.requestDate.toDate().toISOString() // ISO formatında string olarak sakla
              : new Date(request.requestDate).toISOString(),
        })
      );

      return joinRequests; // Dönüşü basit nesne olarak yapıyoruz
    } else {
      console.log(
        "Id ile eşleşen Akademi bulunamadı bu hata getAllJoinRequestten geliyor"
      );
      return null;
    }
  } catch (error) {
    console.error("Hata:", error);
    throw new Error("Veri alınırken bir hata oluştu.");
  }
}
