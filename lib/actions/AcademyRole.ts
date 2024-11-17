"use server";

import { collection, query, where, getDocs } from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";
import { getCookies } from "./Cookies";

export async function getRole(academyId: string) {
  const { verifiedToken } = await getCookies();
  if (!verifiedToken || !verifiedToken.email) {
    return null;
  }
  const { db } = initializeFirebaseClient();
  const userCollectionRef = collection(db, "users");
  const que = query(
    userCollectionRef,
    where("email", "==", verifiedToken.email)
  );
  const querySnapShot = await getDocs(que);
  if (!querySnapShot.empty) {
    const data = querySnapShot.docs[0].data();
    const academy = data.virtualAcademies.find(
      (academy: any) => academy.virtualAcademyId === academyId
    );
    if (academy) {
      return academy.role;
    } else {
      return null;
    }
  } else {
    throw new Error("User verisi bulunamadı. This error from AcademyRole.ts");
  }
}
