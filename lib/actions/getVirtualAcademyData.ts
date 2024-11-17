"use server";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";
import { getCookies } from "./Cookies";
import { getUserData } from "./UserData";

type VirtualAcademyData = {
  id: string;
  academyName?: string;
  academyAbout?: string;
  imageFileUrl?: string;
  announcement: string;
  announcementDeadLine: string;
  numberOfStudents: string;
  joinRequests: [];
  members: [];
  virtualClass: [];
};
export const getVirtualAcademyData = async (virtualAcademyId: string) => {
  const { db } = initializeFirebaseClient();
  // Eşleşen dökümanı alıyoruz
  const virtualAcademyDocRef = doc(db, "virtualAcademies", virtualAcademyId);

  try {
    const docSnapShot = await getDoc(virtualAcademyDocRef);

    if (docSnapShot.exists()) {
      const virtualAcademyData = {
        id: docSnapShot.id,
        ...docSnapShot.data(),
      } as VirtualAcademyData;
      return virtualAcademyData;
    } else {
      console.log(
        "Id ile eşleşen Akademi bulunamadı bu hata getVirtualAcademyDatadan geliyor"
      );
      return null;
    }
  } catch (error) {
    console.error("Hata:", error);
    throw new Error("Veri alınırken bir hata oluştu.");
  }
};

export const getAllAcademyData = async () => {
  const { verifiedToken } = await getCookies();
  if (!verifiedToken || !verifiedToken.email) {
    return [];
  }

  const userEmail = verifiedToken.email;

  // Kullanıcı verilerini alma query için.
  const userData = await getUserData(userEmail as string);
  const userJoinedAcademies = userData.virtualAcademies.map(
    (academy: any) => academy.virtualAcademyId
  );

  const { db } = initializeFirebaseClient();
  const virtualAcademiesCollectionRef = collection(db, "virtualAcademies");
  const queryForSort = query(
    virtualAcademiesCollectionRef,
    orderBy("createdAt", "desc")
  );
  const snapShot = await getDocs(queryForSort);
  const academyData = snapShot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        academyName: data.academyName,
        academyAbout: data.academyAbout,
        announcement: data.announcement,
        announcementDeadLine: data.announcementDeadLine,
        imageFileUrl: data.imageFileUrl,
        numberOfStudents: data.numberOfStudents,
      };
    })
    .filter((academy) => !userJoinedAcademies.includes(academy.id));
  return academyData;
};
