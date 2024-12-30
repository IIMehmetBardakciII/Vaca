"use server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";
import { getUserData, handleGetUserDoc } from "./UserData";
import { revalidatePath } from "next/cache";

type assignTheUser = {
  userId: string;
  role: string;
  academyId: string;
};
export async function assignTheUser({
  userId,
  role,
  academyId,
}: assignTheUser) {
  const { db } = initializeFirebaseClient();
  try {
    //* Akademideki üyeyi güncelle
    await handleAssignMemberRoleToAcademy(db, academyId, userId, role);

    //* Kullanıcıdaki role'ü güncelle
    await handleAssignRoleToUser(db, academyId, userId, role);
    console.log("Role successfully updated in user and academy.");
    revalidatePath(`/virtual-academy/${academyId}/getAllUsers`);
  } catch (error) {
    console.error("Error updating role", error);
    throw error;
  }
}

//* Akademideki üyeye rol atama işlemi
async function handleAssignMemberRoleToAcademy(
  db: any,
  academyId: string,
  email: string,
  role: string
) {
  const academyDocRef = doc(db, "virtualAcademies", academyId);
  const academySnap = await getDoc(academyDocRef);
  if (academySnap.exists()) {
    const academyData = academySnap.data();
    if (academyData.members && Array.isArray(academyData.members)) {
      const targetMember = academyData.members.find(
        (member: any) => member.userId === email
      );

      if (targetMember) {
        targetMember.role = role; // Akademideki role güncelle
        await updateDoc(academyDocRef, {
          members: academyData.members,
        });
      } else {
        throw new Error(
          `Member with email ${email} not found in academy ${academyId}.`
        );
      }
    } else {
      throw new Error("Academy members field is missing or not an array.");
    }
  } else {
    throw new Error(`Academy with ID ${academyId} not found.`);
  }
}

//* Kullanıcıdaki rolü atama.
async function handleAssignRoleToUser(
  db: any,
  academyId: string,
  email: string,
  role: string
) {
  const userData = await getUserData(email);
  if (userData.virtualAcademies && Array.isArray(userData.virtualAcademies)) {
    const targetAcademy = userData.virtualAcademies.find(
      (academy: any) => academy.virtualAcademyId === academyId
    );

    if (targetAcademy) {
      targetAcademy.role = role;
      // Dökümanı güncelleme
      const { querySnapShot } = await handleGetUserDoc(email);
      if (!querySnapShot.empty) {
        const userDoc = querySnapShot.docs[0];
        const userDocRef = doc(db, "users", userDoc.id);
        await updateDoc(userDocRef, {
          virtualAcademies: userData.virtualAcademies,
        });
      }
    } else {
      throw new Error(
        "VirtualacademyId ile eşleşen targetAkademi bulunamadı bu hata AssignTheUser.ts den geliyor"
      );
    }
  } else {
    throw new Error(
      "VirtualAcademies boş ya da array değil. Bu hata AssignTheUser.ts den geliyor."
    );
  }
}
